<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'
import { Button, Link, TextInput } from '@/components/common'

const router = useRouter()
const loading = ref(false)

const data = reactive({
    username: '',
    nickname: '',
    password: '',
    email: '',
})

// 按字段存错误：422 会一次报多个字段，分开放才能落在各自的输入框旁边
const error = reactive({
    username: '',
    nickname: '',
    password: '',
    email: '',
})
// 落不到具体字段的错误（网络异常、认不出来的 409）放这里
const formError = ref('')

const FIELD_LABELS = {
    username: '用户名',
    nickname: '昵称',
    password: '密码',
    email: '邮箱',
}

// 409 的原文来自 backend/app/routers/auth.py
const CONFLICT_MESSAGES = {
    'Username already exists': { username: '用户名已被占用' },
    'Email already exists': { email: '邮箱已被占用' },
    'Username or email already exists': {
        username: '用户名已被占用',
        email: '邮箱已被占用',
    },
}

// 422 的 type 是 Pydantic 给的；认不出来就退回一句笼统的，不把英文原文甩给用户
const VALIDATION_MESSAGES = {
    string_too_short: (item) => `太短，至少 ${item.ctx?.min_length} 个字符`,
    string_too_long: (item) => `太长，最多 ${item.ctx?.max_length} 个字符`,
    string_pattern_mismatch: () =>
        '只能用字母、数字、- 和 _，且以字母或数字开头',
    value_error: () => '格式不正确',
}

const applyError = (err) => {
    // 网络断了、后端没起、被 CORS 拦掉这三种情况都没有 response
    if (!err.response) {
        formError.value = '网络异常，请稍后再试'
        return
    }

    const detail = err.response.data?.detail
    if (typeof detail === 'string') {
        const messages = CONFLICT_MESSAGES[detail]
        if (messages) Object.assign(error, messages)
        else formError.value = '注册失败，请稍后再试'
        return
    }
    if (Array.isArray(detail)) {
        detail.forEach((item) => {
            const field = item.loc?.at(-1)
            if (!(field in error)) {
                formError.value = '提交的内容有误，请检查后重试'
                return
            }
            const describe = VALIDATION_MESSAGES[item.type]
            error[field] = describe
                ? `${FIELD_LABELS[field]}${describe(item)}`
                : `${FIELD_LABELS[field]}填写有误`
        })
        return
    }
    formError.value = '注册失败，请稍后再试'
}

const onSubmit = async () => {
    for (const field in error) error[field] = ''
    formError.value = ''

    // 三个必填项一次查完，缺哪个标哪个——发现一个就 return 的话，用户得来回改好几轮
    if (!data.username) error.username = '用户名不能为空'
    if (!data.nickname) error.nickname = '昵称不能为空'
    if (!data.password) error.password = '密码不能为空'
    if (error.username || error.nickname || error.password) return

    loading.value = true
    try {
        // 邮箱可选：空字符串会被后端的 EmailStr 判成格式错误，所以空值发 null
        await register({ ...data, email: data.email || null })
        router.push({ name: 'login' })
    } catch (err) {
        applyError(err)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <section class="register">
        <h2>注册</h2>

        <form @submit.prevent="onSubmit">
            <fieldset>
                <label for="username">
                    <span class="field">
                        用户名<span class="required">*</span>
                    </span>
                    <span v-if="error.username" class="error">
                        {{ error.username }}
                    </span>
                </label>
                <TextInput
                    id="username"
                    v-model="data.username"
                    autocomplete="username"
                />
            </fieldset>

            <fieldset>
                <label for="nickname">
                    <span class="field">
                        昵称<span class="required">*</span>
                    </span>
                    <span v-if="error.nickname" class="error">
                        {{ error.nickname }}
                    </span>
                </label>
                <TextInput
                    id="nickname"
                    v-model="data.nickname"
                    autocomplete="nickname"
                />
            </fieldset>

            <fieldset>
                <label for="password">
                    <span class="field">
                        密码<span class="required">*</span>
                    </span>
                    <span v-if="error.password" class="error">
                        {{ error.password }}
                    </span>
                </label>
                <TextInput
                    id="password"
                    type="password"
                    v-model="data.password"
                    autocomplete="new-password"
                />
            </fieldset>

            <fieldset>
                <label for="email">
                    <span class="field">邮箱</span>
                    <span v-if="error.email" class="error">
                        {{ error.email }}
                    </span>
                </label>
                <TextInput
                    id="email"
                    v-model="data.email"
                    autocomplete="email"
                />
            </fieldset>

            <p class="error" role="alert">{{ formError }}</p>
            <Button type="submit" :disabled="loading"> 提交 </Button>
        </form>

        <hr />
        <Link url="/login">登录</Link>
    </section>
</template>

<style scoped>
.register {
    width: 360px;
    max-width: 100%;
    margin: 2rem auto;
    padding: 1.5rem;
    background-color: var(--color-bg-secondary);
    border-radius: 0.75rem;
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

fieldset {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: left;
}

/* 输入框撑满字段，左边缘和标签文字对齐（input 是 TextInput 的根元素，带父组件作用域） */
fieldset input {
    width: 100%;
}

label {
    display: flex;
}

.field {
    margin-right: auto;
}

hr {
    margin: 1.5rem 0;
}

.required {
    color: var(--color-danger);
}

.error {
    color: var(--color-danger);
}

/* 字段级错误：贴右，文案长了换行也还是贴边 */
label .error {
    text-align: right;
}

/* 表单级错误：预留一行，出错时上面那个按钮不会往下跳 */
form > .error {
    min-height: 1lh;
    text-align: left;
}
</style>
