<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../Api/useAuth.js'
import { fakeRegistration } from '../Api/fakeAPIBackend.js'

const router = useRouter()
const auth = useAuth()

const form = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const error = ref('')
const success = ref(false)
const isLoading = ref(false)

const handleSubmit = async () => {
    error.value = ''
    success.value = false
    isLoading.value = true

    try 
    {
        if (!form.name || !form.email || !form.password)
            throw new Error('Все поля обязательны для заполнения')
        if (form.password.length < 6) 
            throw new Error('Пароль должен содержать минимум 6 символов')
        if (form.password !== form.confirmPassword)
            throw new Error('Пароли не совпадают')

        const result = await fakeRegistration(form)
        if (!result.success)
            throw new Error(result.message)

        const token = btoa(JSON.stringify({ 
            id: result.id, 
            email: result.email,
            timestamp: Date.now()
        }))
        auth.setToken(token)
        
        success.value = true
        form.password = ''
        form.confirmPassword = ''

        setTimeout(() => { 
            router.push('/profile') 
        }, 2000)
        
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
            <h1 class="registration-title">Зарегистрироваться в систему</h1>
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
                    <label for="name" class="form-label">Имя в системе</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        v-model="form.name"
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
                <div class="form-group">
                    <label for="confirmPassword" class="form-label">Подтвердить пароль</label>
                    <input 
                        type="password" 
                        id="confirmPassword"
                        name="confirmPassword"
                        v-model="form.confirmPassword"
                        class="form-input"
                        required
                        :disabled="isLoading"/>
                </div>
                <button type="submit" class="submit-button" :disabled="isLoading">
                    {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
                </button>
                <div v-if="error" class="error-message">
                    <strong>Ошибка:</strong> {{ error }}
                </div>
                <div v-if="success" class="success-message">
                    Регистрация успешна! Перенаправляем...
                </div>
            </form>
            <div class="login-link-reg">
                <RouterLink to="/login">Есть аккаунт?</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped src="../style.css"></style>