# 表单提交与错误处理速查

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> 错误码与字段限制对照 [planning.md](../planning.md)（7.4 错误码表、3.1 注册），接口行为对照 `backend/app/routers/auth.py`。

## 一次提交的完整链路

```vue
<script setup>
import { ref } from 'vue'
import { register } from '@/api/auth'

const username = ref('')
const error = ref('')
const submitting = ref(false)

const onSubmit = async () => {
    error.value = ''
    submitting.value = true
    try {
        await register({ username: username.value })
    } catch (err) {
        error.value = toMessage(err)
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <form @submit.prevent="onSubmit">
        <input v-model="username" />
        <p v-if="error">{{ error }}</p>
        <button type="submit" :disabled="submitting">提交</button>
    </form>
</template>
```

逐段说明：

- `@submit.prevent` 拦住浏览器默认的整页提交，表单里的提交按钮才会走我们的函数
- 提交函数必须是 `async` 并 `catch`：不 catch 的失败只会在控制台留一条 unhandled rejection，界面上毫无反应
- `finally` 里复位 `submitting`。放进 try 里的话，请求一失败按钮就永久禁用了
- `:disabled="submitting"` 是防连点。注册被点两次，第二次必然 409，用户看到的是"我什么都没改，它却说我用户名重复"

## axios 的错误对象长什么样

`catch` 到的是 `AxiosError`，大部分内容在 `err.response` 里（前提是服务器确实回了响应）：

| 位置                  | 内容                                              |
| --------------------- | ------------------------------------------------- |
| `err.response.status` | HTTP 状态码，如 401 / 409 / 422                   |
| `err.response.data`   | 响应体 JSON，本项目就是 `{ detail: ... }`         |
| `err.request`         | 请求本身，没有响应时只有它（用于区分网络层错误）  |
| `err.code`            | `ECONNABORTED` 表示超时，`ERR_NETWORK` 表示连不上 |

所以判断要写 `err.response?.status === 409`。**网络断了、后端没起、请求被 CORS 拦掉，这三种情况都没有 `response`**，得单独兜一句"网络异常"，否则会撞在 `undefined` 上。

本项目的响应拦截器只解包成功响应（`return response.data`），失败仍然抛原始 `AxiosError`，所以上面这套照常用。

## FastAPI 的 `detail` 有两种形态

这是表单处理里最容易绊人的地方：同样是错误响应，`detail` 可能是**字符串**，也可能是**数组**。

| 情况     | 谁产生的                                     | 形态                                        | 例子                |
| -------- | -------------------------------------------- | ------------------------------------------- | ------------------- |
| 业务错误 | 路由里主动 `raise HTTPException(409, "…")`   | 字符串                                      | `{"detail": "Username already exists"}` |
| 校验失败 | Pydantic 校验层自动返回 422                  | 数组，每项含 `type` / `loc` / `msg` / `input` | 见下方 JSON         |

用户名只填 2 个字符时的实测响应：

```json
{
    "detail": [
        {
            "type": "string_too_short",
            "loc": ["body", "username"],
            "msg": "String should have at least 3 characters",
            "input": "ab"
        }
    ]
}
```

`loc` 是错误位置路径：第一段 `body` 表示在请求体里，后面才是字段名；嵌套模型会更长（`["body", "author", "username"]`）。校验可能一次报多条，所以数组要遍历。

### 转成人话

后端的 `msg` 是英文、面向开发者的文案，不该直接甩给用户。两种思路：

1. 按状态码给固定文案：401 → "用户名或密码不对"，409 → "用户名或邮箱已被占用"。最省事，但分不出 409 的具体原因
2. 解析 `detail` 数组，按字段映射中文标签，更通用：

```js
// 后端 409 的三条原文，见 backend/app/routers/auth.py
const CONFLICT_MESSAGES = {
    'Username already exists': '用户名已被占用',
    'Email already exists': '邮箱已被占用',
    'Username or email already exists': '用户名或邮箱已被占用',
}

const FIELD_LABELS = {
    username: '用户名',
    nickname: '昵称',
    password: '密码',
    email: '邮箱',
}

const toMessage = (err) => {
    if (!err.response) return '网络异常，请稍后再试'
    const detail = err.response.data?.detail
    if (typeof detail === 'string')
        return CONFLICT_MESSAGES[detail] ?? '请求冲突，请检查填写内容'
    if (Array.isArray(detail))
        return detail
            .map((item) => {
                const field = item.loc.at(-1)
                return `${FIELD_LABELS[field] ?? field}：${item.msg}`
            })
            .join('\n')
    return `请求失败（${err.response.status}）`
}
```

字段限制（用户名 3~30 且只允许 `a-z A-Z 0-9 - _`、密码 6~128、昵称 ≤30）见 [planning.md](../planning.md) 的 3.1。前端可以就地校验一遍，但那只是省一次往返，**准的永远是后端校验**。

## 和登录态相关的两件事

- 登录成功返回的是 `{ token }`，**没有用户信息**。要显示头像得再请求 `GET /users/me`，这就是 store 的 login 里接着调 `fetchMe` 的原因
- 注册成功返回 UserMe，但**不会自动登录**（响应里没有 token）。0.0.4 的流程是"注册 → 自己去登录"，所以注册成功跳 `/login` 比跳首页更合理

密码输入框记得 `type="password"`，`autocomplete` 分别用 `current-password`（登录）和 `new-password`（注册），否则密码管理器会存错。
