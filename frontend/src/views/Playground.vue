<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { TextInput, Button, Link } from '@/components/common'
import request from '@/utils/request'
import { useRequest } from 'vue-request'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')

// 调试页：还没做界面的功能先放这儿试。退出登录走 store（下面那个表单是直接打接口，不走 store）
const auth = useAuthStore()
const { user } = storeToRefs(auth)

const { data, loading, error } = useRequest((message) => {
  const url = message ? `/test/${message}` : '/test'
  return request.get(url)
})
</script>

<template>
  <div class="">
    <!-- 登录页和注册页是游客页，不在导航栏里，入口都收在这儿，省得手敲 url -->
    <nav class="entries">
      <Link url="/login">登录</Link>
      <Link url="/register">注册</Link>
      <Link url="/test">api 测试</Link>
    </nav>
    <h2>登录态（走 store）</h2>
    <p>当前用户：{{ user ? user.nickname : '（未登录）' }}</p>
    <Button @click="auth.logout()">退出登录</Button>
    <h2>登录</h2>
    <form
      @submit.prevent="
        login({
          username,
          password,
        })
      "
    >
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
    <p>获取测试信息</p>
    <div>
      <p v-if="loading">加载中...</p>
      <p v-else-if="error">{{ error.message }}</p>
      <p v-else>{{ data }}</p>
    </div>
  </div>
</template>

<style scoped>
.entries {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
}
</style>
