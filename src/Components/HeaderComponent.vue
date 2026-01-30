<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../Api/useAuth.js'
import { ref, onMounted, watch } from 'vue'

const router = useRouter()
const auth = useAuth()

const isAuthenticated = ref(false)
const currentUser = ref(null)

const updateAuthStatus = () => {
    isAuthenticated.value = auth.isAuth()
    currentUser.value = auth.getCurrentUser()
}

watch(() => auth.token, updateAuthStatus)

onMounted(() => {
    updateAuthStatus()
})

const navLinks = [
    { name: 'Задачи', path: '/tasks' },
    { name: 'Профиль', path: '/profile' },
]
const isActive = (path) => {
    return router.currentRoute.value.path === path
}

const handleLogout = (event) => {
    event.preventDefault()
    auth.removeToken()
    isAuthenticated.value = false
    currentUser.value = null
    router.push('/')
}

const handleTasksClick = (event) => {
    if (!isAuthenticated.value) 
    {
        event.preventDefault()
        router.push('/login')
    }
}

const handleProfileClick = (event) => {
    if (!isAuthenticated.value) 
    {
        event.preventDefault()
        router.push('/login')
    }
}
</script>

<template>
    <header>
        <div class="container">
            <div class="header-inner">
                <RouterLink :to="{ name: 'home' }" class="logo">
                    <div class="logo-content">
                        <div class="logo-img-wrapper">
                            <img src="../Images/Logo.png" alt="logo" class="logo-img">
                        </div>
                        <span class="logo-text">INTERACTIVEJS</span>
                    </div>
                </RouterLink>
                <nav class="nav">
                    <ul class="nav-list">
                        <li v-if="isAuthenticated" class="nav-item">
                            <RouterLink to="/tasks" :class="['nav-link', { 'active': isActive('/tasks') }]" @click="handleTasksClick">
                                Задачи
                            </RouterLink>
                        </li>
                        <li v-if="isAuthenticated" class="nav-item">
                            <RouterLink to="/profile" :class="['nav-link', { 'active': isActive('/profile') }]" @click="handleProfileClick">
                                Профиль
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink v-if="!isAuthenticated" to="/login" class="nav-link login-link">
                                Войти
                            </RouterLink>
                            <a v-else href="#" @click.prevent="handleLogout" class="nav-link logout-link">
                                Выйти
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
</template>

<style scoped src="../style.css"></style>