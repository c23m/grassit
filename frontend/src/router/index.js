import { createRouter, createWebHistory } from 'vue-router'

import BaseLayout from '@/components/layouts/BaseLayout.vue'
import HomeView from '@/views/HomeView.vue'
import ArticleView from '@/views/ArticleView.vue'
import TestView from '@/views/TestView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
    {
        path: '/:lang?/home',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/:lang?',
        component: BaseLayout,
        children: [
            {
                path: "",
                redirect: to =>
                    `/${to.params.lang ? to.params.lang + '/' : ''}home`,
            },
            {
                path: 'article/:identifier',
                name: 'article',
                component: ArticleView,
                props: true
            },
        ]
    },
    {
        path: '/test',
        component: TestView,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router