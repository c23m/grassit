# HANDOVER

> 交接快照，给下一条线程（人或 AI）接上进度用，只写"现在在哪"和"下一步"。规则见 [AGENTS.md](AGENTS.md)，当前版本待办在 [docs/guides/todo.md](docs/guides/todo.md)，需求与版本规划见 [docs/planning.md](docs/planning.md)，已完成版本见 [CHANGELOG.md](CHANGELOG.md)。
> 每个里程碑收尾时更新一次，平时不要顺手改；结论以代码和实测为准。跑项目的命令在 [README.md](README.md) 和 [AGENTS.md](AGENTS.md) 里，这里不重复。

## 现在在哪（2026-10-08）

- 最新 tag 仍是 `v0.0.4`（鉴权与前端登录态）；**0.0.5（refresh token 闭环）代码已完成、验收已通过，但还没提交、没打 tag** —— 收尾只剩：提交 + 打 `v0.0.5` tag + 推送（提交要作者点头）
- 0.0.5 的验收是在**真浏览器**里跑的（headless Chrome + CDP，方法见下）：登录后把 access token 换成真过期的 → `/auth/refresh` **1 次 200**、token 换新、页面保持登录态；token 有效时不误刷（0 次）；refresh 也过期时清空登录态并落到 `/login`
- 工作区共 20 个文件改动（refresh 闭环 + 顺带的调试页合并、登出跳转规则、Home 推荐卡片、库账号约定），**全部未提交**；[CHANGELOG.md](CHANGELOG.md) 已记 0.0.5 一条
- 文档现状：`docs/` 为「根下（需求与版本规划）/ `specs/` 领域规范 / `guides/` 当前阶段在用 / `notes/` 学习与速查」，哪份管什么见 [docs/README.md](docs/README.md)。**当前开发版本的详细待办固定叫 [docs/guides/todo.md](docs/guides/todo.md)**（文件名不带版本号，收尾时改内容、不删文件），现已换成 **0.1.0 · MVP** 的内容；未来版本写在 [docs/planning.md](docs/planning.md) 的「九、版本规划」（原先的 `docs/todo.md` 已并进那里）
- 本机有格式化工具：prettier 装在根目录（`npm run format` / `format:check`），Black 装在 `backend/.venv`（命令见 [AGENTS.md](AGENTS.md) 的"常用命令"，跑之前记得设 `BLACK_CACHE_DIR`，见下面的环境限制）

## 下一步（按顺序）

1. **0.0.5 收尾**：提交（把 `backend/app/__init__.py` 的 `__version__` 跟到 `0.0.5`）、打 tag `v0.0.5`、推送
2. **0.1.0 · MVP**：详细待办在 [docs/guides/todo.md](docs/guides/todo.md)。目标：注册 → 登录 → 发布文章 → 在首页列表与详情页读到它；`routers/article.py` 的写死样例与空实现就是要做实的地方

## 接手前先知道的几件事

- **登录态恢复在路由守卫里**：`router/index.js` 的 `beforeEach` 先 `await auth.restore()`（幂等：没 token 或已有 user 立刻返回），再按 `meta.requiresAuth` / `meta.guestOnly` 放行或跳转。这是首屏不再闪「注册 | 登录」的原因，代价是有 token 时首次渲染要等这次请求。当时踩的坑与排查过程见 [docs/notes/login-state-recovery.md](docs/notes/login-state-recovery.md)
- **token 只活 15 分钟，refresh 闭环已在 0.0.5 补上（真浏览器实测通过，代码未提交）**：过期后拦截器走 401 → `POST /api/auth/refresh` → 重放原请求，刷新也失败才清空登录态并回 `/login`。看到"被踢回登录页"先看 refresh cookie 在不在（`path=/api/auth`，这次改 path 之前登录的那份已作废，要重新登录）
- **NavAvatar 取 store 必须用 `storeToRefs`**：`const { user } = useAuthStore()` 拿到的是快照，`me` 回来界面也不会变（踩过一次，[docs/notes/pinia.md](docs/notes/pinia.md) 里也写了）
- 守卫用的 `/user/:username` 指向还是空壳的 `views/Dashboard.vue` —— 特意挂上路由，好让"未登录被拦回 `/login`"这条验收有可测对象；页面内容是 0.2.x 的事
- 移动端菜单面板是**基线版**（绝对定位在导航栏下方、纵向排列、点一下收起），样式随作者改
- `router/index.js` import store、store 又 import router，是循环依赖，但两边都只在函数体里用（守卫回调 / `logout`），延迟解析没问题；别在模块顶层调 `useAuthStore()`
- localStorage 的 token key 被 `stores/auth.js` 和 `utils/request.js` 各持一份（两个 ref），但两处都用 `useLocalStorage`，靠 VueUse 的同页面 `storage` 事件同步，读到的是同一个值（0.0.5 实测确认；只有绕过 VueUse 直接写 localStorage 才会不同步）。拦截器清登录态走 store 的 `clearSession()`（清 token + user），**只清 token 不行**——`user` 还在时跳 `/login` 会被守卫当成"已登录"又送回首页
- 前端路由带可选语言前缀 `/:lang(zh|en)?`，跳转写 `{ name: 'login' }` 比手拼路径省事
- **本地库的账号都是开发/测试用的**（没有真实用户，也一直不会有）：`admin`（昵称 管理员、邮箱 admin@grassit.cn、密码 `123456`）是目前**唯一的管理员假设**（权限判断还没做），另有 `test1` / `test2` / `test3`（密码同为 `123456`）当测试数据。库重置后要按 [backend/init_db.py](backend/init_db.py) 顶部的注释把 admin 补回来

