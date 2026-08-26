import { ref, type Ref } from "vue"
import { verifyToken } from "@/api/fakeAPIBackend"
import { type User } from "@/types/domain"

const TOKEN = "webid_token"

export interface UseAuth
{
    token: Ref<string>
    isAuth: () => boolean
    getCurrentUser: () => User | null
    setToken: (newToken: string) => void
    removeToken: () => void
    getToken: () => string
}

export function useAuth(): UseAuth
{
    const token = ref<string>(localStorage.getItem(TOKEN) ?? "")
    const isAuth = (): boolean => verifyToken(token.value).isValid
    const getCurrentUser = (): User | null => verifyToken(token.value).user ?? null
    const setToken = (newToken: string): void => {
        token.value = newToken
        localStorage.setItem(TOKEN, newToken)
    }
    const removeToken = (): void => {
        token.value = ''
        localStorage.removeItem(TOKEN)
    }
    const getToken = (): string => token.value

    return { isAuth, getCurrentUser, setToken, removeToken, getToken, token }
}