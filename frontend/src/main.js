import '@/assets/styles/base.css'
import '@/assets/styles/markdown.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

import App from './App.vue'

// 登录态的启动恢复放在路由守卫里（见 router/index.js）：守卫会 await 它，
// 所以首屏渲染前 user 已经就位，不会先闪一下「注册 | 登录」
createApp(App).use(createPinia()).use(router).mount('#app')
