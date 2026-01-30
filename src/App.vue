<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
    <div class="wrapper">
        <RouterView />
    </div>
</template>

<style>
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    background: #1E1E1E !important;
}

#app {
    background: #1E1E1E;
    min-height: 100vh;
    width: 100%;
}
</style>
<style scoped src="./style.css"></style>