<script setup>
import HeaderComponent from '@/Components/HeaderComponent.vue';
import TaskComponent from '@/Components/TaskComponent.vue';
import { useRouter } from 'vue-router'
import { useAuth } from '../Api/useAuth.js'
import { ref, onMounted, computed } from 'vue'
import { getAllTasks } from '../Api/tasksData.js'

const router = useRouter()
const auth = useAuth()
const user = ref(null)

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedDifficulty = ref('all')

const tasks = ref([])
const categories = ref([])

onMounted(() => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) 
    {
        router.push('/login')
        return
    }
    user.value = currentUser
    tasks.value = getAllTasks()
    const uniqueCategories = [...new Set(tasks.value.map(task => task.categoryKey))]
    categories.value = uniqueCategories
})

const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
        const matchesSearch = searchQuery.value === '' || task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = selectedCategory.value === 'all' || task.categoryKey === selectedCategory.value
        const matchesDifficulty = selectedDifficulty.value === 'all' || task.difficulty === selectedDifficulty.value
        return matchesSearch && matchesCategory && matchesDifficulty
    })
})

const groupedTasks = computed(() => {
    const groups = {}
    filteredTasks.value.forEach(task => {
        if (!groups[task.category]) {
            groups[task.category] = []
        }
        groups[task.category].push(task)
    })
    return groups
})

const resetFilters = () => {
    selectedCategory.value = 'all'
    selectedDifficulty.value = 'all'
    searchQuery.value = ''
}
</script>

<template>
    <div class="tasks-container">
        <HeaderComponent />
        <main class="tasks-main">
            <div class="container">
                <h1 class="page-title">Задачи</h1>
                <div class="tasks-wrapper">
                    <div class="tasks-controls">
                        <div class="controls-row">
                            <div class="search-area">
                                <input 
                                    type="text" 
                                    id="search"
                                    name="search"
                                    placeholder="Поиск задач..."
                                    class="search-input"
                                    v-model="searchQuery"/>
                            </div>
                            <div class="controls-group">
                                <div class="filter-group">
                                    <span class="filter-label">Категория:</span>
                                    <select class="filter-select" v-model="selectedCategory">
                                        <option value="all">Все категории</option>
                                        <option v-for="category in categories" :key="category" :value="category">
                                            {{ category }}
                                        </option>
                                    </select>
                                </div>
                                <div class="filter-group">
                                    <span class="filter-label">Сложность:</span>
                                    <select class="filter-select" v-model="selectedDifficulty">
                                        <option value="all">Все</option>
                                        <option value="easy">Лёгко</option>
                                        <option value="medium">Средне</option>
                                        <option value="hard">Сложно</option>
                                    </select>
                                </div>
                                <button class="reset-button" @click="resetFilters">Сбросить</button>
                            </div>
                        </div>
                    </div>
                    <div class="tasks-stats">
                        <div class="stats-info">
                            Найдено задач: <span class="stats-count">{{ filteredTasks.length }}</span>
                            <span v-if="selectedCategory !== 'all'" class="stats-filter">
                                Категория: {{ selectedCategory }}
                            </span>
                            <span v-if="selectedDifficulty !== 'all'" class="stats-filter">
                                Сложность: 
                                <span v-if="selectedDifficulty === 'easy'">Лёгко</span>
                                <span v-else-if="selectedDifficulty === 'medium'">Средне</span>
                                <span v-else-if="selectedDifficulty === 'hard'">Сложно</span>
                            </span>
                        </div>
                    </div>
                    <div class="tasks-list" v-if="filteredTasks.length > 0">
                        <div v-for="(categoryTasks, category) in groupedTasks" :key="category" class="tasks-category">
                            <div class="tasks-grid">
                                <TaskComponent 
                                    v-for="task in categoryTasks"
                                    :key="task.id"
                                    :task="task"/>
                            </div>
                        </div>
                    </div>
                    <div class="no-tasks" v-else>
                        <div class="no-tasks-content">
                            <h3>Задачи не найдены</h3>
                            <p>Попробуйте изменить параметры поиска или фильтры</p>
                            <button class="reset-all-button" @click="resetFilters">Показать все задачи</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped src="../style.css"></style>