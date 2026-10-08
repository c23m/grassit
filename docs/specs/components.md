# 前端页面与组件基准

> 状态：已定案 ｜ 前端页面与组件的结构基准：放哪、命名、导出、取数、样式、路由；另附页面清单

> 本文件是项目规范的一部分：前端页面与组件的**结构基准**，新增页面、改组件、加 props 之前先对齐这里。参考笔记都在 [docs/notes/](../notes/)，文档地图见 [docs/README.md](../README.md)。
> 内容以代码实测为准；发现代码与本文件不一致时先判断哪个是对的，再同步另一方。

## 约定

- **放哪**：页面放 `views/`；整页骨架与导航类放 `components/layouts/`；跨页面复用的基础件放 `components/common/`；与具体业务绑定的展示件放 `components/misc/`。同类到三个以上再收子包。
- **命名**：文件名 PascalCase，与组件名一致；props 用 camelCase；`common/` 里的组件默认值和类型都要写全。
- **导出**：`components/common/index.js` 只聚合与业务无关的基础件（当前是 `Button`、`Radio`、`TextInput`、`Textarea`、`Link`）；`Icon`、`Avatar`、`Aside` 这类按完整路径引。新组件先想清楚要不要进聚合入口。
- **数据获取**：页面层用 `vue-request` 的 `useRequest` 或 `composables/useAsync`，不直接 import axios；所有请求走 `utils/request.js`（它负责带 token 和解包）。
- **样式**：组件一律 `<style scoped>`，颜色尺寸取 `assets/styles/base.css` 里的 CSS 变量，不写死颜色。
- **页面路由**：在 `router/index.js` 注册；受限页打 `meta.requiresAuth`，游客页（`login` / `register`）打 `meta.guestOnly`（守卫见 [router-guards.md](../notes/router-guards.md)）。

## 页面（`views/`）

### Home.vue · 首页

- **路由**：`/:lang(zh|en)?/home`，以及 `/:lang(zh|en)?` 重定向过来
- **状态**：在用
- **结构**：自带整页骨架（header + `NavBar` + `main` + `Footer`，页脚全站只在这个页面出现），不套 `BaseLayout`——它在路由表里是顶层路由，不在布局父路由底下
- **数据**：`useRequest(() => getArticles())` 拉文章列表塞给 `Aside`；右侧"推荐列表"是写死的数组，不走接口，第一条是通往 `/playground` 的调试页
- **注意**：import 了 `BaseLayout` 和 `@vueuse/core` 的 `get`，模板里都没用到，属于残留

### Article.vue · 文章详情

- **路由**：`/:lang(zh|en)?/article/:identifier?`，props 为 `identifier`
- **状态**：半成品
- **结构**：预期是 `Aside` 目录 + 正文两栏，正文用 `marked` 渲染成 HTML
- **注意**：数据获取、`marked.parse`、`watch`/`onMounted` 以及整段模板**目前全部被注释**，页面渲染出来是空的；重启这块时要顺带处理 XSS（`v-html` 直接渲染用户内容是入口，见 [todo.md](../todo.md) 的 0.1.0）

### Login.vue · 登录

- **路由**：`/:lang(zh|en)?/login`
- **状态**：完成
- **结构**：`section.login` > `h2` + `form`（用户名、密码两个 `fieldset`）+ 提交按钮 + 提示位 + `hr` + 其他登录方式占位行（邮箱 / GitHub 是不带 `href` 的占位 `<a>`，右侧「去注册」）
- **注意**：走 store 的 `login()`（store 只管写状态）；成功后按钮上方居中显示「登录成功」，表单与按钮一起禁用，1 秒后跳首页；401 转成「用户名或密码错误」

### Register.vue · 注册

- **路由**：`/:lang(zh|en)?/register`
- **状态**：完成
- **结构**：`section.register` > `h2` + `form`（用户名、昵称、密码三个必填 + 邮箱可选）+ 提交按钮 + 提示位 + `hr` + 底部「登录」链接
- **注意**：直连 `api/auth.js` 的 `register`（注册响应没有 token，回登录页自己登）；字段级错误显示在各自标签右侧，落不到字段的错误居中显示在按钮上方，成功后同样在那一行显示「注册成功」，表单与按钮一起禁用，1 秒后跳登录页；前端规则镜像 `schemas/auth.py`，失焦时检查；邮箱留空要发 `null`，空字符串会被后端 `EmailStr` 判成格式错误

### Playground.vue · 调试页

- **路由**：`/:lang(zh|en)?/playground`
- **状态**：在用（开发自用）
- **结构**：顶部是开发入口（登录 / 注册 / api 测试），下面 `useRequest` 打 `/test` 系列接口，附一个直接调 `login` 的表单（老代码，参数直接传了 ref）
- **注意**：属于临时工具，不承诺长期存在

### ApiTest.vue · 接口测试页

