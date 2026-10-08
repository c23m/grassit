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

const isRefreshRequest = (config) => config.url?.includes('/auth/refresh')

const authHeader = () => (token.value ? `Bearer ${token.value}` : undefined)

// 同一时刻只让一个刷新在飞：并发的 401 都等同一个 Promise。
// 不合并的话每个 401 都会换一次 token，先到的会被后到的覆盖
let refreshing = null

const refreshToken = () => {
  refreshing ??= request
    .post('/auth/refresh')
    .then((response) => {
      token.value = response.token
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

// refresh token 也失效了：清空登录态并回登录页。
// 只清 token 不够——store 里的 user 还在，守卫会把这次跳转当成"已登录"又送回首页
let redirecting = false

const failSession = async () => {
  token.value = ''
  // 动态 import：request → store → api → request 是循环依赖，只在函数体里解析
  const { useAuthStore } = await import('@/stores/auth')
  useAuthStore().clearSession()
  if (redirecting) return
  redirecting = true
  try {
    await router.push({ name: 'login' })
  } finally {
    redirecting = false
  }
}

request.interceptors.response.use(
  (response) => response.data,
  async (err) => {
    const config = err.config
    // 刷新接口自己返回的 401 交给 refreshToken() 的调用方处理；
    // 在这里再刷一次就是递归
    if (err.response?.status !== 401 || !config || isRefreshRequest(config)) {
      return Promise.reject(err)
    }
    const sentAuth = config.headers?.Authorization
    // 没带 token 的 401 不是"过期"——典型的是登录密码错，刷新救不了，也不该动登录态
    if (!sentAuth) {
      return Promise.reject(err)
    }
    // 重放过的请求又 401：说明刷新也救不回来
    if (config._retry) {
      await failSession()
      return Promise.reject(err)
    }
    // 这次失败用的是旧 token，而别人已经刷过了（401 落到这里时刷新已经结束）：
    // 直接用新 token 重放，不必再刷一次
    if (sentAuth !== authHeader()) {
      return request({ ...config, _retry: true })
    }
    try {
      await refreshToken()
    } catch {
      await failSession()
      return Promise.reject(err)
    }
    // 重放原请求：请求拦截器会把陈旧的 Authorization 换成刚拿到的 token
    return request({ ...config, _retry: true })
  },
)

export default request
