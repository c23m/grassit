import { createRouter, createWebHistory } from 'vue-router'

import BaseLayout from '@/components/layouts/BaseLayout.vue'
import Home from '@/views/Home.vue'
import Article from '@/views/Article.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Register from '@/views/Register.vue'
import Test from '@/views/Test.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/:lang(zh|en)?/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/:lang(zh|en)?',
    component: BaseLayout,
    children: [
      {
        path: '',
        redirect: (to) => `/${to.params.lang ? to.params.lang + '/' : ''}home`,
      },
      // login / register 是游客页：已登录的人再访问要送回首页
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { guestOnly: true },
      },
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { guestOnly: true },
      },
      {
        path: 'article/:identifier?',
        name: 'article',
        component: Article,
        props: true,
      },
      // 用户主页：受限页，未登录会被守卫拦回 /login（页面本身还是空壳，0.2.x 填）
      {
        path: 'user/:username',
        name: 'user',
        component: Dashboard,
        meta: { requiresAuth: true },
      },
      {
        path: 'test',
        name: 'test',
        component: Test,
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 守卫里先恢复一次登录态：刷新后 store 里的 user 还是空的，
// 不先补上会把已登录的人误判成未登录。
// restore() 是幂等的——没 token 或已经有 user 时立刻返回，所以每次导航 await 它没有额外开销
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.restore()

  if (to.meta.requiresAuth && !auth.user) return { name: 'login' }
  if (to.meta.guestOnly && auth.user) return { name: 'home' }
})

export default router