- **路由**：`/:lang(zh|en)?/test`
- **状态**：停用
- **注意**：script 与模板**整份被注释**，页面是空的；0.2.x 计划改造成"直连真实接口"（见 [todo.md](../todo.md)）

### Dashboard.vue · 用户主页

- **路由**：`/:lang(zh|en)?/user/:username`，`meta.requiresAuth`（未登录会被守卫拦回 `/login`）
- **状态**：空壳，先占着路由，好让"未登录被拦回 `/login`"这条验收有可测对象
- **去向**：0.2.x 的仪表盘（用户主页），见 [todo.md](../todo.md)

### NotFound.vue · 404

- **路由**：`/:pathMatch(.*)*`
- **状态**：在用
- **结构**：`BaseLayout` + 提示文案 + `Link`
- **注意**：10 秒倒计时后 `location.href = '/'`，是整页刷新而不是路由跳转；将来改成 `router.push` 才是 SPA 的做法

## 布局组件（`components/layouts/`）

### BaseLayout.vue

- **状态**：在用
- **结构**：引 `base.css`，`NavBar` + `<main><RouterView /></main>`（**不含页脚**，页脚只在首页）
- **用法**：路由里作为父路由，包住 `register` / `login` / `article` / `user/:username` / `test` / `playground`

### nav/NavBar.vue

- **状态**：在用
- **结构**：logo、桌面端菜单（首页 / 文档 / api测试 / 文本）、右侧按钮组、移动端菜单图标
- **宽屏布局**：四个区域从左到右全由 flex 分配——logo（固定宽度，不参与伸缩）、导航链接（`flex: 1` 吃剩余空间，内容居中）、功能图标（宽度由内容决定）、用户区（`NavAvatar`，宽度自适应）
- **窄屏布局**：没有链接区也没有用户区（两者都收进菜单面板），导航栏只剩 logo + 功能图标 + 菜单图标，靠 `nav` 上的 `space-between` 把图标顶到右边
- **移动端菜单面板**：`.menu` 绝对定位贴在导航栏下方，纵向排列四个链接 + `NavAvatar`；点面板任意处收起（模板里绑了 `@click`）
- **竖线分隔**：宽屏下图标区与用户区之间用一条 `|`；样式统一在 `base.css` 的 `.divider`（`--text-weight-thin` + `--color-text-weak`），组件里只管什么时候显示
- **右侧按钮组（从左到右）**：翻译（还没做）、主题切换（`useDark`）、窄屏的菜单图标；用户区在它右边那一格（宽屏）
- **注意**：翻译按钮还没做（`Icon.vue` 里 `translate` 图标已经有了）；点用户区弹出的菜单留到 0.2.x
- **GitHub 链接**：只在页脚，导航栏那个已经摘掉

### nav/NavAvatar.vue

- **状态**：在用：宽屏挂在导航栏最右侧（`NavBar` 里的 `.user-slot`），窄屏挂在菜单面板里
- **职责边界**：只管内容长相（`.user` 的排列与链接配色），在哪儿出现由 `NavBar` 决定，自己不带媒体查询
- **已定的布局**：宽度自适应；已登录时**只显示昵称**，未登录时显示「注册 | 登录」两个链接
- **头像**：将来由头像取代昵称，但要先有后端的存储与上传（`users` 表还没有头像列），所以这一版先只显示昵称
- **取 store 的写法**：必须走 `storeToRefs`，直接解构 `user` 会丢响应性（见 [../reference/pinia.md](../notes/pinia.md)）
- **点击行为**：昵称链到用户主页 `/user/<username>`（路由已注册，页面还是 `Dashboard.vue` 空壳）；点它弹出的菜单（用户信息与登出）留到 0.2.x

### nav/NavSearch.vue

- **状态**：空壳，目前没有任何地方引用
- **位置**：logo 右侧、导航链接左侧
- **去向**：0.2.x 的导航栏搜索框

### Footer.vue

- **状态**：在用，但只在首页——`views/Home.vue` 直接引入，`BaseLayout` 已不再包含它
- **结构**：GitHub 图标（`Icon.vue` 的 `github`，链到 `https://github.com/c23m`）、ICP 备案号（链到 `beian.miit.gov.cn`）、版权
- **注意**：GitHub 链接已从导航栏摘下，只在这里；原来的「内容供个人学习交流使用」已按作者要求删掉
- **注意**：没有公安备案号，不放；功能清单等有真页面了再加（现在只有调试页）

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
- **结构**：`<li>` 卡片，按图片名在 `sunny` / `desert` / `play` / `test` / `dark` 五张图里选，内部用 `Link`（`Button` 是没用到的死导入）
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

路由表，路径统一带可选语言前缀 `/:lang(zh|en)?`。`BaseLayout` 是父路由，`Home` 和 `NotFound` 在它之外。`beforeEach` 里先 `await auth.restore()`（刷新后恢复登录态，幂等：没 token 或已有 user 就立刻返回），再按 `meta.requiresAuth` / `meta.guestOnly` 放行或跳转。
