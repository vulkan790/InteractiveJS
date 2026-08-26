<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue';
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const auth = useAuth()

const handleStartTraining = (event: MouseEvent): void => {
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

<style scoped src="../assets/style.css"></style>