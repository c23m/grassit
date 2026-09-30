<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'
import { Button, Link, TextInput } from '@/components/common'

const router = useRouter()
const loading = ref(false)
// 成功后到跳转之间那段空窗，按钮要一直禁用，免得又点一次
const succeeded = ref(false)
// 留出看提示的时间再跳转，单位毫秒
const REDIRECT_DELAY = 3000
let redirectTimer = null
onBeforeUnmount(() => clearTimeout(redirectTimer))

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
// 按钮上方那一行：错误和成功共用同一个位置，靠 tone 决定颜色
const notice = reactive({ text: '', tone: 'error' })
const showNotice = (text, tone = 'error') => Object.assign(notice, { text, tone })
const clearNotice = () => (notice.text = '')

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
        showNotice('网络异常，请稍后再试')
        return
    }

    const detail = err.response.data?.detail
    if (typeof detail === 'string') {
        const messages = CONFLICT_MESSAGES[detail]
        if (messages) Object.assign(error, messages)
        else showNotice('注册失败，请稍后再试')
        return
    }
    if (Array.isArray(detail)) {
        detail.forEach((item) => {
            const field = item.loc?.at(-1)
            if (!(field in error)) {
                showNotice('提交的内容有误，请检查后重试')
                return
            }
            const describe = VALIDATION_MESSAGES[item.type]
            error[field] = describe
                ? `${FIELD_LABELS[field]}${describe(item)}`
                : `${FIELD_LABELS[field]}填写有误`
        })
        return
    }
    showNotice('注册失败，请稍后再试')
}

// 镜像 backend/app/schemas/auth.py 里 RegisterRequest 的限制。准的永远是后端校验，
// 这里只是让用户不必为了一句"太短了"往返一次；邮箱那条还刻意放宽，
// 宁可放过可疑的（后端会拦），也别把能用的邮箱挡在门外
const RULES = {
    username: (value) => {
        if (!value) return '用户名不能为空'
        if (value.length < 3) return '用户名太短，至少 3 个字符'
        if (value.length > 30) return '用户名太长，最多 30 个字符'
        if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value))
            return '用户名只能用字母、数字、- 和 _，且以字母或数字开头'
        return ''
    },
    nickname: (value) => {
        if (!value) return '昵称不能为空'
        if (value.length > 30) return '昵称太长，最多 30 个字符'
        return ''
    },
    password: (value) => {
        if (!value) return '密码不能为空'
        if (value.length < 6) return '密码太短，至少 6 个字符'
        if (value.length > 128) return '密码太长，最多 128 个字符'
        return ''
    },
    email: (value) => {
        if (!value) return ''
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? '' : '邮箱格式不正确'
    },
}

const validate = (field) => {
    error[field] = RULES[field]?.(data[field]) ?? ''
}

// 失焦时才查这个字段：边输边报"太短了"太吵。Enter 走的是表单提交，会一次查完所有字段
const onBlur = (field) => {
    validate(field)
    // 内容动过，上一次那种跟字段无关的提示（网络异常之类）也过时了；成功提示留着
    if (!succeeded.value) clearNotice()
}

// 还有字段级错误没清掉就一直禁用提交（后端给的错误也一样，改动那个字段就会被清掉）
const hasError = computed(() => Object.values(error).some(Boolean))

const onSubmit = async () => {
    // 一次把所有前端规则都跑一遍，缺哪个标哪个——发现一个就 return 的话，用户得来改好几轮
    for (const field of Object.keys(error)) validate(field)
    clearNotice()
    if (hasError.value) return

    loading.value = true
    try {
        // 邮箱可选：空字符串会被后端的 EmailStr 判成格式错误，所以空值发 null
        await register({ ...data, email: data.email || null })
        succeeded.value = true
        showNotice('注册成功，正在跳转登录页…', 'success')
        redirectTimer = setTimeout(
            () => router.push({ name: 'login' }),
            REDIRECT_DELAY,
        )
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
                    @blur="onBlur('username')"
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
                    @blur="onBlur('nickname')"
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
                    @blur="onBlur('password')"
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
                    @blur="onBlur('email')"
                />
            </fieldset>

            <p class="notice" :class="notice.tone" role="alert">
                {{ notice.text }}
            </p>
            <Button type="submit" :disabled="loading || hasError || succeeded">
                提交
            </Button>
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

/* 按钮上方那一行：错误和成功共用同一处，预留一行，出错时按钮不会往下跳 */
form > .notice {
    min-height: 1lh;
    text-align: left;
    color: var(--color-danger);
}

form > .notice.success {
    color: var(--color-success);
}
</style>
