import AuthPageView from '@/views/AuthPageView.vue'
import HomePageView from '@/views/HomePageView.vue'
import ProfilePageView from '@/views/ProfilePageView.vue'
import RegisterPageView from '@/views/RegisterPageView.vue'
import TasksPageView from '@/views/TasksPageView.vue'
import TaskPageView from '@/views/TaskPageView.vue'
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