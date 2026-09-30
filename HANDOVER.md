# HANDOVER

> 交接快照，给下一条线程（人或 AI）接上进度用，只写"现在在哪"和"下一步"。规则见 [AGENTS.md](AGENTS.md)，详细待办与版本规划见 [docs/todo.md](docs/todo.md)，产品需求见 [docs/planning.md](docs/planning.md)，已完成版本见 [CHANGELOG.md](CHANGELOG.md)。
> 每个里程碑收尾时更新一次，平时不要顺手改；结论以代码和实测为准。跑项目的命令在 [README.md](README.md) 和 [AGENTS.md](AGENTS.md) 里，这里不重复。

## 现在在哪（2026-09-28）

- 最新 tag `v0.0.3`（登录签发 access token），已推送到 `origin/main`
- 进行中：**0.0.4 · 鉴权与前端登录态**。后端部分在 0.0.3 已完成，前端还没开始
- 按协作分工，0.0.4 的动手部分由作者本人写；AI 这边负责参考笔记、核对接口契约、跑验收
- 文档分两类：跟当前工作走的在 `docs/`（`docs/frontend/components.md` 是规范，同目录下还有跟着任务走的指南，做完即删），不绑任务的速查与旧文在 `docs/reference/`；两边的 `references.md` 说明各自引用了什么
- 0.0.4 要用的笔记都齐了：[pinia.md](docs/reference/pinia.md)、[router-guards.md](docs/reference/router-guards.md)、[vue-events.md](docs/reference/vue-events.md)，以及同任务的两份指南 [auth-form-parts.md](docs/frontend/auth-form-parts.md)、[form-errors.md](docs/frontend/form-errors.md)

## 下一步：0.0.4 前端

要做什么见 [docs/todo.md](docs/todo.md) 的 0.0.4 一节，这里只记相关文件现在长什么样：

- `views/Login.vue`：布局、样式、提交逻辑都在，已接 store（401 显示成人话）
- `views/Register.vue`：空文件
- `components/layouts/nav/NavAvatar.vue`：空壳；`NavBar.vue` 里还没引用它
- `stores/auth.js`：token 已持久化，`login` 的响应直接带 user；`fetchMe` 合并并发请求、失败清 token。**还缺启动时恢复**，所以刷新后 `user` 仍是 null
- `router/index.js`：没有守卫，也没有 `meta`

验收链路按 todo 那一节写的走：注册 → 登录 → 导航栏出现头像 → 刷新仍在登录态 → 未登录被拦回 `/login`。

## 接手前先知道的几件事

- 登录响应带 token 与用户信息；注册响应只有用户信息、没有 token，所以注册成功后跳登录页而不是直接进首页（细节见 [form-errors.md](docs/frontend/form-errors.md)）
- localStorage 的 token key 被 `stores/auth.js` 和 `utils/request.js` 各持一份；拦截器里已经写着 401 → refresh → 重放，那属于 0.0.5，动它要注意 store ↔ api ↔ 拦截器的循环依赖
- 前端路由带可选语言前缀 `/:lang(zh|en)?`，跳转写 `{ name: 'login' }` 比手拼路径省事
- 受限页定为**用户主页**与**发文页**；`/test`、`/playground` 是调试用临时页，不拦，上线前删（记在 0.1.2）。`views/Dashboard.vue` 有文件但还没进路由，所以"未登录被拦回 `/login`"这条验收暂时没有可测的对象

## 已知问题（还没排进版本）

- `backend/app/__init__.py` 的 `__version__` 还是 `0.0.2`，没跟着 `v0.0.3` 走（属代码改动，留给作者）
- 注册 / 登录在 `async def` 里直接调 argon2 同步哈希（`app/security.py`），并发时会阻塞事件循环；`create_async_engine(..., echo=True)` 也是开发配置。AGENTS.md 的"后端异步红线"已经写了规则，这两处还没改

## 收尾

0.0.4 验收通过后按 [AGENTS.md](AGENTS.md) 的版本约定走：CHANGELOG 记一条、从 todo 移除、打 `v0.0.4` tag，顺手更新本文件的"现在在哪"。
