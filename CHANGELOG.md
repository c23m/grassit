# Changelog

记录由 AI 助手代做的改动（主要是配置、文档、构建等重复性工作）。需求见 [docs/PLANNING.md](docs/PLANNING.md)，现状与计划见 [docs/TODO.md](docs/TODO.md)。

## 约定（作者的偏好，长期有效）

- **分工**：业务代码由作者自己写；AI 只做 bug 修复、文档、配置、构建这类重复性工作，动代码前要单独确认
- **依据**：结论一律以代码和实测为准；AI 生成且未经审查的文档不能当作事实来源（旧技术栈的错误表述就是这样一路传播开的）
- **环境**：目前只有开发环境，生产部署尚未开始；开发配置不要按生产标准去设计
- **文档**：每个文档职责单一、不允许内容重复；学习/参考类放 `docs/reference/`，过时内容放 `docs/archive/`
- **本文件**：只用于记录 AI 代做的改动，保持简洁，过时信息及时删除

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

- 重组 `docs/`：`PLANNING.md`（需求）/ `TODO.md`（现状+计划）/ `deploy.md`（部署，未开始）/ `reference/`（参考笔记）
- 文档内容对齐实际实现：技术栈与接口路径以后端代码为准，清除旧技术栈（Spring Boot、jar 等）提法
- 废弃手写接口样例与旧快照，接口契约改由后端导出 `openapi.json`
- `README.md` 补充单仓库结构与本地开发步骤
- 本文件改按「只记录 AI 代做的改动」定位重写，并记录上方协作约定

