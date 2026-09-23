import { ref } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { login as loginApi, logout as logoutApi, getMe } from "@/api/auth";
import router from "@/router";


export const useAuthStore = defineStore('auth', () => {
    const token = useLocalStorage('token', '')
    const user = ref(null)

    const login = async (username, password) => {
        const response = await loginApi({ username, password })
        token.value = response.data.token
        await fetchMe()
        router.push('/')
    }

    const fetchMe = async () => {
        const response = await getMe()
        user.value = response.data
    }

    const logout = async () => {
        await logoutApi()
        token.value = ''
        user.value = null
        router.push('/login')
    }

    return { token, user, login, fetchMe, logout }
})