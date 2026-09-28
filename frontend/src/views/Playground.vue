<script setup>
import { TextInput, Button, Link } from '@/components/common';
import request from '@/utils/request'
import { useRequest } from 'vue-request';
import { login } from '@/api/auth';
import { ref } from 'vue';


const username = ref('')
const password = ref('')

const { data, loading, error } = useRequest(
    (message) => {
        const url = message ? `/test/${message}` : '/test'
        return request.get(url)
    }
)

</script>

<template>

    <div class="">
        <h2>登录</h2>
        <form @submit.prevent="login({
            username, password
        })">
            <div>
                用户名
                <TextInput v-model="username" />
            </div>
            <div>
                密码
                <TextInput v-model="password" />
            </div>
            <Button type="submit"> 提交 </Button>

        </form>
        <p>
            获取测试信息
        </p>
        <div>
            <p v-if="loading"> 加载中... </p>
            <p v-else-if="error"> {{ error.message }} </p>
            <p v-else> {{ data }} </p>
        </div>
    </div>
</template>

<style scoped></style>