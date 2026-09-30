# 前端页面与组件基准

> 本文件是项目规范的一部分：前端页面与组件的**结构基准**，新增页面、改组件、加 props 之前先对齐这里。参考笔记都在 [docs/reference/](../reference/)，这边引用哪些见 [references.md](references.md)。
> 内容以代码实测为准；发现代码与本文件不一致时先判断哪个是对的，再同步另一方。

## 约定

- **放哪**：页面放 `views/`；整页骨架与导航类放 `components/layouts/`；跨页面复用的基础件放 `components/common/`；与具体业务绑定的展示件放 `components/misc/`。同类到三个以上再收子包。
- **命名**：文件名 PascalCase，与组件名一致；props 用 camelCase；`common/` 里的组件默认值和类型都要写全。
- **导出**：`components/common/index.js` 只聚合与业务无关的基础件（当前是 `Button`、`Radio`、`TextInput`、`Textarea`、`Link`）；`Icon`、`Avatar`、`Aside` 这类按完整路径引。新组件先想清楚要不要进聚合入口。
- **数据获取**：页面层用 `vue-request` 的 `useRequest` 或 `composables/useAsync`，不直接 import axios；所有请求走 `utils/request.js`（它负责带 token 和解包）。
- **样式**：组件一律 `<style scoped>`，颜色尺寸取 `assets/styles/base.css` 里的 CSS 变量，不写死颜色。
- **页面路由**：在 `router/index.js` 注册；需要登录的页面将来打 `meta.requiresAuth`（守卫还没实现，见 [router-guards.md](../reference/router-guards.md)）。

## 页面（`views/`）

### Home.vue · 首页

- **路由**：`/:lang(zh|en)?/home`，以及 `/:lang(zh|en)?` 重定向过来
- **状态**：在用
- **结构**：自带整页骨架（header + `NavBar` + `main` + `Footer`），不套 `BaseLayout`——它在路由表里是顶层路由，不在布局父路由底下
- **数据**：`useRequest(() => getArticles())` 拉文章列表塞给 `Aside`；右侧"推荐列表"是写死的数组，不走接口
- **注意**：import 了 `BaseLayout` 和 `@vueuse/core` 的 `get`，模板里都没用到，属于残留

### Article.vue · 文章详情

- **路由**：`/:lang(zh|en)?/article/:identifier?`，props 为 `identifier`
- **状态**：半成品
- **结构**：预期是 `Aside` 目录 + 正文两栏，正文用 `marked` 渲染成 HTML
- **注意**：数据获取、`marked.parse`、`watch`/`onMounted` 以及整段模板**目前全部被注释**，页面渲染出来是空的；重启这块时要顺带处理 XSS（`v-html` 直接渲染用户内容是入口，见 [todo.md](../todo.md) 的 0.1.0）

### Login.vue · 登录

- **路由**：`/:lang(zh|en)?/login`
- **状态**：半成品（布局已定，样式与提交逻辑待做）
- **结构**：`section.login` > `h2` + `form`（用户名、密码两个 `fieldset`）+ 提交按钮 + 错误提示位 + `hr` + 其他登录方式占位
- **注意**：已接 store（`useAuthStore`），但 `onSubmit` 还是空函数；401 要显示成人话（见 [auth-form-parts.md](auth-form-parts.md)、[form-errors.md](form-errors.md)）

### Register.vue · 注册

- **路由**：`/:lang(zh|en)?/register`
- **状态**：空壳
- **结构**：待定，按 0.0.4 是用户名 / 昵称 / 密码 / 邮箱四个字段 + 提交
- **注意**：409 的 `detail` 是字符串、422 的是数组，两种都要能显示成人话

### Playground.vue · 调试页

- **路由**：`/:lang(zh|en)?/playground`
- **状态**：在用（开发自用）
- **结构**：`useRequest` 打 `/test` 系列接口，附一个直接调 `login` 的表单
- **注意**：属于临时工具，不承诺长期存在

### ApiTest.vue · 接口测试页

- **路由**：`/:lang(zh|en)?/test`
- **状态**：停用
- **注意**：script 与模板**整份被注释**，页面是空的；0.2.x 计划改造成"直连真实接口"（见 [todo.md](../todo.md)）

### Dashboard.vue · 用户主页

- **路由**：还没注册
- **状态**：空壳
- **去向**：0.2.x 的仪表盘（用户主页），见 [todo.md](../todo.md)

### NotFound.vue · 404

- **路由**：`/:pathMatch(.*)*`
- **状态**：在用
- **结构**：`BaseLayout` + 提示文案 + `Link`
- **注意**：10 秒倒计时后 `location.href = '/'`，是整页刷新而不是路由跳转；将来改成 `router.push` 才是 SPA 的做法

