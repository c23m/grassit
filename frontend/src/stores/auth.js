import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { login as loginApi, logout as logoutApi, getMe } from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    const token = useLocalStorage('token', '')
    const user = ref(null)

    // 只管写状态，不负责跳转：跳转时机与提示语是页面的事（见 views/Login.vue）
    const login = async (username, password) => {
        const response = await loginApi({ username, password })
        token.value = response.token
        user.value = response.user
    }

    // 同一时刻只让一个 /users/me 在飞：后来的调用复用同一个 Promise，
    // 落定后清掉引用，否则之后每次都会拿到那份旧结果、永远不再请求
    let pending = null

    const fetchMe = () => {
        pending ??= getMe()
            .then((response) => {
                // 请求期间如果登出了（token 已被清空），这次响应就作废
                if (token.value) user.value = response
            })
            .catch((err) => {
                // 只有 401 说明这份 token 不可用，清掉以免留下"假登录"；
                // 网络抖动之类的错误保留 token，下次还能重试
                if (err.response?.status === 401) {
                    token.value = ''
                    user.value = null
                }
                throw err
            })
            .finally(() => {
                pending = null
            })
        return pending
    }

    const logout = async () => {
        await logoutApi()
        token.value = ''
        user.value = null
        router.push('/login')
    }

    return { token, user, login, fetchMe, logout }
})
