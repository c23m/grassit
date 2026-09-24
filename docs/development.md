# 开发规范

项目层面的约定，写代码或文档前先看这一篇；与 AI 协作的规则见 [ai-collaboration.md](ai-collaboration.md)。

- **环境**：目前只有开发环境，生产部署尚未开始；开发配置不要按生产标准去设计
- **文档**：每个文档职责单一、不允许内容重复；文件命名：根目录用大写（`README.md`、`CHANGELOG.md`），`docs/` 内一律小写短横线（`planning.md`、`todo.md`）；学习/参考类按语言平铺在 `docs/frontend/` 与 `docs/backend/`；学习目标已落地、当下意义不明或与项目无关的产出（例如通用格式学习笔记）放 `docs/archive/`
- **代码结构**：后端 `app/` 按 `models/` / `routers/` / `schemas/` 分组；跨层的单一职责基础模块（如 `database.py`、`security.py`）直接平铺在 `app/` 下，同类模块成组（三个以上）再收进子包
- **配置边界**：`config.py` 只放原始配置值（含读取与校验），不 import 业务模块、不做 I/O、不放工具函数；读取方式用 pydantic-settings 的 `BaseSettings`；需要由配置派生的东西（如 SQLAlchemy 的 `DATABASE_URL`）留在各自模块里组装
- **命名与取值**：请求体参数统一叫 `body`，与实体类、响应数据区分；取值直接写 `body.field`，不为复制字段引入局部变量，只有值被计算/转换过、或需要重命名表达领域含义时才抽变量
- **代码格式**：Python 用 Black；JS / Vue / Markdown 用 Prettier（样式由根目录 `.prettierrc` 固定：业务代码与文档 4 空格，工具配置如 `package.json`、`vite.config.js` 2 空格）；不要手写出与格式化结果冲突的排版；行尾统一 LF（见 `.gitattributes`）
- **版本号**：只写在 `backend/app/__init__.py` 的 `__version__`，其他位置（如 `/test`）引用它
- **版本收尾**：验收通过后打 `vX.Y.Z` tag，在 [CHANGELOG.md](../CHANGELOG.md) 加一条以版号作标题的记录，并把该版本从 [todo.md](todo.md) 移除
- **变更日志**：只记重要改动（结构、接口、配置、行为等），不重要的不记；保持简洁，过时信息及时删除
