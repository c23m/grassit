# HANDOVER

> 交接快照，给下一条线程（人或 AI）接上进度用，只写"现在在哪"和"下一步"。规则见 [AGENTS.md](AGENTS.md)，详细待办与版本规划见 [docs/todo.md](docs/todo.md)，产品需求见 [docs/planning.md](docs/planning.md)，已完成版本见 [CHANGELOG.md](CHANGELOG.md)。
> 每个里程碑收尾时更新一次，平时不要顺手改；结论以代码和实测为准。跑项目的命令在 [README.md](README.md) 和 [AGENTS.md](AGENTS.md) 里，这里不重复。

## 现在在哪（2026-09-28）

- 最新 tag `v0.0.3`（登录签发 access token），已推送到 `origin/main`
- 进行中：**0.0.4 · 鉴权与前端登录态**。后端部分在 0.0.3 已完成，前端还没开始
- 按协作分工，0.0.4 的动手部分由作者本人写；AI 这边负责参考笔记、核对接口契约、跑验收
- 文档分两类：跟当前工作走的留在 `docs/`（`docs/frontend/components.md` 是规范，两边的 `references.md` 说明各自引用了哪些参考件），参考笔记与旧文统一在 `docs/reference/`
- 前端参考笔记刚补齐（[pinia.md](docs/reference/pinia.md)、[router-guards.md](docs/reference/router-guards.md)、[form-errors.md](docs/reference/form-errors.md)），正好覆盖 0.0.4 的三个学习内容

## 下一步：0.0.4 前端

要做什么见 [docs/todo.md](docs/todo.md) 的 0.0.4 一节，这里只记相关文件现在长什么样：

- `views/Login.vue`：表单在，直接调 api 层，没接 store，401 没有提示
- `views/Register.vue`：空文件
- `components/layouts/nav/NavAvatar.vue`：空壳；`NavBar.vue` 里还没引用它
- `stores/auth.js`：token 已持久化，`login` / `fetchMe` / `logout` 都在，但**全项目还没有任何组件用过它**，刷新后 `user` 是 null
- `router/index.js`：没有守卫，也没有 `meta`

验收链路按 todo 那一节写的走：注册 → 登录 → 导航栏出现头像 → 刷新仍在登录态 → 未登录被拦回 `/login`。

## 接手前先知道的几件事

- 登录响应只有 token、没有用户信息，注册响应也没有 token：要显示头像得再拉 `/users/me`，注册成功后跳登录页而不是直接进首页（细节见 [form-errors.md](docs/reference/form-errors.md)）
- localStorage 的 token key 被 `stores/auth.js` 和 `utils/request.js` 各持一份；拦截器里已经写着 401 → refresh → 重放，那属于 0.0.5，动它要注意 store ↔ api ↔ 拦截器的循环依赖
- 前端路由带可选语言前缀 `/:lang(zh|en)?`，跳转写 `{ name: 'login' }` 比手拼路径省事
- 哪些页面算"受限页"还没定；`views/Dashboard.vue` 有文件但没进路由

## 已知问题（还没排进版本）

- `backend/app/__init__.py` 的 `__version__` 还是 `0.0.2`，没跟着 `v0.0.3` 走（属代码改动，留给作者）
- 注册 / 登录在 `async def` 里直接调 argon2 同步哈希（`app/security.py`），并发时会阻塞事件循环；`create_async_engine(..., echo=True)` 也是开发配置。AGENTS.md 的"后端异步红线"已经写了规则，这两处还没改

## 收尾

0.0.4 验收通过后按 [AGENTS.md](AGENTS.md) 的版本约定走：CHANGELOG 记一条、从 todo 移除、打 `v0.0.4` tag，顺手更新本文件的"现在在哪"。
