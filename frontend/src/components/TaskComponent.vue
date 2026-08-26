<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Difficult, Task } from '@/types/domain'

const props = withDefaults(
    defineProps<{ task: Task, isSolved?: boolean}>(),
    { isSolved: false }
)

const difficultyLabels: Record<Difficult, string> = {
    easy: "Лёгкая",
    medium: "Средняя",
    hard: "Сложная"
}

const difficultyLabel = computed<string>(() => difficultyLabels[props.task.difficulty])
</script>

<template>
    <div class="task-card">
        <div class="task-header">
            <span class="task-difficulty" :class="task.difficulty">{{ difficultyLabel }}</span>
            <span v-if="isSolved" class="solved-badge">Решено</span>
        </div>
        <div class="task-content">
            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-footer">
                <span class="task-category">{{ task.category }}</span>
                <RouterLink :to="{ name: 'task', params: { id: task.id } }"
                    class="solve-button" 
                    :class="{ 'solved': isSolved }">
                    {{ isSolved ? 'Решено ✓' : 'Решить →' }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped src="../assets/style.css"></style>