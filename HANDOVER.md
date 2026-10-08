# HANDOVER

> 交接快照，给下一条线程（人或 AI）接上进度用，只写"现在在哪"和"下一步"。规则见 [AGENTS.md](AGENTS.md)，详细待办与版本规划见 [docs/todo.md](docs/todo.md)，产品需求见 [docs/planning.md](docs/planning.md)，已完成版本见 [CHANGELOG.md](CHANGELOG.md)。
> 每个里程碑收尾时更新一次，平时不要顺手改；结论以代码和实测为准。跑项目的命令在 [README.md](README.md) 和 [AGENTS.md](AGENTS.md) 里，这里不重复。

## 现在在哪（2026-10-03）

- 最新 tag `v0.0.4`（鉴权与前端登录态），**已推送到 `origin/main`**；`backend/app/__init__.py` 的 `__version__` 也跟到 `0.0.4` 了（`GET /test` 返回的就是它）
- **0.0.4 已验收并收尾**：作者在浏览器里走过"注册 → 登录 → 导航栏出现昵称 → 刷新仍在登录态 → 未登录被拦回 `/login`"；CHANGELOG 已记一条，`docs/todo.md` 里那一节已移除
- 这一阶段共 7 笔提交，已全部推送：`chore：接入 prettier 与 Black`（全仓统一 2 空格）→ `0.0.4：前端登录态…` → `文档：项目知识导读…` → `文档：重组 docs 目录…` → `文档：0.0.4 收尾…` → `文档：工作流调整…` → `0.0.4：__version__ 跟到 0.0.4`
- 文档现状：`docs/` 为「根下 / `specs/` 领域规范 / `guides/` 当前阶段在用 / `notes/` 学习与速查」，哪份管什么见 [docs/README.md](docs/README.md)。**当前开发版本的详细待办在 [docs/guides/todo-0.0.5.md](docs/guides/todo-0.0.5.md)**（带勾选框），`docs/todo.md` 只写未来版本
- 本机有格式化工具：prettier 装在根目录（`npm run format` / `format:check`），Black 装在 `backend/.venv`（命令见 [AGENTS.md](AGENTS.md) 的"常用命令"）

## 下一步（按顺序）

1. **0.0.5 · refresh token 闭环**：详细待办在 [docs/guides/todo-0.0.5.md](docs/guides/todo-0.0.5.md)。**后端那半已经实测通过**（`login` 下发真实 refresh JWT、`POST /auth/refresh` 能换发、换发的 token 可用、不带 cookie 是 401），**只剩前端拦截器**：401 → 刷新 → 重放、并发刷新去重、刷新失败清空登录态
2. 顺手可做：`routers/article.py` 还是写死样例 / `return None` 的空实现（0.1.0 的活）

## 接手前先知道的几件事

- **登录态恢复在路由守卫里**：`router/index.js` 的 `beforeEach` 先 `await auth.restore()`（幂等：没 token 或已有 user 立刻返回），再按 `meta.requiresAuth` / `meta.guestOnly` 放行或跳转。这是首屏不再闪「注册 | 登录」的原因，代价是有 token 时首次渲染要等这次请求。当时踩的坑与排查过程见 [docs/notes/login-state-recovery.md](docs/notes/login-state-recovery.md)
- **token 只活 15 分钟，而 refresh 闭环是 0.0.5**：过期后刷新会走拦截器的 401 → `/auth/refresh` → 清 token 并跳登录页（后端接口是好的也已实测，缺前端重放那半）。看到"被踢回登录页"先想到这条，不是恢复逻辑坏了
- **NavAvatar 取 store 必须用 `storeToRefs`**：`const { user } = useAuthStore()` 拿到的是快照，`me` 回来界面也不会变（踩过一次，[docs/notes/pinia.md](docs/notes/pinia.md) 里也写了）
- 守卫用的 `/user/:username` 指向还是空壳的 `views/Dashboard.vue` —— 特意挂上路由，好让"未登录被拦回 `/login`"这条验收有可测对象；页面内容是 0.2.x 的事
- 移动端菜单面板是**基线版**（绝对定位在导航栏下方、纵向排列、点一下收起），样式随作者改
- `router/index.js` import store、store 又 import router，是循环依赖，但两边都只在函数体里用（守卫回调 / `logout`），延迟解析没问题；别在模块顶层调 `useAuthStore()`
- localStorage 的 token key 被 `stores/auth.js` 和 `utils/request.js` 各持一份（两个 ref），拦截器清 token 时 store 那份 ref 的值不会跟着变 —— 动 0.0.5 的拦截器时要注意，清单里已列了"顺手统一成一处"
- 前端路由带可选语言前缀 `/:lang(zh|en)?`，跳转写 `{ name: 'login' }` 比手拼路径省事

