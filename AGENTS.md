# 仓库规范

Grassit 是个人博客 / Wiki 全栈项目（FastAPI + Vue 3 + MySQL）。本文件是本仓库唯一的开发与协作规范，贡献者和 AI 助手都按它执行；产品需求见 [docs/planning.md](docs/planning.md)，现状与计划见 [docs/todo.md](docs/todo.md)，部署见 [docs/deploy.md](docs/deploy.md)。

放在仓库根目录，是为了让 Agent 自动读到它；[docs/](docs/) 内只放项目文档与学习笔记。

## 项目结构

- `backend/app/`：FastAPI 应用，按 `models/` / `routers/` / `schemas/` 分组；跨层的单一职责基础模块（`database.py`、`config.py`、`security.py`）直接平铺，同类模块到三个以上再收进子包
- `backend/init_db.py` 建表，`backend/public/` 放对外提供的静态资源
- `frontend/src/`：`api/`、`components/`、`composables/`、`router/`、`stores/`、`views/`、`utils/`、`assets/`
- `docs/`：顶层放项目文档，`docs/backend/` 与 `docs/frontend/` 放学习笔记，`docs/archive/` 放归档
- 根目录：`docker-compose.yml`、`.env.example`、`.prettierrc`、`.gitattributes`、`CHANGELOG.md`

## 常用命令

```powershell
# 后端（需要可用的 MySQL，先把 .env.example 复制成 .env）
cd backend; python -m venv .venv; .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python init_db.py                 # 建表
uvicorn app.main:app --reload     # 接口文档 http://127.0.0.1:8000/docs

# 前端
cd frontend
npm install
npm run dev                       # http://localhost:5173，/api 代理到 8000
npm run build                     # 生产构建

docker compose up                 # mysql + backend + frontend
```

## 代码风格与命名

- Python：Black，4 空格缩进，snake_case；模型与 schema 用 PascalCase
- JS / Vue / Markdown：Prettier（样式由根目录 `.prettierrc` 固定：无分号、单引号、4 空格；`package.json`、`vite.config.js` 等工具配置 2 空格）；行尾统一 LF
- Vue 组件文件名用 PascalCase；`docs/` 内文件名用小写短横线，根目录文档用大写（`README.md`、`CHANGELOG.md`）
- 请求体参数统一叫 `body`，取值直接写 `body.field`，只有值被计算/转换过、或需要重命名表达领域含义时才抽局部变量
- `config.py` 只放原始配置值（含读取与校验），不 import 业务模块、不做 I/O、不放工具函数；需要由配置派生的东西（如 SQLAlchemy 的 `DATABASE_URL`）留在各自模块里组装
- 版本号只写在 `backend/app/__init__.py` 的 `__version__`，其他位置（如 `/test`）引用它

## 文档约定

每个文档职责单一、内容不重复；学习目标已落地、当下意义不明或与项目无关的产出（例如通用格式学习笔记）放 `docs/archive/`。

## 测试

暂无自动化测试，pytest + httpx 脚手架排在 0.1.1。当前靠手工验收：起后端看 `/docs`，用 `GET /test` 确认数据库连通。后续测试覆盖注册、登录、鉴权失败与文章权限。

## 版本与变更日志

- 版本号是可验收的里程碑，不必每次改动都动版本；达成验收后打 `vX.Y.Z` tag，在 [CHANGELOG.md](CHANGELOG.md) 加一条以版号作标题的记录，并把该版本从 [docs/todo.md](docs/todo.md) 移除
- 变更日志只记重要改动（结构、接口、配置、行为等），不重要的不记；保持简洁，过时信息及时删除
- 目前只有开发环境，不要按生产标准设计；生产部署见 [docs/deploy.md](docs/deploy.md)（尚未开始）

## 提交与推送

- 提交信息用中文；版本里程碑带版号前缀，如 `0.0.3：登录签发 access token`
- 单人仓库：直接在 `main` 提交并推送到 `origin`，没有 PR 与评审流程
- 重要改动先不提交，等作者明确同意；不重要的改动（经作者同意、只改文档这类）可以直接提交并推送
- AI 可自行判断把零碎提交合并，必要时重写已推送历史并强推，不必事先征得同意

## 协作分工

- 项目带学习性质：关键的东西由作者亲自做，尤其是各种「第一次」；业务代码由作者自己写
- 交给 AI 的判断标准是**无意义重复或繁琐机械**（批量同步文档、跨文件改名之类），而不是「属于某个类别」——配置不默认归 AI，凡有学习价值的动手部分（含首次接入某个组件）都由作者做；动代码前单独确认
- 纯风格修正（改名、导入顺序、空行）与一眼可见的笔误可以直接改好，但要告知作者
- 结论一律以代码和实测为准；AI 生成且未经审查的文档不能当作事实来源
- `docs/backend/`、`docs/frontend/` 下的学习笔记（含其中由 AI 生成的示例代码）由 AI 直接编写并提交，不需要事先征得同意；笔记不是项目规范，实际以代码与实测为准

## 上下文与花费

单轮成本 ≈ 当前上下文体积 × 轮次，所以省钱的杠杆只有两个：缩小上下文、减少轮次。

- **一个里程碑一个线程**：里程碑基本完成时，先把收尾列清楚（提交、CHANGELOG、todo 更新），再主动提醒作者 `/compact` 或开新线程，并给出接续信息（下一步目标、涉及文件），新线程就不必重读历史
- **不把两件事塞进同一条线程**：与当前任务无关的探索、重构、补测试都不顺手做
- **精准检索**：用 `rg -n` 定位后只读需要的片段，不整目录列举、不整份打印文档、不重复读同一个文件
- **精简工具输出**：限制行数（如 `Select-Object -First`），大段输出会永久留在上下文里
- **回答从简**：默认给结论与差异，不复述文件全文；讲解深度由作者指定
- **少改本文件**：中途修改会打断前缀缓存，之后每轮都按未命中价计费

## 前端界面

页面布局与视觉风格由作者决定（主观取向，不作为验收项），验收只看流程能否走通；AI 不擅自调整页面结构与样式，改动前先确认。
