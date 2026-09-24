# Changelog

只记项目的重要变更。需求见 [docs/planning.md](docs/planning.md)，现状与计划见 [docs/todo.md](docs/todo.md)，开发规范见 [docs/development.md](docs/development.md)，AI 协作说明见 [docs/ai-collaboration.md](docs/ai-collaboration.md)。

## 0.0.3（2026-09-24）

**认证**

- `POST /auth/login` 改为校验真实密码哈希并签发 access token（HS256、15 分钟）
- `app/security.py` 新增 `create_token` / `decode_token`，两种 token 靠 payload 里的 `type` 区分，不能互相替代使用
- `get_current_user` 改为真正解析 token 并查库（`UserFromToken` 依赖），`GET /users/me` 返回真实用户
- `/auth/refresh` 改为用 refresh token 换发 access token；写入 cookie 的仍是占位值，属 0.0.5
- `JWT_SECRET` / `JWT_ALGORITHM` / 有效期经由 `app/config.py` 读取，`.env.example` 与 compose 已同步

## 0.0.2（2026-09-24）

**注册与登录**

- `users` 表把 `name` 改名为 `username`，昵称列收紧为 `VARCHAR(30)`
- `POST /auth/register` 真正落库：argon2 哈希、用户名与邮箱查重（409）、`IntegrityError` 兜底回滚、响应补齐 `email`
- `POST /auth/login` 改为校验真实密码哈希，用户名不存在与密码错误返回同一条消息（token 仍是占位）
- 字段限制定稿：用户名 ≤30 且只允许 `a-z A-Z 0-9 - _`、不以分隔符开头；昵称 ≤30；密码 6~128
- 用户创建时间对内保留 `DateTime`、对外只返回日期

**工程**

- 新增 `backend/app/security.py`（`hash_password` / `verify_password`）
- 请求体参数统一命名 `body`
- 约定文档拆分：`docs/development.md`（项目规范）与 `docs/ai-collaboration.md`（AI 协作说明）
- 文档命名统一为小写、行尾统一 LF（`.gitattributes`）、Prettier 样式固定（`.prettierrc`）
- 参考笔记重组：SQLAlchemy 速查、正则校验速查新增，已完成的密码哈希笔记移入 `docs/archive/`

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
