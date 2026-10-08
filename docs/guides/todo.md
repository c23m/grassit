# 当前版本 · 0.1.0 · MVP

> 生命周期：临时 ｜ 跟着**当前版本**走：版本收尾时把本文件的内容换成下一个版本的待办（**文件名不带版本号、不新建文件**）；上一版可用的结论提炼进 `notes/` 或记进 [CHANGELOG.md](../../CHANGELOG.md)

> 本文件是**当前开发版本**的详细待办（带 `- [ ]` 勾选框）；未来版本只写在 [planning.md](../planning.md) 的「[九、版本规划](../planning.md#九版本规划)」里，已完成版本只留在 [CHANGELOG.md](../../CHANGELOG.md)。规范见 [AGENTS.md](../../AGENTS.md)。
> 目标与验收抄自版本的规划，动手前先看下面的"动手前先知道的几点"。

## 目标

注册 → 登录 → 发布文章 → 在首页列表与详情页读到它（暂时用 slug 访问）。

学习内容：一对多关联、查询参数校验、Markdown 渲染与 XSS 防护。

**页面**

- `Home.vue`：首页文章列表接真实数据
- `Article.vue`：详情页启用 `marked` 渲染（现在模板与逻辑整段被注释）
- 发文页（新建）：标题、slug、标签、正文

## 待办

- [ ] `Article` 模型与表：slug 唯一、标签、可见性、字数；与 `User` 一对多（作者）
- [ ] `POST /articles` 创建，作者取自登录态（`UserFromToken`）而不是请求体
- [ ] `GET /articles` 列表与筛选（author / title / slug / start / end / tags）
- [ ] `GET /articles/{identifier}` 详情
- [ ] `DELETE /articles/{identifier}` 物理删除，仅作者可删
- [ ] 前端 `Article.vue` 启用 `marked` 渲染，并做 sanitize（`v-html` 直接渲染用户内容是 XSS 入口）
- [ ] 发文页（新页面 + 路由）：标题、slug、标签、正文
- [ ] `Home.vue` 文章列表接真实数据
- [ ] `markdown.css` 的配色统一到 `.dark`（现在走 `prefers-color-scheme` 跟随系统，与应用的手动暗色不一致）

## 验收

用新注册的账号发一篇文章，未登录也能在首页列表和详情页读到。

## 动手前先知道的几点

- `routers/article.py` 现在 GET 返回**写死的样例**、POST / DELETE 是 `return None` 的空实现 —— 这一版把它做实；前端 `api/article.js` 的函数名已经定好（`getArticles` / `getArticle` / `uploadArticle`）
- **后端响应是 camelCase**（`schemas/base.py` 配了 `to_camel` 别名），前端取字段别照 Python 字段名写（`dbStatus` 而非 `db_status`，踩过）
- 详情页的模板与逻辑现在整段被注释；启用 `v-html` 前先定 sanitize 方案（`marked` 本身不防 XSS）
- 本地库账号：`admin`（管理员、密码 `123456`）是唯一的管理员假设，另有 `test1`~`test3` 测试账号；重置后按 [backend/init_db.py](../../backend/init_db.py) 顶部注释补回来（详见 [HANDOVER.md](../../HANDOVER.md)）
- 自动化测试脚手架排在 **0.1.1**，本版仍是手工验收（浏览器里走一遍流程）
- 写代码前看 [docs/specs/components.md](../specs/components.md)（前端结构基准）与 [docs/planning.md](../planning.md) 的文章接口定义

## 过程中的发现

（做完一项就补在这里：踩到的坑、要改的约定、留到下一个版本的事；版本收尾时把它们提炼进 `notes/`）
