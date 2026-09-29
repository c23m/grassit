<script setup>
import { useAuthStore } from '@/stores/auth'
import { Button, Link, TextInput } from '@/components/common'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const { login } = useAuthStore()

const onSubmit = async () => {
    error.value = ''

    if (!username.value) {
        error.value = '请输入用户名'
        return
    }
    if (!password.value) {
        error.value = '请输入密码'
        return
    }

    loading.value = true
    try {
        // 成功后 store 内部会 router.push('/')
        await login(username.value, password.value)
    } catch (err) {
        error.value =
            err.response?.status === 401
                ? '用户名或密码错误'
                : '登录失败，请稍后再试'
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
                />
            </fieldset>

            <fieldset>
                <label for="password">密码</label>
                <TextInput
                    id="password"
                    type="password"
                    v-model="password"
                    autocomplete="current-password"
                />
            </fieldset>
            <p class="error" role="alert">{{ error }}</p>
            <Button type="submit" :disabled="loading"> 提交 </Button>
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

.error {
    margin-top: 0.5rem;
    /* 预留一行，出错时不跳动。用 min-height 而不是 height（换行时盒子要能长高），
       单位 lh 就是"一行的高度"，等价写法是 1.5em（本仓库行高 1.5） */
    min-height: 1lh;
    color: var(--color-danger);
    text-align: left;
}
</style>
