import type { User } from '@/types/domain'

const USERS_STORAGE_KEY = 'fake_users'

interface StoredUser extends User 
{
    password: string
}

interface RegisterInput 
{
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface RegisterResult 
{
    success: boolean
    id: string
    name: string
    email: string
    message: string
}

export interface LoginResult 
{
    success: boolean
    token: string
    user: User
    message: string
}

export interface AuthCheck 
{
    isValid: boolean
    user?: User
}

const initUsersStorage = (): void => {
    if (!localStorage.getItem(USERS_STORAGE_KEY))
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]))
}

const getUsers = (): StoredUser[] => {
    initUsersStorage()
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]') as StoredUser[]
}

const saveUsers = (users: StoredUser[]): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const generateID = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2)

const generateToken = (user: StoredUser): string => btoa(JSON.stringify({ id: user.id, email: user.email, timestamp: Date.now() }))

export const fakeRegistration = async (userData: RegisterInput): Promise<RegisterResult> => {
    return new Promise<RegisterResult>((resolve, reject) => {
        setTimeout(() => {
        try 
        {
            initUsersStorage()
            if (userData.password.length < 6)
            throw new Error('Пароль должен содержать минимум 6 символов')
            if (userData.password !== userData.confirmPassword)
            throw new Error('Пароли не совпадают')

            const users = getUsers()
            if (users.some((user) => user.email === userData.email))
            throw new Error('Пользователь с таким email уже существует')

            const newUser: StoredUser = {
            id: generateID(),
            email: userData.email,
            name: userData.name,
            password: userData.password,
            createdAt: new Date().toISOString(),
            }

            users.push(newUser)
            saveUsers(users)

            resolve({
            success: true,
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            message: 'Регистрация успешна',
            })
        } 
        catch (e) 
        {
            reject({ success: false, message: e instanceof Error ? e.message : String(e) })
        }
        }, 500)
    })
}

export const fakeAuthorization = async (email: string, password: string): Promise<LoginResult> => {
    return new Promise<LoginResult>((resolve, reject) => {
        setTimeout(() => {
        try 
        {
            const users = getUsers()
            const user = users.find((u) => u.email === email && u.password === password)

            if (!user) 
                throw new Error('Неверный email или пароль')

            resolve({
            success: true,
            token: generateToken(user),
            user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
            message: 'Вход выполнен успешно',
            })
        } 
        catch (error) 
        {
            reject({ success: false, message: error instanceof Error ? error.message : String(error) })
        }
        }, 500)
    })
}

export const verifyToken = (token: string): AuthCheck => {
    if (!token) 
        return { isValid: false }

    try 
    {
        const decoded = JSON.parse(atob(token)) as { id: string; timestamp: number }
        const users = getUsers()
        const user = users.find((u) => u.id === decoded.id)

        if (user && Date.now() - decoded.timestamp < 24 * 60 * 60 * 1000) 
        {
            return {
                isValid: true,
                user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
            }
        }
        return { isValid: false }
    } 
    catch 
    {
        return { isValid: false }
    }
}

export const fakeLogout = (): void => {
    localStorage.removeItem('webid_token')
}