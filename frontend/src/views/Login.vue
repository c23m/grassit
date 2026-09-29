<script setup>
import { useAuthStore } from '@/stores/auth'
import { Button, Link, TextInput } from '@/components/common'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const error = ref('') // 错误提示位，等 onSubmit 接上 store 后由它赋值

const { login } = useAuthStore()

const onSubmit = async () => {}
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

            <Button type="submit"> 提交 </Button>
            <p v-if="error" class="error" role="alert">{{ error }}</p>
        </form>

        <hr />

        <!-- 其他登录方式还没实现：用不带 href 的 <a>
             （HTML 里的"占位链接"，样式像链接，但不可点击、也不进 Tab 顺序） -->
        <p class="other-methods">
            <span class="methods">
                <a>邮箱</a>
                <span class="divider" aria-hidden="true">|</span>
                <a>GitHub</a>
            </span>
            <Link url="/register">注册</Link>
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

form button {
    margin-top: 0.5rem;
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
    color: var(--color-danger);
}
</style>
