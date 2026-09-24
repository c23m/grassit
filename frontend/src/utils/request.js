import axios from 'axios'
import { useLocalStorage } from '@vueuse/core'
import router from '@/router'

const token = useLocalStorage('token', '')

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000, //10s 超时
})

request.interceptors.request.use((config) => {
    if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
})

request.interceptors.response.use(
    (response) => response.data,
    async (err) => {
        const originalRequest = err.config
        if (err.response?.status === 401) {
            if (
                originalRequest._retry ||
                originalRequest.url.includes('/auth/refresh')
            ) {
                token.value = ''
                router.push('/login')
            } else {
                const response = await request.post('/auth/refresh')
                token.value = response.token
                return request({
                    _retry: true,
                    ...originalRequest,
                })
            }
        }
        return Promise.reject(err)
    },
)

export default request
