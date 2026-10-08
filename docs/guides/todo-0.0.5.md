# 0.0.5 · refresh token 闭环（当前开发版本）

> 生命周期：临时 ｜ 跟着 0.0.5 走：版本收尾时（记 CHANGELOG、更新 HANDOVER）删掉本文件

> 当前开发版本的详细待办放这里，**未来版本只列在 [todo.md](../todo.md)**。做完一项就打勾；过程中的发现写在最后。
> 目标与验收抄自版本规划，动手前先看这里的"后端已就绪的部分"。

## 目标

access token 过期后能自动续期；刷新失败则清空登录态并回到登录页。

学习内容：HttpOnly Cookie 的作用域与路径、401 自动续期、并发刷新与重试标记。

**页面**：无新页面，登录态失效的表现体现在拦截器与跳回登录页。

## 待办

- [x] 登录时下发 refresh token（HttpOnly、`path=/auth`、30 天）—— 后端已完成
- [x] `POST /auth/refresh` 校验 refresh token 并换发新的 access token —— 后端已完成
- [ ] 前端拦截器：401 → 刷新 → 重放原请求；刷新失败则清空登录态并回登录页
- [ ] 并发刷新去重：同时多个 401 只发一次刷新，其余等它的结果（否则会换出多个 token）
- [ ] 刷新请求自身失败时不再递归触发刷新（重试标记）

## 后端已就绪的部分（2026-10-03 实测）

用测试账号走了一遍完整链路，代码在 `backend/app/routers/auth.py`：

| 步骤                                | 结果                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `POST /auth/login`                  | 200；`Set-Cookie: refreshToken=…`，`HttpOnly`、`path=/auth`，值是三段式 JWT |
| `POST /auth/refresh`（带 cookie）   | 200，返回新的 access token                                                  |
| 用换发的 token 取 `GET /users/me`   | 200                                                                         |
| `POST /auth/refresh`（不带 cookie） | 401 `Invalid refresh token`                                                 |

**所以 0.0.5 剩下的只有前端那一半。**

## 动手前先知道的几点

- 拦截器在 `frontend/src/utils/request.js`。localStorage 的 token key 被它和 `stores/auth.js` 各持一份（两个 ref），拦截器清 token 时 store 那份 ref 不会跟着变 —— 这一轮顺手统一成一处
- 过期后的现象与排查过程见 [../notes/login-state-recovery.md](../notes/login-state-recovery.md)
- 后端 `security.decode_token` 按 payload 里的 `type` 区分 access / refresh，两种 token 不能互换使用

## 过程中的发现

（做完一项就补在这里：踩到的坑、要改的约定、留到下一个版本的事）
