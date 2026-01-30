<script setup>
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="task-card">
        <div class="task-header">
            <span class="task-difficulty" :class="task.difficulty">{{ task.difficultyLabel }}</span>
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

<style scoped src="../style.css"></style>