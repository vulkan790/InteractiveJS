<script setup>
import HeaderComponent from '@/Components/HeaderComponent.vue';
import { useRouter } from 'vue-router'
import { useAuth } from '../Api/useAuth.js'

const router = useRouter()
const auth = useAuth()

const handleStartTraining = (event) => {
    event.preventDefault()
    if (auth.isAuth())
        router.push('/tasks')
    else
        router.push('/login')
}
</script>

<template>
    <div class="home-container">
        <HeaderComponent />
        <main class="main-home">
            <div class="container">
                <h1 class="main-text">ПРАКТИКУЙ СВОИ НАВЫКИ</h1>
                <h1 class="main-text">JAVASCRIPT</h1>
                <p class="text-home">Интерактивный тренажёр для разработчиков</p>
                <a href="#" @click.prevent="handleStartTraining" class="cta-button">
                    Начать тренировку
                </a>
            </div>
        </main>
    </div>
</template>

<style scoped src="../style.css"></style>