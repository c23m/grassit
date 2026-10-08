# 刷新后登录态没了：两个原因与排查套路

> 用途：通读 ｜ 一次真实排查的复盘：为什么"登录后能看到昵称、一刷新就没了"，以及怎么系统地定位这类问题

> 参考笔记（学习用），不是项目规范；代码以 `frontend/src` 为准，写于 0.0.4 收尾时。

## 现象

登录后导航栏能看到昵称，**一刷新就变回「注册 | 登录」**，控制台没有任何报错。

两个独立原因叠在一起，只修一个都不通。

## 原因一：`fetchMe` 早就写好了，但全项目没人调它

`stores/auth.js` 里的 `fetchMe`（合并并发请求、401 才清 token）没有任何调用点 —— 登录时 `user` 是 `login()` 的响应直接写进内存的，一刷新就归零，没人拿 localStorage 里的 token 去换回用户信息。

修法是加一个幂等的 `restore()`，只负责"什么时候跑一次"，请求合并与 401 处理仍归 `fetchMe`：

```js
// 没 token 或已经有 user 就直接返回；并发调用共享同一次请求
let restoring = null
const restore = () => {
  if (!token.value || user.value) return Promise.resolve()
  restoring ??= fetchMe()
    .catch(() => {}) // 401 已由 fetchMe 清掉登录态；网络错误保留 token，下次还能试
    .finally(() => {
      restoring = null
    })
  return restoring
}
```

**它现在挂在路由守卫里**（`router/index.js` 的 `beforeEach` 里 `await auth.restore()`），不是早期那版放在 `main.js` 里挂载后调用。放守卫里的好处是"首屏渲染前 user 已经就位"；代价是首次渲染要等这一次请求。`restore()` 幂等，所以每次导航 `await` 它没有额外开销。

## 原因二：解构 store 丢了响应性

`NavAvatar` 里原本是 `const { user } = useAuthStore()`。Pinia 的 store 是 `reactive` 对象，读 `store.user` 会把 ref 解包成**当前的值**，所以解构出来的是一个永远不变的快照 —— `me` 回来之后 store 里确实更新了，组件手里那份还是 `null`。

修法是 `storeToRefs`。**这条在 [pinia.md](pinia.md) 的「解构会丢响应性」一节里早就写过**，这里只留指路，不重复。注意 action 不受影响（`const { login } = useAuthStore()` 是对的）。

## 为什么现象那么拧巴

| 场景             | 为什么表现不同                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 登录后能看到昵称 | 登录成功跳 `/home`，而 Home 是**顶层路由、自带一份 NavBar**，NavAvatar 整个重新挂载，setup 重新读了一次 store —— 此时值已经写进去了 |
| 刷新后换不上     | 首屏挂载时 `user` 还是 `null`，被解构成了快照；之后更新不再触发渲染                                                                 |

## 0.0.5 补上的部分

401 → `/api/auth/refresh` → 重放那条链现在在 `frontend/src/utils/request.js` 里：并发 401 只刷一次、刷新请求自己 401 不递归、刷新失败清空登录态并回 `/login`。

这里还牵出一个更早的问题：cookie 的 `path` 原本写的是 `/auth`，而浏览器实际请求的是 `/api/auth/refresh`（代理层会剥掉 `/api`），路径匹配不上、cookie 根本不会被带上，所以**那条链在浏览器里必然 401**；只有直连后端的 `/auth/refresh` 是通的。现已改成 `/api/auth`（改之前登录的那份 cookie 作废，要重新登录一次）。

刷新失败之后的表现仍然是上面说的那样：`restore()` 见 token 为空直接返回，**连 `me` 请求都不会发**。这不是恢复逻辑坏了。

## 可复用的排查套路

- DevTools → Network 的**「发起程序」列直接指向代码位置**：这次就是靠 `auth.js:7` 认出请求出自 `getMe()`，而它全项目只有一个调用点
- 拿真实账号直接 `curl` 打接口验契约，别靠猜；再用「经 Vite 代理」的地址验一遍，因为浏览器走的是那条路
- 症状自相矛盾时先分成两类：**数据没到**（请求 / 状态问题）还是**数据到了界面没换**（响应式 / 渲染问题）。这次的答案是一半一半 —— 两个原因各占一类，所以只修一个都没用

## 当时的实测数据

| 调用                                                        | 结果                        |
| ----------------------------------------------------------- | --------------------------- |
| `POST /auth/login`                                          | 200，返回 token + user      |
| `GET /users/me`（带 token，直连 8000 与经 Vite 代理各一次） | 200，`nickname` 正确        |
| `POST /auth/refresh`（无 cookie）                           | 401 `Invalid refresh token` |
| token 的 `exp`                                              | 签发后 15 分钟              |