## 已知问题（还没排进版本）

- 注册 / 登录在 `async def` 里直接调 argon2 同步哈希（`app/security.py`），并发时会阻塞事件循环；`create_async_engine(..., echo=True)` 也是开发配置。AGENTS.md 的"后端异步红线"已经写了规则，这两处还没改
- `UserMe` 有 `avatar` / `github` 字段，但 `users` 表（`backend/app/models/user.py`）里没有对应列，所以 `/users/me` 返回的这两个永远是 null。要真头像得先加列并做存储（属 0.2.x）；在那之前导航栏用户区只显示昵称
- `stores/auth.js` 的 `logout()` 先 `await logoutApi()` 再清状态 —— 接口失败时本地不会被清，界面上像"退出没反应"。要不要改成先清本地、再尽力通知后端，留给作者定
- `routers/article.py` 的 GET 返回写死的样例、POST / DELETE 是 `return None` 的空实现；文章模型与表、真 CRUD 都在 0.1.0

## 这台机器上的环境限制（会咬 AI 的操作）

- **被 spawn 出来的进程不能覆盖工作区里已存在的文件**（EPERM，连根目录 `README.md` 都一样，只有 DSH 自己的文件工具能写）。所以 `prettier --write`、`black`、`pip install`、`git add` / `git commit` / `git tag` / `git push`、移动或删除文件，AI 侧都要**临时放宽一次沙箱权限**才能做；作者在自己的终端里没这个问题
- **vite 在受限模式下起不来**：它解析真实路径时要 spawn 子进程，而沙箱禁止带管道的子进程（`spawn EPERM`）。起 `npm run dev` 同样要放宽一次权限
- **headless Chrome / Edge 在受限模式下也起不来**：先是 crashpad `OpenProcess` 拒绝访问（0x5），接着 Mojo 的 `platform_channel`（命名管道）被拒 —— 沙箱边界，不是浏览器坏了。要跑真浏览器测试（CDP）得放宽一次权限；跑完记得关掉（连浏览器级 WebSocket 发 `Browser.close`），别关了作者自己开着的浏览器
  - 顺带：**要测 token 过期不必等**——把 `settings.access_token_expire_minutes` / `refresh_token_expire_days` 设成 `-1`，再用 `security.create_token(1, "access")` 现签一个"已过期"的 token 即可（走的是 app 自己的签名逻辑）；从 `/json/version` 拿 CDP 地址，就能在真浏览器里跑完整链路
- npm 的默认缓存 `D:\Develop\nodejs\node_cache` 在工作区外，AI 侧写不进去：装包要加 `--cache .npm-cache`（该目录已 gitignore，可随时删）
- **Black 会一直挂住**：它的缓存默认写在工作区外（`%LOCALAPPDATA%\black`），受限模式下写不进去，`black --check` 能卡两分钟还没完；先设 `$env:BLACK_CACHE_DIR = "$env:TEMP\black-cache"` 再跑（同一文件从"卡住"变成 90ms 通过）
- **起服务前先看一眼端口**：8000 已被占用时再起 `uvicorn` 会直接报 `Errno 10048`（实测遇到过）。注意**别的会话 / 别的沙箱账号起的进程，`Get-Process -Id` 可能查不到 PID，但服务是活的**（作者自己终端里起的、或另一个 agent 起的都可能），所以先 `netstat -ano | Select-String ':8000'` 看清，别当成孤儿进程直接杀
- **DSH 的 Open In → VS Code 打不开**（与仓库代码无关）：宿主进程自身带着 `ELECTRON_RUN_AS_NODE=1`，而 `dsh-subprocess` 的 `scrubbedParentEnv()` 只过滤 `*KEY*/*PASSWORD*/*SECRET*/*TOKEN*` 与 `DSH_*`，没过滤它 → VS Code 被当 Node 跑，55ms 退出（code=1）。IntelliJ IDEA、Git Bash、文件资源管理器不受影响；文件卡片那条路走系统 shell，是好的
- 仓库里一部分文件的所有者是另一个 agent 的沙箱账号（`LAPTOP-MING725\CodexSandboxOffline`），一部分归 `BUILTIN\Administrators`。2026-10-03 用 Windows 文件权限诊断脚本查过工作区根：当前用户有完全控制权、子树里没发现异常权限项、脚本无需改动，所以**"删 docs/ 下的文件被拒"的确切机制还没定论**，遇到时按"放宽一次权限"处理
