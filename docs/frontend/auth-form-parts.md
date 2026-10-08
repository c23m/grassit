# 认证表单页可用零件速查（Login / Register）

> 参考笔记（学习用），不是项目规范。清单依据当前 `frontend/src` 与 `frontend/package.json` 实测，实际以代码为准；页面结构和样式由作者决定。

## 最小 import 块

登录表单（用户名 + 密码 + 提交 + 错误提示）只需要这几个：

```js
import { ref } from 'vue'
import { Button, TextInput } from '@/components/common'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)
```

`@/components/common` 是聚合入口，目前只导出 `Button`、`Radio`、`TextInput`、`Textarea`、`Link` 五个。`Icon`、`Avatar`、`Aside` 没在入口里，要按完整路径引（`NavBar.vue` 就是这么引 `Icon` 的）。

## 现成组件的能力与限制

| 组件                 | props                                            | 登录页里的用法                                                 |
| -------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `TextInput`          | `type`（默认 `text`）、`placeholder`、`disabled` | `<TextInput v-model="username" />`、密码框传 `type="password"` |
| `Button`             | `type`（默认 `button`）、`disabled`              | 提交按钮**必须写 `type="submit"`**，见下方说明                 |
| `Link`               | 走 `url` 属性                                    | "去注册"这类站内跳转                                           |
| `Textarea` / `Radio` | —                                                | 登录页用不上                                                   |

三个容易踩的点：

1. **`Button` 默认是 `type="button"`**，不是 HTML 原生的默认值。表单里写 `<Button>提交</Button>` 点一下**不会**触发表单提交，得写 `<Button type="submit">提交</Button>`（`Login.vue` 已经这么用了）。
2. **`TextInput` 的 `type` 默认是 `text`**，密码框要显式传 `<TextInput type="password" v-model="password" />`，否则密码明文显示。
3. **`Button` 没有 loading / 禁用态之外的反馈**：提交中用 `:disabled="submitting"` 兜住防连点，转圈之类的得自己做。

## 数据层：两个入口，选一个

| 入口                       | 签名                            | 说明                                                            |
| -------------------------- | ------------------------------- | --------------------------------------------------------------- |
| `useAuthStore().login`     | `login(username, password)`     | **位置参数**，和 api 层不一致；内部只写 token 和 user，不管跳转 |
| `@/api/auth.js` 的 `login` | `login({ username, password })` | 直接打接口，绕过 store；返回 `{ token, user }`                  |

两个必须知道的点：

- 跳转由页面自己做（`Login.vue` 里是"显示成功提示 → 等几秒 → `router.push('/')`"）。store 只写状态，这样以后要支持"被守卫拦下来后回跳原页"（`?redirect=`）时，页面直接换掉跳转目标就行
- 登录响应直接带 user，登录后**不需要**再拉 `/users/me`；`fetchMe()` 只服务于"刷新后恢复登录态"

`@/utils/request.js` 已经做掉的事：请求自动带 `Authorization: Bearer <token>`、成功响应解包成 `response.data`、401 时尝试刷新再重放（这条属于 0.0.5）。所以页面层拿到的是纯数据，不用碰 axios。

顺带一个坑：`@/utils/index.js` 写的是 `export * from './request.js'`，而 `request` 是 default export——`import { request } from '@/utils'` 拿不到东西，要引就引 `@/utils/request.js`。

## Register.vue 的字段

`POST /auth/register`（见 `backend/app/schemas/auth.py`）收四个字段：

| 字段       | 限制                                |
| ---------- | ----------------------------------- |
| `username` | 3~30，`^[a-zA-Z0-9][a-zA-Z0-9_-]*$` |
| `nickname` | 1~30                                |
| `password` | 6~128                               |
| `email`    | 可选，`EmailStr \| None`            |

响应是 UserMe，**不带 token**，所以注册成功后跳 `/login` 而不是首页。

## 提交态与错误提示

没有现成的提示组件（没有 Toast / Alert，也没装 UI 库），错误就在模板里用 `v-if="error"` 渲染一段文本，样式自己定。可以参考 [form-errors.md](form-errors.md) 里 409 / 422 两种 `detail` 的转法。

提交态有两个现成选择：

- **`@/composables/useAysnc.js`**（文件名拼错了，导出的函数叫 `useAsync`）：返回 `{ data, loading, error, execute }`，自动管 loading 和错误。**但它内部 `catch` 掉了异常**，`error` 里放的是 `err.message`——对 AxiosError 来说就是 `Request failed with status code 409`，拿不到 `detail`。要给人话提示就得自己 `try / catch`
- **`vue-request` 的 `useRequest`**：依赖已经装了，`ApiTest.vue` 里有注释掉的用法可以参考

## 缺口清单（这些都得自己做）

- 前端表单校验（限制见上表），仓库里没有校验库；准的永远是后端校验，前端只是省一次往返
- 错误提示的展示样式与位置
- 输入框的 `autocomplete`（用户名 `username`、邮箱 `email`、注册的密码 `new-password`；`Login.vue` 里已经用上）

## 顺带一提

- 想记住上次登录的用户名，`useCache.js`（localStorage 存列表，`ApiTest.vue` 里用过）或 `@vueuse/core` 的 `useLocalStorage` 都能用
- 将来加"GitHub 登录"按钮时，`Icon.vue` 里已经有 `github` 图标（白名单里一共 6 个：github、light、dark、menu、translate、external；要新图标就改那个 `icons` 对象，源码用 `~icons/mdi/...` 或 `~icons/material-symbols/...`）
- 跳转统一写 `{ name: 'login' }` / `{ name: 'register' }`，别手拼路径——路由带可选语言前缀（`/:lang(zh|en)?`）
