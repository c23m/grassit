<script setup>
import { login } from '@/api/auth';
import { Button, TextInput } from '@/components/common';
import { ref } from 'vue';


const username = ref('')
const password = ref('')

</script>

<template>
    <div class="">

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
            <Button> 提交 </Button>
        </form>
    </div>
</template>

<style scoped></style>