# 路由守卫速查

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> API 细节对照本仓库实际安装的版本核对过：vue-router 5.3.1（守卫写法与 4.x 一致）。

## 守卫在导航流程里的位置

一次导航（点链接、`router.push`、地址栏回车、刷新）会依次经过：

| 顺序 | 位置     | 注册方式                                     | 用途                               |
| ---- | -------- | -------------------------------------------- | ---------------------------------- |
| 1    | 全局前置 | `router.beforeEach((to, from) => {})`        | 登录鉴权、埋点、改标题             |
| 2    | 路由独享 | 路由记录里的 `beforeEnter`                   | 只有某个路由需要的判断             |
| 3    | 组件内   | `onBeforeRouteUpdate` / `onBeforeRouteLeave` | 未保存内容提醒、切换文章时复查参数 |
| 4    | 全局解析 | `router.beforeResolve((to) => {})`           | 等异步组件 / 异步数据准备好        |
| 5    | 导航确认 | —                                            | 真正切换，随后触发 `afterEach`     |

`beforeRouteEnter` 特殊在拿不到 `this`（组件还没创建），进入前的逻辑现在基本可以用守卫里的 `await` 代替。

## 返回值即语义（不要再用 next）

vue-router 4 起推荐从守卫里 **return**，`next` 属于旧写法。本仓库 vue-router 5.3.1 的类型定义：

```ts
type NavigationGuardReturn = void | Error | boolean | RouteLocationRaw
```

`next` 参数仍然会传进来，但源码里已标注 `@deprecated`（"Return a value from the guard instead of calling `next(value)`"），未来版本会移除。

| 返回值                  | 结果                             |
| ----------------------- | -------------------------------- |
| `undefined` / `true`    | 放行                             |
| `false`                 | 取消这次导航，停在原页面         |
| 路由地址（字符串 / 对象）| 重定向到该地址，本轮导航作废     |
| `Error`                 | 中断并交给 `router.onError` 处理 |

异步守卫直接把结果 `return` 出去即可。**最常见的坑是写了 `async` 却既不 return 也不调 `next`**：导航会静默卡住，页面什么都不发生，控制台也不报错。

## meta 标记 + 全局鉴权

给需要登录的路由打标记，守卫只读标记，不给每个路由写 if：

```js
const routes = [
    { path: 'login', name: 'login', component: Login },
    {
        path: 'article/:identifier?',
        name: 'article',
        component: Article,
        meta: { requiresAuth: true },
    },
]

router.beforeEach(async (to) => {
    const auth = useAuthStore()
    if (!to.meta.requiresAuth) return
    await auth.ensureUser()
    if (!auth.isLoggedIn)
        return { name: 'login', query: { redirect: to.fullPath } }
})
```

要点：

- `to.meta` 是**合并后**的 meta：父子路由的 meta 会沿着 `to.matched` 合到 `to.meta` 上，所以标记打在外层 layout 上也生效
- 把原目标记进 `query.redirect`，登录成功后 `router.push(route.query.redirect || '/')` 跳回去。只接受站内路径（以 `/` 开头且不以 `//` 开头），否则就是一个 open redirect
- 被拦下来的目标页自己不能也要求登录，否则形成死循环；守卫最好只拦明确的 `requiresAuth`，别用"除了 A 和 B 都拦"这种反向写法
- 守卫里可以 `useAuthStore()`，但必须保证已经 `app.use(createPinia())`。`createRouter()` 本身不执行守卫，真正执行的时机是第一次导航

## 刷新页面时守卫什么时候跑

刷新本身就是一次导航，守卫照常执行。守卫里 `await` 的 promise 会拖住这次导航，这正是"刷新后仍在登录态、且不会闪一下未登录"所需要的效果。

`router.isReady()` 返回一个 promise，在**首个导航完成后** resolve：

```js
app.use(router)
await router.isReady()
app.mount('#app')
```

这样挂载时路由已经就位。代价是首屏要多等一次请求，用不用看具体项目。

## 本项目现状

- 路由带可选语言前缀（`/:lang(zh|en)?`），`to.fullPath` 会带上它；跳转时用 `{ name: 'login' }` 比手拼路径省事
- 哪些页面算"受限页"还没定（见 [todo.md](../todo.md) 的 0.0.4），目前只有 `login` / `register` 是明确的公开页
- 守卫还没写，`meta.requiresAuth` 也还没打
