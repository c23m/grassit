<script setup>
import { useAuthStore } from '@/stores/auth'
import { Button, TextInput } from '@/components/common'
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const { token, user, login } = useAuthStore()

const onSubmit = async () => {}
</script>

<template>
    <div class="form">
        <h2>登录</h2>
        <form @submit.prevent="onSubmit">
            <fieldset>
                <label>
                    <div>用户名</div>
                    <TextInput v-model="username" />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    <div>密码</div>
                    <TextInput type="password" v-model="password" />
                </label>
            </fieldset>

            <Button type="submit"> 提交 </Button>
            <p v-if="error" class="error">
                {{ error }}
            </p>
        </form>
    </div>
</template>

<style scoped>
.form {
    padding-top: 1rem;
    text-align: center;
}
form {
    display: inline-block;
}
label {
    display: flex;
    width: 300px;
    background-color: var(--color-bg-secondary);
    border-radius: 0.5rem;
}

.error {
    color: red;
}
</style>
