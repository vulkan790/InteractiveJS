import AuthPageView from '@/Pages/AuthPageView.vue'
import HomePageView from '@/Pages/HomePageView.vue'
import ProfilePageView from '@/Pages/ProfilePageView.vue'
import RegisterPageView from '@/Pages/RegisterPageView.vue'
import TasksPageView from '@/Pages/TasksPageView.vue'
import TaskPageView from '@/Pages/TaskPageView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePageView
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfilePageView
    },
    {
        path: '/login',
        name: 'login',
        component: AuthPageView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterPageView
    },
    {
        path: '/tasks',
        redirect: '/tasks/all',
        children: [
            {
                path: 'all',
                name: 'tasks-list',
                component: TasksPageView,
            },
            {
                path: ':id',
                name: 'task',
                component: TaskPageView,
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router