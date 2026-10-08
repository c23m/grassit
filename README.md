# Grassit

全栈网站项目GST.

在线地址：<https://grassit.cn>

## 当前状态

开发阶段，**部署尚未处理**；`docker-compose.yml` 目前只服务于本地开发。当前进度与下一步见 [HANDOVER.md](HANDOVER.md)。

接口与字段**以实际实现为准**：

- 后端：`backend/app/routers/`、`backend/app/schemas/`
- 前端：`frontend/src/api/`

## 本地开发

单仓库结构：`backend/`（FastAPI）+ `frontend/`（Vue 3），根目录放编排与文档。

```bash
# 后端（需要可用的 MySQL）
cd backend
python -m venv .venv; .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload        # 接口文档 http://127.0.0.1:8000/docs

# 前端
cd frontend
npm install
npm run dev                          # http://localhost:5173，/api 代理到 8000
```

也可以直接用容器起全部服务：`docker compose up`（需先把 `.env.example` 复制成 `.env`）。

接口调试：部分接口仍返回测试数据（见 `backend/app/routers/`），前端不需要 mock。

## 文档

| 文档                                 | 职责                                                           |
| ------------------------------------ | -------------------------------------------------------------- |
| [docs/planning.md](docs/planning.md) | 产品需求：目标与范围、用户、认证、文章、存储、接口、待定事项   |
| [docs/todo.md](docs/todo.md)         | 现状与计划                                                     |
| [AGENTS.md](AGENTS.md)               | 仓库规范：结构、命令、风格、协作分工、提交与版本               |
| [HANDOVER.md](HANDOVER.md)           | 交接快照：当前进度、下一步做什么、已知不一致                   |
| [CHANGELOG.md](CHANGELOG.md)         | 变更历史                                                       |
| [docs/deploy.md](docs/deploy.md)     | 部署（尚未开始）                                               |
| [docs/backend/](docs/backend/)       | 后端文档：规范、任务指南与引用说明                             |
| [docs/frontend/](docs/frontend/)     | 前端文档：页面与组件基准、任务指南、引用说明                   |
| [docs/reference/](docs/reference/)   | 参考件：速查与学习笔记，不绑任务（引用见两边 `references.md`） |

## 技术栈

- **前端**：Vue 3（JavaScript）+ Vite + Vue Router + Pinia
- **后端**：FastAPI（Python 3.12）+ SQLAlchemy 2.0（异步）+ Pydantic v2
- **数据库**：MySQL 8.4
- **缓存（计划）**：Redis（登出 / 封禁的 token 撤销名单，见 [docs/todo.md](docs/todo.md) 的 0.3.0）
- **桌面端**：Electron(计划)
- **实时通信**：WebSocket / WebRTC(计划)
- **部署（未开始）**：
  - Linux / WSL
  - Nginx（反向代理 + 静态资源）
  - Cloudflare Tunnel（对外暴露）
  - Docker Compose（编排所有服务）
