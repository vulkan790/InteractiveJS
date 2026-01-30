<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../Api/useAuth.js'
import { fakeAuthorization } from '../Api/fakeAPIBackend.js'

const router = useRouter()
const auth = useAuth()

const form = reactive({
    email: '',
    password: ''
})

const error = ref('')
const isLoading = ref(false)
const success = ref(false)

const handleSubmit = async () => {
    error.value = ''
    success.value = false 
    isLoading.value = true

    try 
    {
        if (!form.email || !form.password)
            throw new Error('Введите email и пароль')

        const result = await fakeAuthorization(form.email, form.password)
        if (!result.success)
            throw new Error(result.message)
        
        auth.setToken(result.token)
        success.value = true
        setTimeout(() => { 
            router.push('/profile') 
        }, 1000)
        
    } 
    catch (e) 
    {
        error.value = e.message
    } 
    finally 
    {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="registration-wrapper">
        <div class="registration-card">
            <div class="logo-section">
                <RouterLink to="/" class="logo-reg">
                    <div class="logo-content">
                        <div class="logo-img-wrapper">
                            <img src="../Images/Logo.png" alt="logo" class="logo-img">
                        </div>
                        <span class="logo-text">INTERACTIVEJS</span>
                    </div>
                </RouterLink>
            </div>
            <h1 class="registration-title">Войти в систему</h1>
            <form class="registration-form" @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="email" class="form-label">Электронная почта</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        v-model="form.email"
                        class="form-input"
                        required
                        :disabled="isLoading"/>
                </div>
                <div class="form-group">
                    <label for="password" class="form-label">Пароль</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        v-model="form.password"
                        class="form-input"
                        minlength="6"
                        required
                        :disabled="isLoading"/>
                </div>
                <button type="submit" class="submit-button" :disabled="isLoading">
                    {{ isLoading ? 'Авторизация...' : 'Авторизоваться' }}
                </button>
                <div v-if="error" class="error-message">
                    <strong>Ошибка:</strong> {{ error }}
                </div>
                <div v-if="success" class="success-message">
                    Авторизация успешна! Перенаправляем...
                </div>
            </form>
            <div class="login-link-reg">
                <RouterLink to="/register">Нет аккаунта?</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped src="../style.css"></style>