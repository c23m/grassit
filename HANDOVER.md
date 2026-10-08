# HANDOVER

> 交接快照，给下一条线程（人或 AI）接上进度用，只写"现在在哪"和"下一步"。规则见 [AGENTS.md](AGENTS.md)，详细待办与版本规划见 [docs/todo.md](docs/todo.md)，产品需求见 [docs/planning.md](docs/planning.md)，已完成版本见 [CHANGELOG.md](CHANGELOG.md)。
> 每个里程碑收尾时更新一次，平时不要顺手改；结论以代码和实测为准。跑项目的命令在 [README.md](README.md) 和 [AGENTS.md](AGENTS.md) 里，这里不重复。

## 现在在哪（2026-10-02）

- 最新 tag `v0.0.3`（登录签发 access token），已推送到 `origin/main`；`v0.0.3` 之后有一批提交还没打 tag
- **0.0.4 · 鉴权与前端登录态：代码全部落地，等作者验收**（todo 那一节的勾已全部打上，验收后整节移入 CHANGELOG）
- 工作区未提交：**25 个已改 + 7 个新文件**，混了三批东西 —— ① 接入 prettier / Black（18 个纯格式化文件 + 根 `package.json`、`.gitignore`、`backend/requirements-dev.txt`、`tools/`）；② 0.0.4 收尾代码；③ 文档（项目导读、简历、复核材料）。提交计划见"下一步"
- 本机从这一轮起有了格式化工具：prettier 装在根目录（`npm run format` / `format:check`），Black 装在 `backend/.venv`（命令见 [AGENTS.md](AGENTS.md) 的"常用命令"）
- 文档现状：`docs/frontend/components.md` 仍是前端结构规范；**新增 [docs/reference/project-primer.md](docs/reference/project-primer.md)**（面向零基础的全项目知识导读，6 类 71 条，目录由 [tools/gen_toc.py](tools/gen_toc.py) 生成）；上一轮的 `0.0.4-review-primer.md` 已被它取代并删除
- 本轮 AI 代写的代码逐条记在 [docs/frontend/ai-changes-0.0.4.md](docs/frontend/ai-changes-0.0.4.md)，供作者复核（包括"刷新后登录态没了"的完整排查过程）

## 下一步（按顺序）

1. **跑 0.0.4 验收**：dev server 当前是停的，先 `npm run dev`（后端也要起）。链路：注册新账号 → 登录 → 导航栏出现昵称 → **刷新后仍在登录态** → 未登录访问 `/user/<username>` 被拦回 `/login`；顺手看：已登录访问 `/login` 会不会被送回首页、窄屏（<768px）点菜单图标有没有面板、Playground 的退出登录好不好使
2. **提交**（建议三笔，别混在一起）：
   - `chore：接入 prettier 与 Black` —— 18 个纯格式化文件 + `package.json`、`package-lock.json`、`.gitignore`、`backend/requirements-dev.txt`、`tools/`
   - `0.0.4：前端登录态、路由守卫与导航栏收尾` —— `router/index.js`、`main.js`、`stores/auth.js`、`NavBar.vue`、`NavAvatar.vue`、`Footer.vue`、`Playground.vue`、`base.css`、`BaseLayout.vue`
   - `文档：项目知识导读与 0.0.4 复核材料` —— `docs/reference/project-primer.md`、`docs/frontend/ai-changes-0.0.4.md`、`docs/resume.md`、`AGENTS.md`、`docs/todo.md`、`HANDOVER.md`、两边 `references.md`、`components.md`
3. **收尾**：CHANGELOG 记一条（版号作标题）→ 从 [docs/todo.md](docs/todo.md) 移除 0.0.4 → 打 `v0.0.4` tag → 更新本文件"现在在哪"
4. 顺手可做：`docs/frontend/auth-form-parts.md`、`form-errors.md` 是为登录 / 注册页写的，两页已落地，按"做完即删"删掉并同步 [frontend/references.md](docs/frontend/references.md)

## 接手前先知道的几件事

- **登录态恢复在路由守卫里**：`router/index.js` 的 `beforeEach` 先 `await auth.restore()`（幂等：没 token 或已有 user 立刻返回），再按 `meta.requiresAuth` / `meta.guestOnly` 放行或跳转。这是首屏不再闪「注册 | 登录」的原因，代价是有 token 时首次渲染要等这次请求
- **token 只活 15 分钟，而 refresh 是 0.0.5**：过期后刷新会走拦截器的 401 → `/auth/refresh`（cookie 还是占位值，必失败）→ 清 token 并跳登录页。看到"被踢回登录页"先想到这条，不是恢复逻辑坏了
- **NavAvatar 取 store 必须用 `storeToRefs`**：`const { user } = useAuthStore()` 拿到的是快照，`me` 回来界面也不会变（这个坑踩过一次，见 ai-changes 那份文档）
- 守卫用的 `/user/:username` 指向还是空壳的 `views/Dashboard.vue` —— 特意挂上路由，好让"未登录被拦回 `/login`"这条验收有可测对象；页面内容是 0.2.x 的事
- 移动端菜单面板是**基线版**（绝对定位在导航栏下方、纵向排列、点一下收起），样式随作者改
- `router/index.js` import store、store 又 import router，是循环依赖，但两边都只在函数体里用（守卫回调 / `logout`），延迟解析没问题；别在模块顶层调 `useAuthStore()`
- localStorage 的 token key 被 `stores/auth.js` 和 `utils/request.js` 各持一份（两个 ref），拦截器清 token 时 store 那份 ref 的值不会跟着变 —— 动 0.0.5 的拦截器时要注意
- 前端路由带可选语言前缀 `/:lang(zh|en)?`，跳转写 `{ name: 'login' }` 比手拼路径省事

## 已知问题（还没排进版本）

- `backend/app/__init__.py` 的 `__version__` 还是 `0.0.2`，没跟着 `v0.0.3` 走（属代码改动，留给作者）
- 注册 / 登录在 `async def` 里直接调 argon2 同步哈希（`app/security.py`），并发时会阻塞事件循环；`create_async_engine(..., echo=True)` 也是开发配置。AGENTS.md 的"后端异步红线"已经写了规则，这两处还没改
- `UserMe` 有 `avatar` / `github` 字段，但 `users` 表（`backend/app/models/user.py`）里没有对应列，所以 `/users/me` 返回的这两个永远是 null。要真头像得先加列并做存储（属 0.2.x）；在那之前导航栏用户区只显示昵称
- `stores/auth.js` 的 `logout()` 先 `await logoutApi()` 再清状态 —— 接口失败时本地不会被清，界面上像"退出没反应"。要不要改成先清本地、再尽力通知后端，留给作者定
- `routers/article.py` 的 GET 返回写死的样例、POST / DELETE 是 `return None` 的空实现；文章模型与表、真 CRUD 都在 0.1.0

## 这台机器上的两个环境限制（会咬 AI 的操作）

- **被 spawn 出来的进程不能覆盖工作区里已存在的文件**（EPERM，连根目录 `README.md` 都一样，只有 DSH 自己的文件工具能写）。所以 `prettier --write`、`black`、`pip install`、删 `docs/` 下的文件，AI 侧都要**临时放宽一次沙箱权限**才能做；作者在自己的终端里没这个问题
- npm 的默认缓存 `D:\Develop\nodejs\node_cache` 在工作区外，AI 侧写不进去：装包要加 `--cache .npm-cache`（该目录已 gitignore，可随时删）