## 已知问题（还没排进版本）

- 注册 / 登录在 `async def` 里直接调 argon2 同步哈希（`app/security.py`），并发时会阻塞事件循环；`create_async_engine(..., echo=True)` 也是开发配置。AGENTS.md 的"后端异步红线"已经写了规则，这两处还没改
- `UserMe` 有 `avatar` / `github` 字段，但 `users` 表（`backend/app/models/user.py`）里没有对应列，所以 `/users/me` 返回的这两个永远是 null。要真头像得先加列并做存储（属 0.2.x）；在那之前导航栏用户区只显示昵称
- `stores/auth.js` 的 `logout()` 先 `await logoutApi()` 再清状态 —— 接口失败时本地不会被清，界面上像"退出没反应"。要不要改成先清本地、再尽力通知后端，留给作者定
- `routers/article.py` 的 GET 返回写死的样例、POST / DELETE 是 `return None` 的空实现；文章模型与表、真 CRUD 都在 0.1.0

## 这台机器上的环境限制（会咬 AI 的操作）

- **被 spawn 出来的进程不能覆盖工作区里已存在的文件**（EPERM，连根目录 `README.md` 都一样，只有 DSH 自己的文件工具能写）。所以 `prettier --write`、`black`、`pip install`、`git add` / `git commit` / `git tag` / `git push`、移动或删除文件，AI 侧都要**临时放宽一次沙箱权限**才能做；作者在自己的终端里没这个问题
- **vite 在受限模式下起不来**：它解析真实路径时要 spawn 子进程，而沙箱禁止带管道的子进程（`spawn EPERM`）。起 `npm run dev` 同样要放宽一次权限
- npm 的默认缓存 `D:\Develop\nodejs\node_cache` 在工作区外，AI 侧写不进去：装包要加 `--cache .npm-cache`（该目录已 gitignore，可随时删）
- **起服务前先看一眼端口**：8000 已被占用时再起 `uvicorn` 会直接报 `Errno 10048`（实测遇到过）。注意**别的会话 / 别的沙箱账号起的进程，`Get-Process -Id` 可能查不到 PID，但服务是活的**（作者自己终端里起的、或另一个 agent 起的都可能），所以先 `netstat -ano | Select-String ':8000'` 看清，别当成孤儿进程直接杀
- **DSH 的 Open In → VS Code 打不开**（与仓库代码无关）：宿主进程自身带着 `ELECTRON_RUN_AS_NODE=1`，而 `dsh-subprocess` 的 `scrubbedParentEnv()` 只过滤 `*KEY*/*PASSWORD*/*SECRET*/*TOKEN*` 与 `DSH_*`，没过滤它 → VS Code 被当 Node 跑，55ms 退出（code=1）。IntelliJ IDEA、Git Bash、文件资源管理器不受影响；文件卡片那条路走系统 shell，是好的
- 仓库里一部分文件的所有者是另一个 agent 的沙箱账号（`LAPTOP-MING725\CodexSandboxOffline`），一部分归 `BUILTIN\Administrators`。2026-10-03 用 Windows 文件权限诊断脚本查过工作区根：当前用户有完全控制权、子树里没发现异常权限项、脚本无需改动，所以**"删 docs/ 下的文件被拒"的确切机制还没定论**，遇到时按"放宽一次权限"处理
