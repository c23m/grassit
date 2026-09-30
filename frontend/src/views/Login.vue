<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button, Link, TextInput } from '@/components/common'

const router = useRouter()
const { login } = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
// 成功后到跳转之间那段空窗，按钮要一直禁用，免得又点一次
const succeeded = ref(false)
// 留出看提示的时间再跳转，单位毫秒
const REDIRECT_DELAY = 1000
let redirectTimer = null
onBeforeUnmount(() => clearTimeout(redirectTimer))

// 按钮上方那一行：错误和成功共用同一个位置，靠 tone 决定颜色
const notice = reactive({ text: '', tone: 'error' })
const showNotice = (text, tone = 'error') =>
    Object.assign(notice, { text, tone })

const onSubmit = async () => {
    notice.text = ''

    if (!username.value) {
        showNotice('请输入用户名')
        return
    }
    if (!password.value) {
        showNotice('请输入密码')
        return
    }

    loading.value = true
    try {
        await login(username.value, password.value)
        succeeded.value = true
        showNotice('登录成功', 'success')
        redirectTimer = setTimeout(() => router.push('/'), REDIRECT_DELAY)
    } catch (err) {
        showNotice(
            err.response?.status === 401
                ? '用户名或密码错误'
                : '登录失败，请稍后再试',
        )
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <section class="login">
        <h2>登录</h2>

        <form @submit.prevent="onSubmit">
            <fieldset>
                <label for="username">用户名</label>
                <TextInput
                    id="username"
                    v-model="username"
                    autocomplete="username"
                    :disabled="succeeded"
                />
            </fieldset>

            <fieldset>
                <label for="password">密码</label>
                <TextInput
                    id="password"
                    type="password"
                    v-model="password"
                    autocomplete="current-password"
                    :disabled="succeeded"
                />
            </fieldset>
            <p class="notice" :class="notice.tone" role="alert">
                {{ notice.text }}
            </p>
            <Button type="submit" :disabled="loading || succeeded">
                提交
            </Button>
        </form>

        <hr />

        <!-- 其他登录方式还没实现：用不带 href 的 <a>
             （HTML 里的"占位链接"，样式像链接，但不可点击、也不进 Tab 顺序） -->
        <p class="other-methods">
            <span class="methods">
                <a>邮箱登录</a>
                <span class="divider" aria-hidden="true">|</span>
                <a>GitHub 登录</a>
            </span>
            <Link url="/register">去注册</Link>
        </p>
    </section>
</template>

<style scoped>
.login {
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

hr {
    margin: 1.5rem 0;
}

/* 用 flex + gap 控制间距：等价于给每个元素加左右 margin，
   但不会把 HTML 里的换行空格也算进去（flex 会忽略纯空白文本节点） */
.other-methods {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0 0.5rem;
}

/* 占位登录方式那一组：贴着左边，组内保持等间距 */
.methods {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

/* 按钮上方那一行：错误和成功共用同一处，靠 tone 决定颜色。
   预留一行，出错时不跳动；用 min-height 而不是 height（换行时盒子要能长高），
   单位 lh 就是"一行的高度"，等价写法是 1.5em（本仓库行高 1.5） */
.notice {
    min-height: 1lh;
    text-align: center;
    color: var(--color-danger);
}

.notice.success {
    color: var(--color-success);
}
</style>
