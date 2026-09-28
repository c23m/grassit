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

| 组件                   | props                      | 登录页里的用法                                     |
| ---------------------- | -------------------------- | -------------------------------------------------- |
| `TextInput`            | `placeholder`、`disabled`  | `<TextInput v-model="username" />`                 |
| `Button`               | `type`（默认 `button`）、`disabled` | 提交按钮**必须写 `type="submit"`**，见下方说明 |
| `Link`                 | 走 `url` 属性              | "去注册"这类站内跳转                               |
| `Textarea` / `Radio`   | —                          | 登录页用不上                                       |

三个容易踩的点：

1. **`Button` 默认是 `type="button"`**，不是 HTML 原生的默认值。表单里写 `<Button>提交</Button>` 点一下**不会**触发表单提交，得写 `<Button type="submit">提交</Button>`。当前 `Login.vue` 里正是漏了这一处。
2. **`TextInput` 的 `type` 写死成 `text`**，没有 `type` 属性可传，所以密码框直接用它会把密码明文显示。两条路：给它加一个 `type` prop（默认 `'text'`，透传到 `<input>`），或者密码那一栏直接写原生 `<input type="password">`。
3. **`Button` 没有 loading / 禁用态之外的反馈**：提交中用 `:disabled="submitting"` 兜住防连点，转圈之类的得自己做。

## 数据层：三个入口，选一个

| 入口                              | 签名                                                     | 说明                                                                 |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| `useAuthStore().login`            | `login(username, password)`                              | **位置参数**，和 api 层不一致；内部会写 token、拉 `/users/me`、`router.push('/')` |
| `@/api/auth.js` 的 `login`        | `login({ username, password })`                          | 直接打接口，绕过 store；返回 `{ token }`（只有 token，没有用户信息）  |

两个必须知道的点：

- 走 store 的话，**成功分支不用自己跳首页**——store 里已经 `router.push('/')` 了。想支持"被守卫拦下来后回跳原页"（`?redirect=`），要么改 store 的签名，要么页面自己调 api 层
- 登录响应里**没有用户信息**，这是刻意的：用户信息统一由 `GET /users/me` 提供，store 的 `login` 里那句 `fetchMe()` 就是补这一下

`@/utils/request.js` 已经做掉的事：请求自动带 `Authorization: Bearer <token>`、成功响应解包成 `response.data`、401 时尝试刷新再重放（这条属于 0.0.5）。所以页面层拿到的是纯数据，不用碰 axios。

顺带一个坑：`@/utils/index.js` 写的是 `export * from './request.js'`，而 `request` 是 default export——`import { request } from '@/utils'` 拿不到东西，要引就引 `@/utils/request.js`。

## 提交态与错误提示

没有现成的提示组件（没有 Toast / Alert，也没装 UI 库），错误就在模板里用 `v-if="error"` 渲染一段文本，样式自己定。可以参考 [form-errors.md](form-errors.md) 里 409 / 422 两种 `detail` 的转法。

提交态有两个现成选择：

- **`@/composables/useAysnc.js`**（文件名拼错了，导出的函数叫 `useAsync`）：返回 `{ data, loading, error, execute }`，自动管 loading 和错误。**但它内部 `catch` 掉了异常**，`error` 里放的是 `err.message`——对 AxiosError 来说就是 `Request failed with status code 409`，拿不到 `detail`。要给人话提示就得自己 `try / catch`
- **`vue-request` 的 `useRequest`**：依赖已经装了，`ApiTest.vue` 里有注释掉的用法可以参考

## 缺口清单（这些都得自己做）

- 密码框的 `type="password"`（要么改 `TextInput`，要么用原生 input）
- 前端表单校验（用户名 3~30 且只允许 `a-z A-Z 0-9 - _`、密码 6~128），仓库里没有校验库；准的永远是后端校验，前端只是省一次往返
- 错误提示的展示样式与位置
- 输入框的 `autocomplete`（登录 `username` / `current-password`，注册 `new-password`）

## 顺带一提

- 想记住上次登录的用户名，`useCache.js`（localStorage 存列表，`ApiTest.vue` 里用过）或 `@vueuse/core` 的 `useLocalStorage` 都能用
- 将来加"GitHub 登录"按钮时，`Icon.vue` 里已经有 `github` 图标（白名单里一共 6 个：github、light、dark、menu、translate、external；要新图标就改那个 `icons` 对象，源码用 `~icons/mdi/...` 或 `~icons/material-symbols/...`）
- 跳转统一写 `{ name: 'login' }` / `{ name: 'register' }`，别手拼路径——路由带可选语言前缀（`/:lang(zh|en)?`）
