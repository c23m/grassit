# 0.0.4 里 AI 代写的代码（待复核）

> 生命周期：临时 ｜ 删除条件：作者复核完 0.0.4 后 ｜ AI 代写的代码清单，以及「刷新后登录态没了」的排查与修复记录

> 用途：把 0.0.4 期间 AI 替作者写的代码、以及"刷新后登录态没了"这个问题的排查与修复过程记下来，供作者回头看。复核完按"做完即删"处理。
> 规范看 [components.md](../specs/components.md)，速查与笔记见 [notes/](../notes/)。**看代码前先过一遍 [project-primer.md](../notes/project-primer.md)**（整个项目的零基础知识导读，0.0.4 这轮用到的点都在里面）。写于 2026-10-02；结论以代码与实测为准。

## 一、AI 动手的代码

"原计划"一列说明这块本来是谁的活 —— 标着**作者**的，就是 AI 代劳、最该回头看的。

| 文件                                   | 原计划     | 改了什么                                                                                                                                                                                       | 复核时看什么                                                                                                                                                           |
| -------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/layouts/BaseLayout.vue`    | 作者提需求 | 删掉 `Footer` 的 import 与 `<Footer />`，让页脚只在首页出现（`Home.vue` 是顶层路由，自己引）                                                                                                   | 布局的 `flex` + `min-height: 100vh` 是否还成立                                                                                                                         |
| `components/layouts/Footer.vue`        | 作者给内容 | 重写：GitHub 图标（复用 `Icon.vue` 的 `github`，链到 `github.com/c23m`）、ICP 备案号、`© 2026 grassit`、说明；删掉「关于 / 联系 / 查找 / 发布」四个 `#` 链接、公安备案占位，以及随之废弃的 CSS | 说明那句留不留（`todo.md` 里挂着）                                                                                                                                     |
| `components/layouts/nav/NavBar.vue`    | 作者给结构 | 四格全交给 flex：logo `flex: none`、`ul` 从 `position: absolute` 改回流内 `flex: 1` 内容居中、`.buttons` 与用户区宽度自适应；图标区与用户区之间加 `\|`；间距统一 1rem；`padding: 0 1rem`       | ① `justify-content: space-between` 为什么留着（移动端没有 `ul`，靠它把图标顶到右边）② 纵向 padding 为什么是 0（`.logo` 取 `height: 100%`，上下加内边距会把 logo 压矮） |
| `assets/styles/base.css`               | 作者给需求 | 新增公用 `.divider`：`font-weight: var(--text-weight-thin)` + `color: var(--color-text-weak)`                                                                                                  | 放在 `.sr-only` 那一带（公用小工具），组件里只管"什么时候显示"                                                                                                         |
| `components/layouts/nav/NavAvatar.vue` | **作者**   | 作者写了草稿（`Link` + `useAuthStore`，`username`/`nickname` 还没来源），AI 补完：`storeToRefs`、未登录态的「注册 \| 登录」、`.user` 样式从 `NavBar` 搬进来                                    | 第二、三节                                                                                                                                                             |
| `stores/auth.js`                       | **作者**   | 新增 `restore()`（第 43-58 行）                                                                                                                                                                | 第二节                                                                                                                                                                 |
| `main.js`                              | **作者**   | 挂载之后调 `useAuthStore().restore()`                                                                                                                                                          | 第二节                                                                                                                                                                 |

## 二、"刷新后登录态没了"是怎么修好的

**两个独立原因叠在一起**，只修一个都不通。

### 原因一：`fetchMe` 没有任何调用点

`stores/auth.js` 里 `fetchMe` 早就写好了（合并并发请求、401 才清 token），但全项目没人调它 —— 登录时 `user` 是 `login()` 的响应直接写进内存的，一刷新就归零，没人拿 localStorage 里的 token 去换回用户信息。

修法：store 加一个幂等的 `restore()`，`main.js` 在挂载后调一次。

