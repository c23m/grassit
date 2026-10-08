# 前端现成零件与坑

> 用途：速查 ｜ common 组件的 props 与默认值、数据层两个入口、几个 import / 工具函数的坑、图标与跳转的约定

> 参考笔记（学习用），不是项目规范；清单依据 `frontend/src` 与 `frontend/package.json` 实测，以代码为准。组件结构与命名规范见 [specs/components.md](../specs/components.md)。

## common 聚合入口里有什么

`@/components/common` 目前只导出 `Button`、`Radio`、`TextInput`、`Textarea`、`Link` 五个；`Icon`、`Avatar`、`Aside` 要按完整路径引（`NavBar.vue` 就是这么引 `Icon` 的）。

| 组件                 | props                                            | 用法                                                           |
| -------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `TextInput`          | `type`（默认 `text`）、`placeholder`、`disabled` | `<TextInput v-model="username" />`，密码框传 `type="password"` |
| `Button`             | `type`（默认 **`button`**）、`disabled`          | 提交按钮必须写 `<Button type="submit">`                        |
| `Link`               | 走 `url` 属性                                    | 站内跳转                                                       |
| `Textarea` / `Radio` | —                                                | —                                                              |

三个容易踩的点：

1. `Button` 默认 `type="button"`，**不是 HTML 原生的默认值**：表单里写 `<Button>提交</Button>` 点一下不会触发提交
2. `TextInput` 默认 `type="text"`，密码框必须显式传 `type="password"`，否则密码明文显示
3. `Button` 除了禁用态没有 loading 反馈，提交中用 `:disabled="submitting"` 兜住防连点，转圈之类的得自己做

## 数据层：两个入口，签名还不一样

| 入口                       | 签名                            | 说明                                           |
| -------------------------- | ------------------------------- | ---------------------------------------------- |
| `useAuthStore().login`     | `login(username, password)`     | **位置参数**，内部只写 token 和 user，不管跳转 |
| `@/api/auth.js` 的 `login` | `login({ username, password })` | 直接打接口、绕过 store，返回 `{ token, user }` |

- 跳转由页面自己做，store 只写状态：以后要支持"被守卫拦下来后回跳原页"（`?redirect=`），页面换掉跳转目标就行
- 登录响应直接带 user，登录后**不需要**再拉 `/users/me`；`fetchMe()` 只服务于"刷新后恢复登录态"
- `@/utils/request.js` 已经做掉：自动带 `Authorization: Bearer <token>`、成功响应解包成 `response.data`、401 时尝试刷新再重放。页面层拿到的是纯数据，不用碰 axios

## 几个 import / 工具函数的坑

- `@/utils/index.js` 写的是 `export * from './request.js'`，而 `request` 是 default export —— `import { request } from '@/utils'` **拿不到东西**，要引就引 `@/utils/request.js`
- `@/composables/useAysnc.js`（文件名拼错了，导出的函数叫 `useAsync`）：返回 `{ data, loading, error, execute }`，但它内部**把异常 catch 掉了**，`error` 里是 `err.message` —— 对 AxiosError 来说只是 `Request failed with status code 409`，拿不到 `detail`。要给人话提示就自己 `try / catch`（转法见 [form-errors.md](form-errors.md)）
- 要进聚合入口的新组件，先想清楚它是不是"与业务无关的基础件"

## 图标与跳转的约定

- `Icon.vue` 的白名单一共 6 个：`github`、`light`、`dark`、`menu`、`translate`、`external`。要新图标就改它的 `icons` 对象，源码用 `~icons/mdi/...` 或 `~icons/material-symbols/...`
- 跳转统一写 `{ name: 'login' }` / `{ name: 'register' }`，别手拼路径 —— 路由带可选语言前缀 `/:lang(zh|en)?`
- 想记住上次登录的用户名：`useCache.js`（localStorage 存列表）或 `@vueuse/core` 的 `useLocalStorage` 都行
- 输入框的 `autocomplete`：用户名 `username`、邮箱 `email`、注册密码 `new-password`、登录密码 `current-password`（否则密码管理器会存错）
