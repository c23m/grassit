import { createRouter, createWebHistory } from 'vue-router'

import BaseLayout from '@/components/layouts/BaseLayout.vue'
import Home from '@/views/Home.vue'
import Article from '@/views/Article.vue'
import ApiTest from '@/views/ApiTest.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Playground from '@/views/Playground.vue'
import Register from '@/views/Register.vue'

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
                redirect: (to) =>
                    `/${to.params.lang ? to.params.lang + '/' : ''}home`,
            },
            {
                path: 'register',
                name: 'register',
                component: Register,
            },
            {
                path: 'login',
                name: 'login',
                component: Login,
            },
            {
                path: 'article/:identifier?',
                name: 'article',
                component: Article,
                props: true,
            },
            {
                path: 'test',
                component: ApiTest,
            },
            {
                path: 'playground',
                name: 'playground',
                component: Playground,
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

export default router