```js
// 启动时恢复登录态：没 token 或已经有 user 就直接返回；并发调用共享同一次请求
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

```js
// main.js：故意不 await，先渲染页面，拿到 user 后导航栏自己更新。
// 放在 mount 之后，是为了万一 401 触发拦截器里的跳转时，router 已经装好了
useAuthStore().restore()
```

要点：请求合并与 401 处理仍归 `fetchMe`，`restore()` 只负责"什么时候跑一次"，不重复实现。

### 原因二：解构 store 丢了响应性（更隐蔽）

NavAvatar 里原本是 `const { user } = useAuthStore()`。**Pinia 的 store 是 `reactive` 对象**（源码 `pinia.esm-browser.js` 里 `const store = reactive(assign({...}, partialStore))`），读 `store.user` 会把 ref 解包成**当前的值**，所以解构出来的是一个永远不变的快照 —— `me` 回来之后 store 里确实更新了，组件手里那份还是 `null`。

修法：

```js
import { storeToRefs } from 'pinia'
const { user } = storeToRefs(useAuthStore())
```

这条**自己笔记里就写过**：[../reference/pinia.md](../notes/pinia.md) 第 44-52 行「解构会丢响应性」。注意 action 不受影响（`Login.vue` 里的 `const { login } = useAuthStore()` 是对的）。

### 为什么现象那么拧巴

| 场景             | 为什么表现不同                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 登录后能看到昵称 | 登录成功跳 `/home`，而 Home 是**顶层路由、自带一份 NavBar**，NavAvatar 整个重新挂载，setup 重新读了一次 store —— 此时值已经写进去了 |
| 刷新后换不上     | 首屏挂载时 `user` 还是 `null`，被解构成了快照；之后更新不再触发渲染                                                                 |

### 实测数据（用测试账号打后端验的）

| 调用                                                        | 结果                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| `POST /auth/login`（123 / R12345）                          | 200，返回 token + `{"username":"123","nickname":"456",...}` |
| `GET /users/me`（带 token，直连 8000 与经 Vite 代理各一次） | 200，`nickname` 就是 `456`                                  |
| `POST /auth/refresh`（无 cookie）                           | 401 `Invalid refresh token`                                 |
| token 的 `exp`                                              | 签发后 15 分钟                                              |

### 现在的边界（还没解决）

access token 15 分钟就过期，而 401 → `/auth/refresh` → 重放那条链是 **0.0.5** 的活（cookie 里还是占位值，refresh 必然 401）。所以过期后再刷新：拦截器会清掉 token 并跳登录页；此后 `restore()` 见 token 为空直接返回，**连 `me` 请求都不会发**。这不是恢复逻辑坏了，是 refresh 闭环没做。

### 可复用的排查套路

- DevTools → Network 的**「发起程序」列直接指向代码位置**（这次就是靠 `auth.js:7` 认出请求出自 `getMe()`，而 `getMe` 全项目只有一个调用点）
- 拿真实账号直接 `curl` 打接口验契约，别靠猜；顺带用「经 Vite 代理」的地址再验一遍，因为浏览器走的是那条路
- 症状自相矛盾时，先分成两类：**数据没到**（请求/状态问题）还是**数据到了界面没换**（响应式/渲染问题）

## 三、我替你做的取舍（不同意就改）

- 竖线（`|`）窄屏不显示：窄屏的入口都收进菜单面板了，导航栏只剩 logo + 图标
- 昵称链到 `/user/<username>`：路由已注册（空壳 `Dashboard.vue`），点进去是空白页而不是 404

## 四、0.0.4 的完成情况

代码全部落地（改动文件都过了一遍 SFC / Babel 编译检查），**等你按 [../todo.md](../todo.md) 的验收链路实测**：

注册 → 登录 → 导航栏出现昵称 → 刷新仍在登录态 → 未登录访问 `/user/<username>` 被拦回 `/login`。

通过之后就按版本约定收尾：CHANGELOG 记一条 → 从 `todo.md` 移除 0.0.4 → 打 `v0.0.4` → 更新 `HANDOVER.md`。

## 五、收尾这一轮又加的（同样待复核）

| 文件                                   | 原计划     | 改了什么                                                                                                                                                                                                          |
| -------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `router/index.js`                      | **作者**   | 加 `beforeEach` 守卫：先 `await auth.restore()`（刷新后恢复登录态，幂等），再按 `meta` 放行或跳转；`login` / `register` 标 `meta.guestOnly`；**新增 `/user/:username` → `Dashboard.vue`**，标 `meta.requiresAuth` |
| `main.js`                              | **作者**   | 撤掉挂载后的 `restore()` 调用 —— 守卫会 `await` 它，首屏渲染前 user 就位，不会再闪                                                                                                                                |
| `views/Playground.vue`                 | 作者指定   | 加「登录态（走 store）」一块：显示当前用户 + 退出登录按钮（调试页收还没做界面的功能）                                                                                                                             |
| `components/layouts/nav/NavBar.vue`    | 作者定范围 | 摘掉 GitHub 链接；用户区包进 `.user-slot`（只在宽屏出现）；新增移动端菜单面板 `.menu`；顺手删掉没用到的 `onMounted` 导入                                                                                          |
| `components/layouts/nav/NavAvatar.vue` | 作者指定   | 去掉媒体查询与"窄屏不显示"，改成只管内容长相，出现位置由 `NavBar` 决定                                                                                                                                            |
| `components/layouts/Footer.vue`        | 作者指定   | 删掉「内容供个人学习交流使用」                                                                                                                                                                                    |

几处需要你知道的判断：

- **把空壳 `Dashboard.vue` 挂到 `/user/:username`**：不这么做，"未登录被拦回 `/login`"这条验收就没有可测对象，昵称链接也会落到 404。页面本身还是空的，0.2.x 填内容
- **移动端菜单面板是基线版**：绝对定位贴在导航栏下方、纵向排列、点一下收起，样式随你改
- **`router/index.js` 现在 import store，而 store 又 import router**：循环依赖，但两边都只在函数体里用（守卫回调 / `logout`），属于延迟解析，不会出问题
- 顺带一个小隐患：`stores/auth.js` 的 `logout()` 先 `await logoutApi()` 再清状态 —— 接口失败时本地状态不会被清掉，界面上会像"退出没反应"。要不要改成先清本地再尽力通知后端，你说一声

## 附：本次排查过的两个环境问题（与仓库代码无关）

- **DSH 的 Open In → VS Code 打不开**：DSH 宿主进程自身带着 `ELECTRON_RUN_AS_NODE=1`（它自己是以 Node 模式起的），而 `dsh-subprocess` 的 `scrubbedParentEnv()` 只过滤 `*KEY*/*PASSWORD*/*SECRET*/*TOKEN*` 与 `DSH_*`，没过滤这个变量 → VS Code（Electron 应用）被当 Node 跑，`Code.exe <目录>` 变成"用 Node 执行该目录"，55ms 退出 code=1 → 界面报「打开失败，请重试」。IntelliJ IDEA、Git Bash、文件资源管理器不受影响；文件卡片那条路走系统 shell，由已在运行的 explorer 起 VS Code，所以是好的
- **仓库部分文件的权限**：`docs/`、`CHANGELOG.md` 等归 `BUILTIN\Administrators`，`AGENTS.md`、`HANDOVER.md`、`docs/notes/`（当时叫 `docs/reference/`）归 `LAPTOP-MING725\CodexSandboxOffline`（另一个 agent 的沙箱账号）。受限沙箱下删 `docs/` 里的文件会被拒（缺"更改权限"一项，且所有者不是当前用户），临时放宽一次权限即可
