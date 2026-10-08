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

  // 启动时恢复登录态：没 token 或已经有 user 就直接返回；并发调用共享同一次请求
  let restoring = null

  const restore = () => {
    if (!token.value || user.value) return Promise.resolve()
    restoring ??= fetchMe()
      .catch(() => {
        // 401 已由 fetchMe 清掉登录态；网络错误保留 token，
        // 这里把标记清掉，下次调用还能再试
      })
      .finally(() => {
        restoring = null
      })
    return restoring
  }

  // 清空登录态但不跳转：跳转时机是调用方的事（logout / 拦截器 / 页面）
  const clearSession = () => {
    token.value = ''
    user.value = null
  }

  const logout = async () => {
    await logoutApi()
    clearSession()
    // 别一律丢到登录页：只有身处"游客进不去"的受限页才需要挪窝，挪去首页；
    // 公共页原地不动即可，页面会跟着 user 变回未登录的样子
    if (router.currentRoute.value.meta.requiresAuth) {
      router.push({ name: 'home' })
    }
  }

  return { token, user, login, fetchMe, restore, clearSession, logout }
})
