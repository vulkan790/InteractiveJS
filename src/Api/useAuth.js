import { ref } from 'vue'
import { verifyToken } from './fakeAPIBackend.js'

export function useAuth()
{
    const token = ref(localStorage.getItem('webid_token') || '')

    const isAuth = () => {
        const result = verifyToken(token.value)
        return result.isValid
    }

    const getCurrentUser = () => {
        const result = verifyToken(token.value)
        return result.user || null
    }

    const setToken = (newToken) => {
        token.value = newToken
        localStorage.setItem('webid_token', newToken)
    }

    const removeToken = () => {
        token.value = ''
        localStorage.removeItem('webid_token')
    }

    const getToken = () => {
        return token.value
    }

    return { isAuth, getCurrentUser, setToken, removeToken, getToken, token }
}