# Grassit 项目知识导读

> 用途：通读 ｜ 面向零基础的全项目知识导读：概述 / 前端 / 后端 / 部署 / 配置 / 工程与流程

> 这份文档写给**完全零基础**的读者（也就是本项目的作者）：把仓库里真实用到的技术点，按「是什么 → 本项目哪里用到 → 坑 / 注意」讲一遍，让你能看懂代码、进而审查 AI 写的东西。
> 用法：先读「概述」建立全局印象，再按需要跳读；每条都指到了具体文件，看文档时把文件一起打开效果最好。
> 范围是**整个项目**（不止 0.0.4）。**以代码与实测为准**：本文由 AI 整理、未经审查，跟代码冲突的地方以代码为准；**还没做的一律标「计划中」**并指到 `docs/todo.md` 的对应版本。
> 有些概念在这里只讲"是什么、在哪儿用"，细节展开见 `docs/notes/` 下已有的笔记，文中会给相对链接（例如 [pinia.md](pinia.md)）。

<!-- toc -->

- [概述](#概述)
  - [Grassit 是什么](#grassit-是什么)
  - [前后端分离：页面在浏览器里跑，数据在服务器上](#前后端分离页面在浏览器里跑数据在服务器上)
  - [目录地图：东西都放在哪儿](#目录地图东西都放在哪儿)
  - [一次登录请求的完整旅程](#一次登录请求的完整旅程)
  - [怎么把项目跑起来](#怎么把项目跑起来)
  - [自检入口：`/test` 与 `/docs`](#自检入口test-与-docs)
- [前端](#前端)
  - [Vue 与单文件组件](#vue-与单文件组件)
  - [模板语法：插值、条件、循环、绑定](#模板语法插值条件循环绑定)
  - [响应式：改了数据页面为什么自己会变](#响应式改了数据页面为什么自己会变)
  - [组件之间怎么传数据：props、事件、插槽](#组件之间怎么传数据props事件插槽)
  - [组件分层：common、layouts、nav、misc、views](#组件分层commonlayoutsnavmiscviews)
  - [页面切换：前端路由](#页面切换前端路由)
  - [路由守卫与 meta：谁能进哪个页面](#路由守卫与-meta谁能进哪个页面)
  - [全局状态与 Pinia](#全局状态与-pinia)
  - [刷新就丢了：内存状态与 localStorage](#刷新就丢了内存状态与-localstorage)
  - [应用启动时恢复登录态](#应用启动时恢复登录态)
  - [请求层：Axios 实例与拦截器](#请求层axios-实例与拦截器)
  - [接口封装与 useRequest](#接口封装与-userequest)
  - [表单与校验](#表单与校验)
  - [样式隔离：scoped 与 CSS 变量](#样式隔离scoped-与-css-变量)
  - [布局与响应式：导航栏四格与移动端面板](#布局与响应式导航栏四格与移动端面板)
  - [图标与静态资源](#图标与静态资源)
  - [Vite：开发服务器、热更新、代理、打包](#vite开发服务器热更新代理打包)
  - [还没启用的 Markdown 渲染](#还没启用的-markdown-渲染)
- [后端](#后端)
  - [HTTP、接口与 JSON](#http接口与-json)
  - [FastAPI：用装饰器写接口](#fastapi用装饰器写接口)
  - [异步与 uvicorn](#异步与-uvicorn)
  - [分层：models、routers、schemas](#分层modelsroutersschemas)
  - [数据库、表与唯一约束](#数据库表与唯一约束)
  - [ORM 与 SQLAlchemy](#orm-与-sqlalchemy)
  - [异步数据库：引擎与 Session](#异步数据库引擎与-session)
  - [建表脚本 init_db.py](#建表脚本-init_dbpy)
  - [数据校验与 pydantic schema](#数据校验与-pydantic-schema)
  - [配置读取：pydantic-settings](#配置读取pydantic-settings)
  - [依赖注入：Depends 与 get_db](#依赖注入depends-与-get_db)
  - [密码为什么不能明文存：哈希与 argon2](#密码为什么不能明文存哈希与-argon2)
  - [JWT：登录凭证是怎么签发的](#jwt登录凭证是怎么签发的)
  - [401：后端怎么判断"你是谁"](#401后端怎么判断你是谁)
  - [409 与 422：两种"数据有问题"](#409-与-422两种数据有问题)
  - [refresh token 与 HttpOnly Cookie](#refresh-token-与-httponly-cookie)
  - [为什么这里看不到 CORS 配置](#为什么这里看不到-cors-配置)
  - [静态资源与 PUBLIC_DIR](#静态资源与-public_dir)
  - [异步红线：async def 里不能写阻塞代码](#异步红线async-def-里不能写阻塞代码)
  - [接口约定与版本号](#接口约定与版本号)
- [部署](#部署)
  - [容器、镜像与数据卷](#容器镜像与数据卷)
  - [Dockerfile：把后端装进镜像](#dockerfile把后端装进镜像)
  - [docker-compose：一条命令起三个服务](#docker-compose一条命令起三个服务)
  - [两种跑法：本地直跑与 compose](#两种跑法本地直跑与-compose)
  - [还没有的东西：生产部署与 CI](#还没有的东西生产部署与-ci)
  - [上线前要删的调试页](#上线前要删的调试页)
- [配置](#配置)
  - [环境变量与 .env](#环境变量与-env)
  - [后端配置项逐个看](#后端配置项逐个看)
  - [DATABASE_URL 在哪儿拼](#database_url-在哪儿拼)
  - [前端配置：VITE_ 前缀与 loadEnv](#前端配置vite_-前缀与-loadenv)
  - [代理目标 VITE_PROXY_TARGET](#代理目标-vite_proxy_target)
  - [代码风格：Prettier 与 Black](#代码风格prettier-与-black)
  - [.gitignore 与 .dockerignore](#gitignore-与-dockerignore)
  - [.vscode/tasks.json：编辑器里的起步按钮](#vscodetasksjson编辑器里的起步按钮)
  - [版本号只写一处](#版本号只写一处)
- [工程与流程](#工程与流程)
  - [Git：提交、分支、tag](#git提交分支tag)
  - [版本里程碑与打 tag 的时机](#版本里程碑与打-tag-的时机)
  - [CHANGELOG 只记重要变更](#changelog-只记重要变更)
  - [docs/ 的职责划分](#docs-的职责划分)
  - [AGENTS.md：人和 AI 共用的一套规则](#agentsmd人和-ai-共用的一套规则)
  - [改动分级确认](#改动分级确认)
  - [哪些交给 AI，哪些必须自己写](#哪些交给-ai哪些必须自己写)
  - [手工验收与"暂无自动化测试"](#手工验收与暂无自动化测试)
  - [提交习惯与提交信息](#提交习惯与提交信息)
  - [代码风格与注释约定](#代码风格与注释约定)
  - [前端界面谁说了算](#前端界面谁说了算)
  - [成本与上下文意识](#成本与上下文意识)

<!-- /toc -->

## 概述

### Grassit 是什么

- **是什么**：一个自托管的个人博客 + Wiki 系统，前后端分离，一个人用的单一站点 —— 不做多租户、不做富文本编辑器，正文用 Markdown。
- **本项目**：需求写在 [planning.md](../planning.md)；当前进度见 [todo.md](../todo.md) 与 [HANDOVER.md](../../HANDOVER.md)；已完成版本记在 [CHANGELOG.md](../../CHANGELOG.md)。
- **注意**：`planning.md` 是**需求**（想做什么），不是现状；想知道"现在能跑什么"，看代码和 `todo.md`。

### 前后端分离：页面在浏览器里跑，数据在服务器上

- **是什么**：前端是浏览器里运行的一堆 JavaScript（本项目用 Vue 3），后端是服务器上跑的接口程序（本项目用 FastAPI）；两边用 HTTP 接口通信，各写各的。
- **本项目**：`frontend/` 是前端，`backend/` 是后端；两边唯一的连接点是接口路径与 JSON 字段。
- **注意**：前端不是后端拼好的 HTML 模板 —— 后端只发数据（JSON），页面由浏览器里的 Vue 现场渲染。

### 目录地图：东西都放在哪儿

- **是什么**：一个"仓库"就是项目所有文件的集合，顶层目录的划分决定了你该去哪儿找东西。
- **本项目**：`backend/`（服务端）、`frontend/`（浏览器端）、`docs/`（文档）、`tools/`（小工具脚本）、`docker-compose.yml`（把三个服务一起跑起来）、`AGENTS.md`（协作规则）、`HANDOVER.md`（进度交接）、`CHANGELOG.md`（已发布版本）、`README.md`（怎么跑）。
- **注意**：`backend/app/` 内又按 `models/`（表结构）、`routers/`（接口）、`schemas/`（出入参格式）分组；`frontend/src/` 内按 `views/`（页面）、`components/`（组件）、`stores/`（全局状态）、`api/`（接口封装）分组。加东西前先看 [AGENTS.md](../../AGENTS.md) 的「项目结构」。

### 一次登录请求的完整旅程

- **是什么**：理解一条完整链路，等于拿到了一张读代码的地图 —— 从用户点击到数据库再回到界面。
- **本项目**（按顺序读这几个文件就串起来了）：`frontend/src/views/Login.vue` 收集输入 → `frontend/src/stores/auth.js` 调接口 → `frontend/src/api/auth.js` → `frontend/src/utils/request.js`（加上 token 请求头）→ `frontend/vite.config.js` 的代理把 `/api` 转到后端 → `backend/app/routers/auth.py` 的 `login` → `backend/app/database.py` 提供数据库会话 → `backend/app/models/user.py` 对应的表 → 回到 `backend/app/schemas/auth.py` 组装 JSON → 前端 `stores/auth.js` 把结果存下来 → `frontend/src/components/layouts/nav/NavAvatar.vue` 显示昵称。
- **注意**：任何一环出错都会表现为"登录失败"，所以排查时先定位**断在哪一环**（浏览器 Network 面板能看到请求跑到哪一步）。

### 怎么把项目跑起来

- **是什么**：项目有两种跑法 —— 本地直接跑（改代码即时生效，日常开发用），或用容器一起跑（环境一致，见「部署」一节）。
- **本项目**：后端 `cd backend` → 建虚拟环境 → `pip install -r requirements.txt` → `python init_db.py` 建表 → `uvicorn app.main:app --reload`（8000 端口）；前端 `cd frontend` → `npm install` → `npm run dev`（5173 端口，`/api` 代理到 8000）。也可以直接用 `.vscode/tasks.json` 里的 `dev` 任务一键起（它会先启动本机 MySQL 服务）。
- **注意**：后端必须先能连上 MySQL，否则启动就报错；数据库连接信息来自 `backend/.env`（从 `backend/.env.example` 复制），**不是**根目录那份 `.env`（那份给 compose 用）。

### 自检入口：`/test` 与 `/docs`

- **是什么**：项目自带的两个"体检"入口 —— 一个是自定义的健康检查接口，一个是 FastAPI 自动生成的接口文档页面。
- **本项目**：`GET /test` 返回当前时间、后端版本号与数据库连通状态（`backend/app/routers/test.py`）；`http://127.0.0.1:8000/docs` 能列出所有接口并直接试调（FastAPI 自动生成）。
- **注意**：`/test` 与前端调试页 `/playground` 是临时页面，**上线前要删**（记在 [todo.md](../todo.md) 的 0.1.2）。

## 前端

### Vue 与单文件组件

- **是什么**：Vue 是一个"用组件拼页面"的框架；**组件**就是一个可复用的页面零件；**单文件组件**指把它的逻辑（`<script>`）、结构（`<template>`）、样式（`<style>`）写在同一个 `.vue` 文件里。
- **本项目**：`frontend/src/components/`（可复用零件）与 `frontend/src/views/`（整页）都是 `.vue` 文件；`<script setup>` 是 Vue 3 的简写写法，里面声明的变量可以直接在模板里用。
- **注意**：本仓库的组件文件名用 PascalCase（如 `NavAvatar.vue`），页面文件放 `views/`、零件放 `components/`（见 [components.md](../specs/components.md)）。

### 模板语法：插值、条件、循环、绑定

- **是什么**：模板是 HTML 加一点指令 —— `{{ 变量 }}` 插值、`v-if` 条件渲染、`v-for` 循环、`v-model` 双向绑定表单、`@click` 绑事件、`:src` 绑属性（冒号表示"这是个表达式，不是字符串"）。
- **本项目**：`frontend/src/components/layouts/nav/NavBar.vue` 用 `v-if="isDesktop"` 决定桌面端菜单是否渲染；`frontend/src/views/Register.vue` 用 `v-model` 绑输入框。
- **注意**：`@click="fn"` 与 `@click="fn()"` 不是一回事（是否把事件对象当参数传进去），见 [vue-events.md](vue-events.md)。

### 响应式：改了数据页面为什么自己会变

- **是什么**：**响应式**指数据变了、用到它的界面自动重画。`ref(值)` 造一个可追踪的容器，`computed(fn)` 造一个"跟着别人算出来的值"；模板里读 `ref` 会自动取出里面的值。
- **本项目**：`frontend/src/stores/auth.js` 里的 `user`、`NavBar.vue` 里的 `theme` 都是这种容器。
- **注意**：**解构会丢响应性** —— `const { user } = 用store()` 拿到的是快照，之后变了界面不更新，要用 `storeToRefs`，详见 [pinia.md](pinia.md)。

### 组件之间怎么传数据：props、事件、插槽

- **是什么**：父组件通过 **props**（属性）把数据传给子组件；子组件通过**事件**通知父组件；**插槽**（slot）是父组件塞进子组件肚子里的一段内容。
- **本项目**：`frontend/src/components/common/Link.vue` 收 `url` 和 `title` 两个 props，并把标签之间的内容放进默认插槽（所以能写 `<Link url="/login">登录</Link>`）；`frontend/src/components/common/Button.vue` 同理。
- **注意**：props 是**单向**的，子组件不该直接改它；要改就让父组件改。

### 组件分层：common、layouts、nav、misc、views

- **是什么**：组件多了要分目录，否则找不到东西。
- **本项目**：`components/common/`（按钮、输入框、链接、图标这类通用零件）、`components/layouts/`（页面骨架：`BaseLayout.vue` 与 `Footer.vue`）、`components/layouts/nav/`（导航栏相关：`NavBar.vue`、`NavAvatar.vue`、还没写的 `NavSearch.vue`）、`components/misc/`（业务相关的小卡片）、`views/`（一整页）；另外 `composables/` 放可复用的逻辑函数。
- **注意**：加页面、改组件前先对齐 [components.md](../specs/components.md)，它就是这个仓库的结构基准。

### 页面切换：前端路由

- **是什么**：**单页应用**只有一张 HTML，靠**路由**在浏览器地址变化时切换显示哪个页面组件，不会整页刷新。
- **本项目**：`frontend/src/router/index.js` 是路由表 —— `Home` 是顶层路由（自带整套骨架），其余页面挂在 `BaseLayout` 下；`<RouterView />` 是"当前页面渲染在这儿"的位置标记（`frontend/src/App.vue`）。
- **注意**：路径统一带**可选语言前缀** `/:lang(zh|en)?`，所以跳转尽量写 `{ name: 'login' }` 这种命名路由，别手拼 `/login`。

### 路由守卫与 meta：谁能进哪个页面

- **是什么**：**守卫**是"导航发生前先跑的一段检查"，`meta` 是挂在路由上的自定义标记，用来告诉守卫这条路由有什么特殊要求。
- **本项目**：`frontend/src/router/index.js` 里 `router.beforeEach` 先恢复登录态，再按 `to.meta.guestOnly`（游客页：已登录的人再访问就送回首页）与 `to.meta.requiresAuth`（受限页：未登录跳登录页）决定放行还是改道；`views/Dashboard.vue` 是当前唯一的受限页。
- **注意**：守卫里 `await` 请求会**卡住首次渲染**（这也是刷新后不会先闪一下"未登录"的原因）；细节见 [router-guards.md](router-guards.md)。

### 全局状态与 Pinia

- **是什么**：多个页面/组件要共用同一份数据（比如"当前登录的是谁"）时，把这份数据放进**全局状态仓库**，谁需要谁来取，而不是一层层传。
- **本项目**：Pinia 是 Vue 官方的状态库；全仓库只有一个 store：`frontend/src/stores/auth.js`（token、user、login、fetchMe、restore、logout）。
- **注意**：取 state 用 `storeToRefs`（解构丢响应性）；action（函数）可以直接解构。展开见 [pinia.md](pinia.md)。

### 刷新就丢了：内存状态与 localStorage

- **是什么**：JavaScript 变量只活在当前页面里，一刷新就清空。要跨刷新留住，就得写进浏览器的**localStorage**（一个按网站域名隔离的键值存储）。
- **本项目**：`frontend/src/stores/auth.js` 的 token 用 `useLocalStorage('token', '')` 持久化；`frontend/src/utils/request.js` 也读同一个 key 给请求加请求头。
- **注意**：两处各自持有一个引用，只是读写同一个 key —— 一边改了另一边不会自动同步；另外 `useLocalStorage` 按初始值类型决定怎么写（初始值是字符串 `''`，所以存进去是**原样字符串**，不用 `JSON.parse`）。

### 应用启动时恢复登录态

- **是什么**：刷新后内存里的用户信息没了，但 token 还在 —— 所以启动时要用 token 去后端换一次"我是谁"，这叫**恢复登录态**。
- **本项目**：`frontend/src/stores/auth.js` 的 `restore()`（幂等：没 token 或已经有 user 就立刻返回，并复用同一个进行中的请求），由 `frontend/src/router/index.js` 的守卫 `await` 调用。
- **注意**：access token 只有 15 分钟有效期，过期后后端返回 401，前端会清掉 token 并跳回登录页 —— 真正解决要等 **0.0.5 的 refresh 闭环**（计划中）。

### 请求层：Axios 实例与拦截器

- **是什么**：Axios 是发 HTTP 请求的库；**实例**把公共配置（后端地址、超时）集中一处；**拦截器**是所有请求/响应都要经过的一道钩子，适合统一加请求头、统一处理错误。
- **本项目**：`frontend/src/utils/request.js` —— `baseURL` 取 `/api`、超时 10 秒、请求拦截器加 `Authorization: Bearer <token>`、响应拦截器把 `response.data` 直接返回给调用方。
- **注意**：响应拦截器**已经帮你取过一层 data**，所以业务里再写 `res.data` 就错了；401 → 刷新 token → 重放那条链是 **0.0.5**（计划中）。

### 接口封装与 useRequest

- **是什么**：把"哪个接口、什么方法、什么路径"集中封装成函数，页面只管调函数，不关心 URL —— 接口变了只改一处。`vue-request` 则提供 `loading` / `error` / `data` 三件套，省掉手写状态。
- **本项目**：`frontend/src/api/auth.js`（登录、注册、登出、刷新、取当前用户）、`frontend/src/api/article.js`、`frontend/src/api/user.js`；`frontend/src/views/Home.vue` 与 `views/Playground.vue` 用 `useRequest`。
- **注意**：文章接口现在**只返回写死的样例数据**，不是真数据 —— 真落库是 **0.1.0**（计划中，见 [todo.md](../todo.md)）。

### 表单与校验

- **是什么**：浏览器表单的默认行为是整页刷新，所以要用 `@submit.prevent` 拦住自己处理；校验分"提交时校验"和"失焦/输入时实时校验"两种时机。
- **本项目**：`frontend/src/views/Login.vue`、`frontend/src/views/Register.vue`（失焦与实时校验、有错时禁用提交）、`frontend/src/components/common/TextInput.vue`。
- **注意**：后端返回的错误要**转成人话**分两种：409（冲突，比如用户名已存在）与 422（字段格式不对），结构不同，见 [form-errors.md](../guides/form-errors.md)。

### 样式隔离：scoped 与 CSS 变量

- **是什么**：`<style scoped>` 给该组件的元素加一个唯一属性，让样式只作用在自己身上，避免互相污染；**CSS 变量**（`--color-bg-primary` 这种）是可以在运行时改值的"样式参数"，用来做主题切换。
- **本项目**：`frontend/src/assets/styles/base.css` 定义 `:root` 与 `:root.dark` 两套颜色变量（亮/暗主题），组件里只引用变量；`frontend/src/components/layouts/nav/NavBar.vue` 等都有自己的 scoped 样式。
- **注意**：scoped 样式**会作用到子组件的根元素**（所以 `NavBar` 里的 `ul a` 能命中 `Link` 渲染出的 `<a>`），但再深一层就管不到了；选择器与优先级详见 [css.md](css.md)。

### 布局与响应式：导航栏四格与移动端面板

- **是什么**：`display: flex` 把子元素排成一行，`flex: 1` 表示"吃掉剩余空间"，`flex: none` 表示"按内容大小、不伸不缩"；**媒体查询** `@media (min-width: 768px)` 让同一份代码在不同屏宽下长得不一样。
- **本项目**：`frontend/src/components/layouts/nav/NavBar.vue` —— 宽屏四格（logo 固定 / 链接吃剩余 / 图标自适应 / 用户区自适应）；窄屏把链接和用户入口收进 `.menu` 面板，点一下收起。
- **注意**：`nav` 上的 `justify-content: space-between` 是留给窄屏的（那时没有链接区，靠它把图标顶到右边），删了窄屏图标会跑到左边。

### 图标与静态资源

- **是什么**：**图标库**（这里是 iconify 的图标集）配合构建插件，能在用到时按需生成图标组件，不用手工下载 SVG；图片等静态文件通过 import 变成可用的 URL。
- **本项目**：`frontend/src/components/common/Icon.vue` 把图标名（`github`、`menu`、`theme` 用的 `light`/`dark`）映射到具体图标；`frontend/src/assets/images/` 放图片；`NavBar.vue` 用 `mask-image` 把 `Grassit.png` 当单色 logo 用。
- **注意**：`@` 是 `frontend/src` 的路径别名（配在 `frontend/vite.config.js` 与 `frontend/jsconfig.json`）；新增图标要先去 `Icon.vue` 里登记。

### Vite：开发服务器、热更新、代理、打包

- **是什么**：Vite 是前端的构建工具 —— `npm run dev` 起开发服务器并做**热更新**（改代码浏览器自动更新）；`npm run build` 把源码**打包**成一堆浏览器能直接用的静态文件（产物放 `frontend/dist/`）；**代理**则把某些请求转发给后端，绕开跨域限制。
- **本项目**：`frontend/vite.config.js` 把 `/api` 转发到 `http://localhost:8000` 并**改写掉 `/api` 前缀**（后端其实挂在根路径上）；`frontend/package.json` 里有 `dev` / `build` / `preview` 三个脚本。
- **注意**：改 `.vue` 一般热更新就行，**改 `main.js` 这类入口不保证自动整页刷新**，要手动刷新；另外 Vite 默认只监听 `localhost`，浏览器把 `localhost` 和 `127.0.0.1` 当**两个不同站点**（localStorage 各存一份），别混着用。

### 还没启用的 Markdown 渲染

- **是什么**：文章正文是 Markdown（一种用符号写格式的纯文本），要在页面上显示成 HTML 就得有渲染库 —— 但"把用户内容当 HTML 插进页面"（Vue 的 `v-html`）是**XSS**（脚本注入）的主要入口，必须做清洗。
- **本项目**：`marked` 已经装进 `frontend/package.json`，但 `frontend/src/views/Article.vue` 里的渲染逻辑**整段被注释着**，样式表 `frontend/src/assets/styles/markdown.css` 也在仓库里。
- **注意**：启用它是 **0.1.0** 的事，届时要一并做 sanitize（已记在 [todo.md](../todo.md)）。

## 后端

### HTTP、接口与 JSON

- **是什么**：HTTP 是浏览器和服务器说话的方式：请求 = 方法（`GET` 查、`POST` 增、`DELETE` 删）+ 路径 + 请求头 + 可选的请求体；响应 = 状态码（`200` 成功、`201` 已创建、`204` 无内容、`401` 未认证、`409` 冲突、`422` 校验失败）+ 响应体。**JSON** 是双方约定的数据文本格式（`{"username": "123"}`）。
- **本项目**：后端所有接口都在 `backend/app/routers/`；前端发请求在 `frontend/src/api/`。
- **注意**：状态码是**接口契约**的一部分，前端会按状态码分支处理错误，别随手改。

### FastAPI：用装饰器写接口

- **是什么**：FastAPI 是 Python 的 Web 框架 —— 用 `@router.get("/路径")` 这样的装饰器把函数变成接口，函数参数自动从请求里解析，函数返回值自动变成 JSON。
- **本项目**：`backend/app/main.py` 把四个 router 挂到应用上（`test`、`auth`、`user`、`article`）；`backend/app/routers/auth.py` 里是登录/注册/刷新/登出。
- **注意**：`/docs` 页面就是根据这些函数签名与类型注解自动生成的接口文档，改接口顺手看一眼它。

### 异步与 uvicorn

- **是什么**：`async def` / `await` 是 Python 的**异步**写法：等待慢操作（数据库、网络）时先把控制权让出去，别的请求可以继续处理。uvicorn 是运行 FastAPI 应用的服务器程序（**ASGI** 服务器），`--reload` 表示改代码自动重启。
- **本项目**：`backend/app/routers/` 里多数接口是 `async def`；数据库用的是异步驱动（见下一条）；启动命令写在 `.vscode/tasks.json` 与 [README.md](../../README.md)。
- **注意**：`async def` 里塞同步阻塞代码会卡住整个服务 —— 这条是本仓库的"异步红线"，见本节末尾那条。

### 分层：models、routers、schemas

- **是什么**：把"数据长什么样""接口怎么响应""出入参怎么校验"分成三层，各自改动互不牵连。
- **本项目**：`backend/app/models/`（数据库表结构，SQLAlchemy）、`backend/app/routers/`（接口逻辑，FastAPI）、`backend/app/schemas/`（出入参格式，pydantic）；跨层的公共模块 `config.py`、`database.py`、`security.py` 直接平铺在 `backend/app/` 下。
- **注意**：同类模块到三个以上才收进子包（[AGENTS.md](../../AGENTS.md) 里定的规则）；`models/` 现在**只有 `user.py`**，文章与标签的表还没建（0.1.0 计划中）。

### 数据库、表与唯一约束

- **是什么**：**关系数据库**把数据存成表（像 Excel 表）：一行是一条记录，一列是一个字段；**主键**唯一标识一行；**唯一约束**保证某列不重复。本项目用 MySQL 8.4。
- **本项目**：`backend/app/models/user.py` 定义 `users` 表（`id` 主键、`username` 唯一、`nickname`、`password_hash`、`created_at`、`email`）；连接信息在 `backend/.env`。
- **注意**：唯一约束是**最后一道防线** —— 并发情况下"先查重再插入"仍可能撞车，所以还要接住数据库抛的 `IntegrityError`（见「409 与 422」）。

### ORM 与 SQLAlchemy

- **是什么**：**ORM**（对象关系映射）让你用"类和对象"来操作表和行，不用手写 SQL 字符串；SQLAlchemy 是 Python 里最常用的 ORM。
- **本项目**：`backend/app/models/user.py` 用 `Mapped` / `mapped_column` 声明字段；查询用 `select(User).where(...)`（见 `backend/app/routers/auth.py`）。
- **注意**：写法与常见坑见 [sqlalchemy.md](sqlalchemy.md)；本项目的模型继承 `backend/app/database.py` 里的 `Base`。

### 异步数据库：引擎与 Session

- **是什么**：**引擎**（engine）管连接池，"**会话**"（Session）是一次数据库操作的上下文（一个工作台）。异步版本要用 `AsyncSession`，并且**一个请求一个会话、用完就关**。
- **本项目**：`backend/app/database.py` —— `create_async_engine` 建引擎、`async_sessionmaker` 造会话、`get_db()` 用 `yield` 提供一个会话并在请求结束时自动关闭，`Database` 是它的类型别名。
- **注意**：`echo=True` 会把每条 SQL 打到日志里，是开发配置；会话不能跨请求共享、也不能在模块级长期持有。

### 建表脚本 init_db.py

- **是什么**：ORM 只描述了表长什么样，真正在数据库里建表要靠一段脚本：读模型的元数据，然后 `create_all`。
- **本项目**：`backend/init_db.py`（`python init_db.py` 建表，加 `--reset` 先删后建）。
- **注意**：**它不做表结构迁移** —— 改了模型字段，这个脚本不会自动改已存在的表；稳妥做法是开发期 `--reset`（会清空数据）。真要上生产得引入迁移工具（现在没有）。

### 数据校验与 pydantic schema

- **是什么**：pydantic 用类来声明"请求体/响应体应该长什么样"，FastAPI 拿它自动校验：不合格直接返回 422，合格才进业务代码。
- **本项目**：`backend/app/schemas/base.py` 定义公共基类 `BaseSchema`（字段名自动转小驼峰 `toCamel`、允许按字段名或别名传入、允许从 ORM 对象直接转换）；`schemas/auth.py` 是登录/注册的出入参，`schemas/user.py` 是用户信息。
- **注意**：schema 决定接口返回哪些字段 —— `UserMe` 里有 `avatar` / `github`，但 `users` 表里**没有这两列**，所以它们永远是 `null`。类型细节见 [sqlalchemy-pydantic-types.md](sqlalchemy-pydantic-types.md)。

### 配置读取：pydantic-settings

- **是什么**：把配置（数据库地址、密钥）从环境变量或 `.env` 文件读进来，集中成一个对象；**缺了必填项程序直接启动失败**，比运行时才炸好得多。
- **本项目**：`backend/app/config.py` 的 `Settings` 类：`db_host` / `db_port` / `db_user` / `db_password` / `db_name` / `public_dir` / `jwt_secret` / `jwt_algorithm` / `access_token_expire_minutes` / `refresh_token_expire_days`。
- **注意**：`config.py` 只放**原始配置值**，不 import 业务模块、不做 I/O、不放工具函数 —— 由配置派生出来的东西（比如数据库连接串）留在各自的模块里拼（见「配置」一节）。

### 依赖注入：Depends 与 get_db

- **是什么**：**依赖注入**就是不自己创建需要的东西，而是把它声明成函数参数，由框架负责准备与收尾（便于替换、复用、测试）。
- **本项目**：`backend/app/routers/auth.py` 的 `get_current_user` 依赖负责"从请求头取 token → 解析 → 查库 → 返回当前用户"；`UserFromToken` 是它的别名，接口只要写上这个参数就有了登录态；`Database` 同理提供数据库会话。
- **注意**：FastAPI 不会替你清理资源，所以 `get_db` 必须写成 `yield` 形式，让框架在请求结束后继续执行 `with` 块里的收尾。

### 密码为什么不能明文存：哈希与 argon2

- **是什么**：**哈希**是单向变换：能从密码算出摘要，不能从摘要倒推密码；每个密码还会加一段随机"盐"，所以同一个密码存两次也是两串不同的值。校验时是把用户输入**重新哈希再比对**，不是解密。argon2 是当前推荐的慢哈希算法（故意算得慢，让暴力破解变贵）。
- **本项目**：`backend/app/security.py` 用 `pwdlib` 的 `PasswordHash.recommended()`（依赖里的 `pwdlib[argon2]`）；注册时 `hash_password`，登录时 `verify_password`。
- **注意**：argon2 是**同步且 CPU 密集**的，按本仓库的"异步红线"应该放进线程池执行 —— **目前还没改**，属已知问题（见 [HANDOVER.md](../../HANDOVER.md) 的「已知问题」）。

### JWT：登录凭证是怎么签发的

- **是什么**：**JWT** 是一串三段式字符串（用点分隔），前两段是明文可读的信息（payload 里有 `sub` 用户 id、`exp` 过期时间、`type` 类型），第三段是用服务器密钥算出的**签名** —— 服务器不需要存会话，只要验签就能确认"这串字符串是我发的、没被改过"，这叫**无状态**。
- **本项目**：`backend/app/security.py` 的 `create_token` / `decode_token`（算法默认 HS256、access token 默认 15 分钟）；登录时签发，之后每个请求带在请求头里。
- **注意**：无状态的代价是**不能撤销**（签发出去就有效到过期），想支持登出拉黑得额外存名单（记在 [todo.md](../todo.md) 的"token 撤销（不急）"）；原理与坑见 [jwt.md](jwt.md)。

### 401：后端怎么判断"你是谁"

- **是什么**：受保护的接口要先认证：从请求头 `Authorization: Bearer <token>` 取出凭证，验签、取出用户 id、查库，任一步失败都返回 401。
- **本项目**：`backend/app/routers/auth.py` 的 `get_current_user`；`GET /users/me`（`backend/app/routers/user.py`）直接返回解析出来的用户。
- **注意**：登录失败时"用户名不存在"和"密码错误"返回**同一条消息**（`Wrong username or password`），避免泄露"这个账号存不存在"。

### 409 与 422：两种"数据有问题"

- **是什么**：`409 Conflict` 表示"数据没错，但跟现有数据冲突"（用户名、邮箱已存在）；`422` 表示"数据格式/取值不合规"（pydantic 校验失败，会自动带上哪个字段错在哪）。
- **本项目**：`backend/app/routers/auth.py` 的 `register` 主动查重抛 409，并用 `IntegrityError` 兜底回滚（并发时数据库唯一约束会拦住）；422 由 pydantic 自动产生。
- **注意**：这两种错误的响应结构不同，前端处理时要分开找人话文案，见 [form-errors.md](../guides/form-errors.md)。

### refresh token 与 HttpOnly Cookie

- **是什么**：access token 有效期短（15 分钟）以减少泄露风险，另发一个长期凭证（refresh token）用来换新的 access token。refresh token 放在 **HttpOnly Cookie** 里（JavaScript 读不到，能防一部分 XSS 窃取），Cookie 的 `path` 决定它只在访问哪些路径时被浏览器带上。
- **本项目**：`backend/app/routers/auth.py` 的 `login` 写入 `refreshToken` cookie（`httponly`、`samesite=strict`、30 天、`path=/auth`）；`POST /auth/refresh` 用 cookie 换新 access token；过期参数在 `backend/app/config.py`。
- **注意**：**这条链还没闭合**（0.0.5 计划中）。前端拦截器虽然有"401 → 刷新 → 重放"的代码，但浏览器实际请求的路径是 `/api/auth/refresh`（带代理前缀），而 cookie 的作用域写的是 `/auth`，做 0.0.5 时要确认这个前缀问题怎么处理。

### 为什么这里看不到 CORS 配置

- **是什么**：浏览器有**同源策略**，网页默认不能随便请求别的域名/端口的接口；服务器要用 CORS 响应头明确允许，跨域请求才会被放行。
- **本项目**：`backend/app/main.py` 里没有 CORS 中间件 —— 因为开发时浏览器只跟 Vite（5173）说话、由 Vite 代理转发到后端；生产则由 nginx 反代（见 [deploy.md](../specs/deploy.md)），对浏览器而言始终是**同源**。
- **注意**：哪天让前端直连 `http://127.0.0.1:8000`（不走代理），就必须回来加 CORS 配置了。

### 静态资源与 PUBLIC_DIR

- **是什么**：头像、附件这类文件不走接口，而是由后端当成静态目录直接对外的 URL 提供。
- **本项目**：`backend/app/main.py` 用 `StaticFiles` 把 `PUBLIC_DIR`（`backend/.env` 里配成 `./public`，目录是 `backend/public/`）挂到 `/public` 路径；相对路径以 `backend/` 为准，不依赖启动目录。
- **注意**：该目录**必须存在**，否则 FastAPI 启动就报错（`backend/Dockerfile` 里专门 `mkdir -p /app/public` 就是为了这个）；目录规划见 [deploy.md](../specs/deploy.md)。

### 异步红线：async def 里不能写阻塞代码

- **是什么**：`async def` 运行在事件循环上，一旦里面出现"同步等待"（`time.sleep`、同步的 `requests`、CPU 很重的计算），整个服务会一起卡住。
- **本项目**：规则写在 [AGENTS.md](../../AGENTS.md) 的「后端异步红线」；目前**有两处没改**：注册/登录直接调用同步的 argon2 哈希，以及 `create_async_engine(..., echo=True)` 这种开发配置。
- **注意**：这条既是规范也是待办 —— 审查相关代码时先看它有没有把阻塞操作挪进线程池。

### 接口约定与版本号

- **是什么**：一些"小事"上的统一约定，能省掉大量沟通成本。
- **本项目**：请求体参数一律叫 `body`（见 [AGENTS.md](../../AGENTS.md)）；版本号只有一处来源 —— `backend/app/__init__.py` 的 `__version__`，`/test` 等地方引用它而不是自己写。
- **注意**：`__version__` 目前是 `0.0.2`，**落后于最新的 `v0.0.3` tag**，属已知问题（代码改动留给作者）。

## 部署

### 容器、镜像与数据卷

- **是什么**：**镜像**是"装好依赖与代码的模板"，**容器**是镜像跑起来的实例（相当于一台轻量虚拟机），**数据卷**是容器删了数据也还在的目录（数据库必须用）。
- **本项目**：`docker-compose.yml` 里 mysql 服务用 `mysql_data` 卷保存数据；`backend` / `frontend` 服务把源码目录挂进容器，方便改代码即时生效。
- **注意**：容器内的路径与宿主不一样（后端容器里代码在 `/app`），看 compose 时注意这种映射。

### Dockerfile：把后端装进镜像

- **是什么**：Dockerfile 是一份"怎么造镜像"的配方：基础镜像 → 设置工作目录 → 拷依赖清单 → 装依赖 → 拷代码 → 声明端口 → 启动命令。
- **本项目**：`backend/Dockerfile`（`python:3.12-slim`，`pip install -r requirements.txt`，`mkdir -p /app/public`，`CMD uvicorn ...`）；`frontend/Dockerfile`（`node:22-alpine`，`npm ci`，`CMD npm run dev -- --host 0.0.0.0`）。
- **注意**：两个 Dockerfile 都是**开发用**的（前端跑的是 dev server 而不是构建产物）；生产形态见 [deploy.md](../specs/deploy.md)，**未开始**。

### docker-compose：一条命令起三个服务

- **是什么**：compose 用一个 YAML 描述多个容器（服务）怎么一起跑：镜像从哪来、端口怎么映射、谁依赖谁、环境变量怎么注入、卷怎么挂。
- **本项目**：`docker-compose.yml` —— `mysql`（8.4 + 健康检查）、`backend`（8000，等 mysql 健康后再起）、`frontend`（5173）；`docker compose up` 一键起全套。
- **注意**：compose 里 `${...}` 的值来自**根目录的 `.env`**（从根目录 `.env.example` 复制），跟 `backend/.env` 是两回事；`DB_HOST` 在容器里要写服务名 `mysql`，不是 `127.0.0.1`。

### 两种跑法：本地直跑与 compose

- **是什么**：同一套代码有两种运行环境，各自的配置来源不同，别混。
- **本项目**：本地直跑 → 读 `backend/.env`（`DB_HOST=127.0.0.1`）、前端读 `frontend/.env`；compose → 读根目录 `.env`，再通过 compose 的 `environment` 注入容器（`DB_HOST=mysql`、`VITE_PROXY_TARGET=http://backend:8000`）。
- **注意**：改了一处配置没生效时，先确认你跑的是哪种方式、改的是哪份 `.env`。

### 还没有的东西：生产部署与 CI

- **是什么**：把项目放到公网服务器上跑（域名、HTTPS、反代、进程守护）叫生产部署；让机器自动跑检查/构建/测试叫 **CI**（持续集成）。
- **本项目**：目前只有本地 compose；生产方案（nginx 反代 `/api` 与 `/public`、HTTPS、生产 compose）写在 [deploy.md](../specs/deploy.md) 里，状态是**未开始**，排在 **0.1.2**；仓库里**没有任何 CI 配置**。
- **注意**：文档里提到的部署架构都是**规划**，不是现状 —— 别照着它以为线上已经有东西。

### 上线前要删的调试页

- **是什么**：开发期为了方便留的页面，上线前要清掉，否则既是入口漏洞也是难看的地方。
- **本项目**：`/test`（`backend/app/routers/test.py` 与 `frontend/src/views/ApiTest.vue`）、`/playground`（`frontend/src/views/Playground.vue`）以及导航栏里的入口 —— 已记在 [todo.md](../todo.md) 的 0.1.2。
- **注意**：这两页**故意不做登录拦截**，改守卫的 `meta` 时别顺手给它们加上。

## 配置

### 环境变量与 .env

- **是什么**：**环境变量**是操作系统层面的键值对配置，程序启动时读它 —— 好处是代码不用改就能换环境，且密钥不进代码库。`.env` 文件是"环境变量的本地清单"，由程序或容器在启动时读入；`.env.example` 是模板（进版本库），`.env` 是实际值（**不进版本库**）。
- **本项目**：根目录 `.env.example`（给 compose）+ `backend/.env.example`（给本地直跑后端）+ `frontend/.env`、`frontend/.env.production`（前端变量）；`.env` 已被 `.gitignore` 忽略。
- **注意**：`.env.example` 里的 `change-me` 只是占位；`JWT_SECRET` 必须自己生成，不要用默认值。

### 后端配置项逐个看

- **是什么**：后端启动时会读这些值，缺必填项会直接启动失败（这是好事）。
- **本项目**：`DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME`（数据库连接）、`PUBLIC_DIR`（静态资源根目录）、`JWT_SECRET`（签发 token 的密钥）、`JWT_ALGORITHM`（默认 HS256）、`ACCESS_TOKEN_EXPIRE_MINUTES`（默认 15）、`REFRESH_TOKEN_EXPIRE_DAYS`（默认 30）。定义在 `backend/app/config.py`，示例见 `backend/.env.example`。
- **注意**：生成密钥的命令写在 `backend/.env.example` 的注释里（`python -c "import secrets; print(secrets.token_urlsafe(32))"`）。

### DATABASE_URL 在哪儿拼

- **是什么**：数据库连接串是把主机、端口、用户名、密码、库名拼成的一个字符串；**由配置派生出来的值不该写回配置文件**，而应在用它的模块里组装。
- **本项目**：`backend/app/database.py` 用 `sqlalchemy.engine.URL.create` 拼出连接串（`mysql+asyncmy` 驱动），而不是手写字符串。
- **注意**：用 `URL.create` 而不是 f-string，是为了让密码里的特殊字符被正确转义；这条也是 [AGENTS.md](../../AGENTS.md) 里"config.py 只放原始值"的落地。

### 前端配置：VITE_ 前缀与 loadEnv

- **是什么**：Vite 只会把以 `VITE_` 开头的变量注入到浏览器端代码里（用 `import.meta.env.VITE_XXX` 读）；`.env` 文件的内容**不会**自动进 `process.env`，配置里要用 `loadEnv` 显式读。
- **本项目**：`frontend/.env`（`VITE_APP_NAME`、`VITE_API_BASE_URL=/api`）、`frontend/.env.production`；`frontend/vite.config.js` 里 `loadEnv(mode, process.cwd(), 'VITE_')` 用来取代理目标。
- **注意**：**别把密钥放进 `VITE_*`** —— 它们会被打进前端产物，任何人打开浏览器都能看到。

### 代理目标 VITE_PROXY_TARGET

- **是什么**：开发时前端的 `/api` 请求要转发到后端，转发目标用变量配置，方便在不同环境换地址。
- **本项目**：`frontend/vite.config.js` 里优先读 `VITE_PROXY_TARGET`，没有则用 `http://localhost:8000`；compose 里把它设成 `http://backend:8000`（容器网络里的服务名）。
- **注意**：生产环境不靠 Vite 代理，而是 nginx 反代 —— 见 [deploy.md](../specs/deploy.md)。

### 代码风格：Prettier 与 Black

- **是什么**：格式化工具按统一规则把代码排整齐，避免"风格不一致"污染提交历史。
- **本项目**：前端用 Prettier，规则固定在根目录 `.prettierrc`（不写分号、单引号、4 空格缩进、LF 行尾；`package.json` / `*.config.js` 这类配置文件例外用 2 空格）；后端 Python 用 Black，4 空格缩进、snake_case。两个都装在仓库里了：prettier 在根目录 `package.json` 的 devDependencies（`npm run format` 写回、`npm run format:check` 只检查），Black 装在 `backend/.venv` 并由 `backend/requirements-dev.txt` 登记（命令见 [AGENTS.md](../../AGENTS.md) 的"常用命令"）。
- **注意**：行尾统一 LF 靠 `.gitattributes` 保证 —— 在 Windows 上编辑时别让编辑器改成 CRLF。

### .gitignore 与 .dockerignore

- **是什么**：`git` 忽略清单决定哪些文件不进版本库；`docker` 忽略清单决定哪些文件不进镜像（镜像越小越好，也避免把密钥拷进去）。
- **本项目**：根目录与 `backend/`、`frontend/` 各有一份 `.gitignore`；`backend/.dockerignore`、`frontend/.dockerignore` 各一份。
- **注意**：`.env`（真实配置）、虚拟环境目录、`node_modules/`、`frontend/dist/` 都应该在里面。

### .vscode/tasks.json：编辑器里的起步按钮

- **是什么**：VS Code 的"任务"能把常用命令固化成按钮，还能声明依赖顺序（先干嘛后干嘛）。
- **本项目**：`.vscode/tasks.json` 里有 `db: 启动` / `db: 停止`（操作本机 MySQL 服务）、`dev: 后端`（uvicorn `--reload`）、`dev: 前端`（`npm run dev`）、`dev: 服务`（并行起前后端）、`dev`（默认任务：先起数据库再起服务）。
- **注意**：里面写死的 Windows 服务名 `MySQL94` 是这台机器的；换机器要改，或者改用 compose 起数据库。

### 版本号只写一处

- **是什么**：版本号如果有多个来源，迟早会不一致（本项目就出现了这种情况）。
- **本项目**：唯一来源是 `backend/app/__init__.py` 的 `__version__`，`/test` 接口引用它。
- **注意**：它现在是 `0.0.2`，而最新 tag 是 `v0.0.3` —— 发版时记得一起改（已记在 [HANDOVER.md](../../HANDOVER.md) 的「已知问题」）。

## 工程与流程

### Git：提交、分支、tag

- **是什么**：Git 是版本控制工具：**提交**（commit）是一次带说明的改动快照，**分支**（branch）是并行的开发线，**tag** 是给某个提交起的固定名字（发版本用）。本项目是单人仓库，直接在 `main` 上提交。
- **本项目**：提交信息用中文，带版号前缀时形如 `0.0.3：登录签发 access token`；已有 tag：`v0.0.2`、`v0.0.3`（另有 `backup/pre-*` 备份 tag）。
- **注意**：本仓库要求**提交与推送分开** —— 先本地提交，等一个阶段（一个里程碑）完成后再 `git push`，中途不为"同步"而推。

### 版本里程碑与打 tag 的时机

- **是什么**：本项目把版本号当作**可验收的里程碑**，不是"改一次就 +1"。
- **本项目**：`0.0.1` 骨架 → `0.0.2` 注册登录落库 → `0.0.3` 签发 access token → `0.0.4` 前端登录态（进行中）→ 之后 0.0.5 / 0.1.0 / 0.1.1 / 0.1.2，逐个版本写在 [todo.md](../todo.md)。
- **注意**：顺序是**先验收通过**，然后 CHANGELOG 记一条、把该版本从 `todo.md` 移除、再打 tag —— 反了就等于给没验过的东西盖章。

### CHANGELOG 只记重要变更

- **是什么**：给"用这个项目的人"看的变更记录，只需要记结构、接口、配置、行为这类重要变化。
- **本项目**：[CHANGELOG.md](../../CHANGELOG.md) 里 `0.0.1` 到 `0.0.3` 各一条，按版号分节。
- **注意**：不重要的改动不记；过时的条目要及时删，别让它变成"历史包袱"。

### docs/ 的职责划分

- **是什么**：文档按"职责单一、内容不重复"分家，各自回答不同的问题：想做什么 / 下一步做什么 / 现在到哪了 / 已经做了什么。
- **本项目**：`docs/planning.md`（产品需求）、`docs/todo.md`（版本规划与验收标准，只留未完成的版本）、[HANDOVER.md](../../HANDOVER.md)（交接快照：现在在哪、下一步做什么）、[CHANGELOG.md](../../CHANGELOG.md)（已完成版本）、`docs/notes/`（不绑任务的速查与学习笔记）、`docs/specs/`（领域规范，会越写越细）、`docs/guides/`（当前任务的指南，**做完就删**）。
- **注意**：`docs/notes/` 里的笔记**不是规范**，结论以代码和实测为准；哪份文件管什么见 [docs/README.md](../README.md)。

### AGENTS.md：人和 AI 共用的一套规则

- **是什么**：把长期规则（怎么做事）集中在一个文件里，人和 AI 都按它执行，省掉每次重复交代。
- **本项目**：[AGENTS.md](../../AGENTS.md) 里有项目结构、常用命令、代码风格与命名、后端异步红线、文档约定、测试、版本与变更日志、提交与推送、协作分工、改动前先确认、上下文与花费、前端界面。
- **注意**：那里**只放规则**，不放进度与待办（进度去 `todo.md` / `HANDOVER.md`）。

### 改动分级确认

- **是什么**：不是所有改动都要先请示，但"重要"的要先说明白再动手 —— 这条规则优先于其他"可以直接改"的例外。
- **本项目**：[AGENTS.md](../../AGENTS.md) 的「改动前先确认」：无关紧要的小问题（错别字、路径、文档同步）可以直接改，但要在回复里说明；重要问题先说清"打算改哪些文件、怎么改"，等明确同意再动手；**拿不准的一律按重要算**。
- **注意**：作者一次给出多个方案时，说明他自己也没拿准 —— 先问选哪个，不要替他挑一个往下做。

### 哪些交给 AI，哪些必须自己写

- **是什么**：交给 AI 的判断标准是"**无意义重复或繁琐机械**"，而不是"属于某个类别"（配置不默认归 AI）。
- **本项目**：[AGENTS.md](../../AGENTS.md) 的「协作分工」：有学习价值的动手部分（含首次接入某个组件）由作者自己做；批量同步文档、跨文件改名这类才交给 AI。
- **注意**：AI 生成且未经审查的文档**不能当作事实来源** —— 本文也一样。

### 手工验收与"暂无自动化测试"

- **是什么**：**自动化测试**是"一组能重复运行、自动判断对错的代码"；没有它时只能按清单手工走一遍流程，这叫手工验收。
- **本项目**：仓库里**目前没有任何测试文件**；`AGENTS.md` 写着"暂无自动化测试，pytest + httpx 脚手架排在 0.1.1"，[todo.md](../todo.md) 的 0.1.1 一节列了要覆盖的用例（注册、登录、鉴权失败、文章权限）；依赖清单 `backend/requirements.txt` 里 `httpx` 已经就位。
- **注意**：写材料或简历时**别说"有测试"**；当前每个版本的验收都是手工跑（起服务、看 `/docs`、走一遍链路）。

### 提交习惯与提交信息

- **是什么**：提交信息的质量决定了以后 `git log` 还能不能看懂。
- **本项目**：中文；版本里程碑带版号前缀（`0.0.3：登录签发 access token`）；零碎提交可以由 AI 自行合并；作者顺手改的小改动（样式数值、措辞、笔误）提交时一起带上。
- **注意**：重写已推送的历史前先建备份分支或 tag，并告知作者。

### 代码风格与注释约定

- **是什么**：除了格式化工具管的那些，还有命名与注释上的约定。
- **本项目**：Python 用 snake_case、模型与 schema 用 PascalCase；前端组件文件名用 PascalCase、`docs/` 内文件名用小写短横线；注释写"这段代码负责什么、为什么这么写"，不逐行翻译代码。
- **注意**：AI 读到哪个文件可以顺手补注释，不必事先确认（[AGENTS.md](../../AGENTS.md)）。

### 前端界面谁说了算

- **是什么**：页面布局与视觉风格是主观取向，验收只看流程能否走通 —— 所以这块**由作者决定**。
- **本项目**：[AGENTS.md](../../AGENTS.md) 的「前端界面」；实际协作里，AI 改样式前要先确认（本次会话中导航栏四格布局、页脚内容、竖线间距都是先问后改）。
- **注意**：这条也意味着"样式好不好看"不构成返工理由，但"流程走不通"是硬伤。

### 成本与上下文意识

- **是什么**：跟 AI 协作时，单轮成本 ≈ 当前上下文体积 × 轮次 —— 上下文越长、来回越多，越贵也越慢。
- **本项目**：[AGENTS.md](../../AGENTS.md) 的「上下文与花费」：一个里程碑一个线程，收尾时先列清楚再开新线程；精准检索（先定位再读片段）、限制输出行数、回答从简。
- **注意**：[HANDOVER.md](../../HANDOVER.md) 的存在意义就是**给下一条线程省上下文** —— 新线程只需读它就能接上进度。
