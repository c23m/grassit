# Changelog

只记项目的重要变更。需求见 [docs/planning.md](docs/planning.md)，现状与计划见 [docs/todo.md](docs/todo.md)，协作约定与收录标准见 [docs/conventions.md](docs/conventions.md)。

## 0.0.1（2026-09-22）

**骨架**

- 本地可启动后端并连通 MySQL，`/test` 返回 `dbStatus=OK`
- `PUBLIC_DIR` 的相对路径改为以 `backend/` 为基准，不再依赖启动目录

**接口契约**

- 前端请求路径与后端对齐：`/articles`、`/users/{username}`、`/users/me`
- 统一 axios 返回值层次（此前 store 与拦截器按 `response.data.token` 取值，实际已是 `response.token`）
- 补 `/login` 路由，`register` 路由绑定组件
- 缺少 `Authorization` 时返回 401 而非 422，前端的自动续期逻辑得以触发

**修复**

- `GET /articles`、`GET /articles/{identifier}` 因样例作者缺 `createdAt` 校验失败而 500
- 首页文章列表的 `computed` 缺 `return`，列表恒为空

## 9/22 · 合并单仓库 / 统一 `/api` / 配置修正

**结构与仓库**

- 三个仓库合并为单仓库：`backend/`、`frontend/` 并入根仓库（旧远端 `gst-backend`、`gst-frontend` 保留，用于查历史）
- 根 `.gitignore` 不再忽略 `backend/`、`frontend/`；`.env` 改为只忽略根目录

**接口**

- API 统一为同域 `/api` 路径（由代理层剥离前缀，后端代码不变），废弃 `api.grassit.cn` 子域方案
- 退役联调模式（`dev:integration` + `.env.integration`）：前端测接口直接打本地后端，后端返回测试数据

**配置**

- 后端新增 `backend/public/` 占位目录与 `PUBLIC_DIR`，修复「目录不存在导致启动失败」；新增 `Dockerfile`、`.dockerignore`、`.env.example`
- compose 密码改由根目录 `.env` 注入（不再明文入库），修正 public 挂载路径，mysql 增加 healthcheck，backend 开启热重载
- 前端 `vite.config.js` 改用 `loadEnv` 读取代理目标（原先读 `process.env` 不生效）；构建改用 `npm ci`；新增 `.dockerignore`
- 不引入 ruff（移除其配置与 dev 依赖）

**文档**

- 重组 `docs/`：`planning.md`（需求）/ `todo.md`（现状+计划）/ `deploy.md`（部署，未开始）/ `reference/`（参考笔记）
- 文档内容对齐实际实现：技术栈与接口路径以后端代码为准，清除旧技术栈（Spring Boot、jar 等）提法
- 废弃手写接口样例与旧快照，接口契约改由后端导出 `openapi.json`

