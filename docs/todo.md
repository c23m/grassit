# TODO

- [TODO](#todo)
    - [版本规划](#版本规划)
        - [0.0.4 · 鉴权与前端登录态](#004--鉴权与前端登录态)
        - [0.0.5 · refresh token 闭环](#005--refresh-token-闭环)
        - [0.1.0 · MVP](#010--mvp)
        - [0.1.1 · 测试补齐](#011--测试补齐)
        - [0.1.2 · 部署](#012--部署)
        - [0.2.0 及以后](#020-及以后)

## 版本规划

版本号是可验收的里程碑，不必每次改动都动版本；达成验收后打 `vX.Y.Z` tag，并在 [CHANGELOG.md](../CHANGELOG.md) 记一条（以版号作标题）。**版本完成后从本文件移除，记录只留在 CHANGELOG**；本文件始终只保留未完成的版本。每个版本自带最小回归验收，系统性测试集中在 0.1.1。规范见 [development.md](development.md)，协作规则见 [ai-collaboration.md](ai-collaboration.md)。

### 0.0.4 · 鉴权与前端登录态

让登录状态贯通前后端：用户能在浏览器里注册、登录，并看到自己的登录状态。后端部分已在 0.0.3 完成。

学习内容：Pinia 状态持久化、前端路由守卫、表单与事件处理（见 [frontend/](frontend/) 的笔记）。

**页面**

- `Login.vue`：登录表单接 store，成功后回首页
- `Register.vue`：注册表单，409 / 422 的报错要显示成人话
- `NavAvatar.vue`：导航栏用户区，已登录显示头像、未登录显示登录入口

**逻辑**

- [ ] store 把 token 存进 localStorage，应用启动时用它拉 `/users/me`
- [ ] 路由守卫：未登录访问受限页跳转 `/login`
- [ ] 退出登录：清掉 token 与用户信息

验收：注册新账号 → 登录 → 导航栏出现头像 → 刷新页面后仍在登录态；未登录访问受限页被拦回 `/login`。

### 0.0.5 · refresh token 闭环

学习内容：HttpOnly Cookie 的作用域与路径、401 自动续期、并发刷新与重试标记。

**页面**：无新页面，登录态失效的表现体现在拦截器与跳回登录页。

验收：access token 过期后能自动续期；刷新失败则清空登录态并回到登录页。

- [ ] 登录时下发 refresh token（HttpOnly、`path=/auth`、30 天；目前 cookie 里还是占位值）
- [ ] `POST /auth/refresh` 校验 refresh token 并换发新的 access token
- [ ] 前端拦截器：401 → 刷新 → 重放；刷新失败则清空登录态

### 0.1.0 · MVP

目标：注册 → 登录 → 发布文章 → 在首页列表与详情页读到它（暂时用 slug 访问）。

学习内容：一对多关联、查询参数校验、Markdown 渲染与 XSS 防护。

**页面**

- `Home.vue`：首页文章列表接真实数据
- `Article.vue`：详情页启用 `marked` 渲染（现在模板与逻辑整段被注释）
- 发文页（新建）：标题、slug、标签、正文

验收：用新注册的账号发一篇文章，未登录也能在首页列表和详情页读到。

- [ ] `Article` 模型与表（slug 唯一、标签、可见性、字数）
- [ ] `POST /articles` 创建，作者取自登录态而非请求体
- [ ] `GET /articles` 筛选（author / title / slug / start / end / tags）与 `GET /articles/{identifier}` 详情
- [ ] `DELETE /articles/{identifier}` 物理删除，仅作者可删
- [ ] 渲染 Markdown 时做 sanitize（`v-html` 直接渲染用户内容是 XSS 入口）

### 0.1.1 · 测试补齐

学习内容：pytest + httpx 异步客户端、fixture、测试数据库的隔离。

**页面**：无。

验收：注册、登录、鉴权失败、文章权限都有自动化覆盖。

- [ ] 搭 pytest 脚手架与测试数据库
- [ ] 覆盖注册、登录、鉴权失败、文章权限
- [ ] 视情况接入 CI

### 0.1.2 · 部署

见 [deploy.md](deploy.md)。

学习内容：Nginx 反向代理与静态资源、HTTPS、进程管理。

**页面**：无（部署的是前端构建产物）。

验收：域名可访问，HTTPS 正常，前端路由与 `/api`、`/public` 都通。

- [ ] 生产 compose（nginx + backend + mysql）
- [ ] 前端构建产物与 `/api`、`/public` 的反代规则
- [ ] `PUBLIC_DIR` 挂载到 `/var/lib/grassit/public`
- [ ] 导出 `openapi.json` 作为接口契约

### 0.2.0 及以后

- **0.2.0 用户与文章增强**：邮箱登录、GitHub 绑定与登录、标签查询、可见性（公开/私密）
- **0.2.x 界面完善**：优化提交页、导航栏搜索框、仪表盘（用户主页）、测试页直连真实接口
- **0.3.0 用户状态**：账号状态（封禁/注销）、注销后文章保留逻辑、在线状态记录
- **0.4.0 存储**：头像上传、附件上传、静态资源服务