## 布局组件（`components/layouts/`）

### BaseLayout.vue

- **状态**：在用
- **结构**：引 `base.css`，`NavBar` + `<main><RouterView /></main>` + `Footer`
- **用法**：路由里作为父路由，包住 `register` / `login` / `article` / `test` / `playground`

### nav/NavBar.vue

- **状态**：在用
- **结构**：logo、桌面端菜单（首页 / 文档 / api测试 / 调试 / 文本）、主题切换（`useDark`）、GitHub 链接、移动端菜单图标
- **注意**：`menuOpen` 目前只切换状态，移动端菜单面板还没渲染；用户区（`NavAvatar`）也还没挂进来——这是 0.0.4 的活

### nav/NavAvatar.vue

- **状态**：空壳，目前没有任何地方引用
- **去向**：0.0.4 的用户区：已登录显示头像、未登录显示登录入口

### nav/NavSearch.vue

- **状态**：空壳，目前没有任何地方引用
- **去向**：0.2.x 的导航栏搜索框

### Footer.vue

- **状态**：在用
- **结构**：静态链接（关于 / 联系 / 查找…），链到 `#`
- **注意**：真实链接和页面都还没有

## 通用组件（`components/common/`）

### Button.vue

- **接口**：props `type`（默认 `button`）、`disabled`；插槽是文字
- **注意**：默认 `type="button"`，表单里提交要显式写 `type="submit"`；没有 loading 态，提交中靠 `disabled` 兜

### TextInput.vue

- **接口**：props `placeholder`、`disabled`；`v-model`
- **注意**：内部写死 `type="text"`，没有 `type` prop——做密码框要么加 prop，要么用原生 input

### Textarea.vue

- **接口**：props `placeholder`、`disabled`；`v-model`
- **去向**：发文页会用

### Radio.vue

- **接口**：props `value`（必填）、`disabled`；`v-model`；插槽是标签文字

### Link.vue

- **接口**：props `url`、`title`
- **行为**：`http(s)://` 开头走 `<a target="_blank">`，其余用 `RouterLink`
- **注意**：`url` 为空时会渲染成空链接，别忘记传

### Icon.vue

- **接口**：props `name`（必填）、`title`
- **注意**：白名单式，只有 `github`、`light`、`dark`、`menu`、`translate`、`external` 六个；加图标要改里面的 `icons` 对象，图标用 unplugin-icons 引（`~icons/mdi/...`、`~icons/material-symbols/...`）

### Aside.vue

- **接口**：props `items`（数组，每项 `{ url, title, subtitle }`）；默认插槽是标题
- **用法**：`Home` 的文章列表、`Article` 的目录

### Avatar.vue

- **状态**：空壳（只有一个空 `Link`），没有任何地方引用
- **去向**：给 `NavAvatar` 用的头像展示件

## 业务展示件（`components/misc/`）

### RecommendCard.vue

- **接口**：props `recommend`
- **结构**：`<li>` 卡片，按图片名在 `sunny` / `dessert` / `dark` 三张图里选，内部用 `Link` 和 `Button`
- **用法**：`Home` 的推荐列表

## 配套模块（非组件）

### `api/`

接口层，按领域分文件：`auth.js`（login / logout / register / refresh / getMe）、`article.js`（getArticles / getArticle / uploadArticle）、`user.js`（getUser / deleteUser）。页面只调这里，不直接碰 axios。

### `utils/request.js`

axios 实例：请求自动带 `Authorization: Bearer <token>`，成功响应解包成 `response.data`，401 时尝试刷新后重放。`utils/index.js` 只写了 `export * from './request.js'`，**导不出 default**，要引就引 `./request.js`。

### `stores/auth.js`

登录态：`token`（`useLocalStorage('token')`）、`user`、`login(username, password)` / `fetchMe()` / `logout()`。登录是**位置参数**，内部 `router.push('/')`，响应里直接带 user；`fetchMe` 会合并并发请求、失败时清掉 token。目前只有 `Login.vue` 用它，**启动时恢复还没做**（刷新后 `user` 仍是 null）。

### `composables/`

`useAysnc.js`（文件名拼错了，导出 `useAsync`；返回 `{ data, loading, error, execute }`，但会吞掉异常、`error` 里只有 `err.message`）和 `useCache.js`（用 localStorage 存定长列表）。

### `router/index.js`

路由表，路径统一带可选语言前缀 `/:lang(zh|en)?`。`BaseLayout` 是父路由，`Home` 和 `NotFound` 在它之外。守卫与 `meta` 还没写。
