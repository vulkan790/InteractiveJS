<script setup>
import HeaderComponent from '@/Components/HeaderComponent.vue';
import { useRouter } from 'vue-router'
import { useAuth } from '../Api/useAuth.js'
import { ref, onMounted, computed, watch } from 'vue'
import { getTasksStats, getProgressByCategory } from '../Api/taskStats.js'

const router = useRouter()
const auth = useAuth()
const user = ref(null)
const tasksStats = ref({
    total: 0,
    byCategory: {}
})

const topics = [
    { name: 'Основы JavaScript (переменные, типы данных, операторы)', key: 'Основы JS' },
    { name: 'Условные операторы и циклы', key: 'Условные операторы и циклы' },
    { name: 'Функции (объявление, вызов, стрелочные функции)', key: 'Функции' },
    { name: 'Массивы и методы массивов', key: 'Массивы и методы массивов' },
    { name: 'Объекты и ООП (классы, конструкторы, наследование)', key: 'Объекты и ООП' },
    { name: 'DOM-манипуляции (создание, изменение, удаление элементов)', key: 'DOM-манипуляции' },
    { name: 'Обработка событий', key: 'Обработка событий' },
    { name: 'Асинхронный JavaScript (setTimeout, Promise, async/await)', key: 'Асинхронный JavaScript' }
]

onMounted(() => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) 
    {
        router.push('/login')
        return
    }
    user.value = currentUser
    loadUserStats()
})

const loadUserStats = () => {
    if (!user.value?.id) 
        return
    
    const stats = getTasksStats(user.value.id)
    tasksStats.value = {
        total: stats.total,
        byCategory: { ...stats.byCategory }
    }
}

const getTasksText = (count) => {
    const num = count || 0
    const lastDigit = num % 10
    const lastTwoDigits = num % 100
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19)
        return 'задач'
    if (lastDigit === 1)
        return 'задача'
    if (lastDigit >= 2 && lastDigit <= 4)
        return 'задачи'
    return 'задач'
}

const formatDate = (dateString) => {
    if (!dateString)
        return 'Дата не указана'

    const date = new Date(dateString)

    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const completionPercentage = computed(() => {
    if (!user.value?.id) 
        return 0
    return getProgressByCategory(user.value.id)
})

watch(() => user.value, (newUser) => {
    if (newUser)
        loadUserStats()
})
</script>

<template>
    <div class="profile-container">
        <HeaderComponent />
        <main class="profile-main" v-if="user">
            <div class="container">
                <div class="profile-wrapper">
                    <section class="left-card">
                        <div class="profile-header">
                            <h1 class="username">{{ user.name }}</h1>
                        </div>
                        <div class="stats-summary">
                            <div class="stat-item">
                                <span class="stat-number">{{ tasksStats.total }}</span>
                                <span class="stat-label">{{ getTasksText(tasksStats.total) }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">{{ completionPercentage }}%</span>
                                <span class="stat-label">курса пройдено</span>
                            </div>
                        </div>
                        <div class="profile-details">
                            <div class="detail-item">
                                <span class="detail-label">Дата регистрации:</span>
                                <span class="detail-value">{{ formatDate(user.createdAt) }}</span>
                            </div>
                        </div>
                    </section>
                    <section class="right-card">
                        <div class="tasks-header">
                            <h2 class="tasks-title">Решено задач</h2>
                            <div class="tasks-total">{{ tasksStats.total }} {{ getTasksText(tasksStats.total) }}</div>
                        </div>
                        <div class="tasks-stats">
                            <div v-for="topic in topics" :key="topic.key" class="topic-item">
                                <div class="topic-info">
                                    <span class="topic-name">{{ topic.name }}</span>
                                    <span class="topic-count">
                                        {{ tasksStats.byCategory[topic.key] || 0 }} 
                                        {{ getTasksText(tasksStats.byCategory[topic.key] || 0) }}
                                    </span>
                                </div>
                                <div class="topic-progress">
                                    <div class="topic-progress-bar">
                                        <div class="topic-progress-fill" :style="{ width: Math.min((tasksStats.byCategory[topic.key] || 0) * 20, 100) + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
        <main class="profile-main" v-else>
            <div class="container">
                <div class="loading-message">
                    Загрузка профиля...
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped src="../style.css"></style>