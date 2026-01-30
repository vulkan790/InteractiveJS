const USERS_STORAGE_KEY = 'fake_users'

const initUsersStorage = () => {
    if (!localStorage.getItem(USERS_STORAGE_KEY))
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]))
}

const getUsers = () => {
    initUsersStorage()
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
}

const saveUsers = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const generateID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const generateToken = (user) => {
    return btoa(JSON.stringify({ 
        id: user.id, 
        email: user.email,
        timestamp: Date.now()
    }))
}

export const fakeRegistration = async (userData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try
            {
                initUsersStorage()
                if (userData.password.length < 6)
                    throw new Error('Пароль должен содержать минимум 6 символов')
                if (userData.password !== userData.confirmPassword)
                    throw new Error('Пароли не совпадают')
                
                const users = getUsers()
                if (users.some(user => user.email === userData.email))
                    throw new Error('Пользователь с таким email уже существует')

                const newUser = {
                    id: generateID(),
                    email: userData.email,
                    name: userData.name,
                    password: userData.password,
                    createdAt: new Date().toISOString()
                }

                users.push(newUser)
                saveUsers(users)

                resolve({
                    success: true,
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    message: 'Регистрация успешна'
                })
            }
            catch (e)
            {
                reject({
                    success: false,
                    message: e.message
                })
            }
        }, 500)
    })
}

export const fakeAuthorization = async (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try
            {
                const users = getUsers()
                const user = users.find(u => u.email === email && u.password === password)
                
                if (!user)
                    throw new Error('Неверный email или пароль')
                
                const token = generateToken(user)
                
                resolve({
                    success: true,
                    token: token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt
                    },
                    message: 'Вход выполнен успешно'
                })
            }
            catch (error) 
            {
                reject({
                    success: false,
                    message: error.message
                })
            }
        }, 500)
    })
}

export const verifyToken = (token) => {
    if (!token)
        return { isValid: false }

    try
    {
        const decoded = JSON.parse(atob(token))
        const users = getUsers()
        const user = users.find(u => u.id === decoded.id)

        if (user && Date.now() - decoded.timestamp < 24 * 60 * 60 * 1000) 
        {
            return { 
                isValid: true, 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                }
            }
        }
        return { isValid: false }
    }
    catch 
    {
        return { isValid: false }
    }
}

export const fakeLogout = () => {
    localStorage.removeItem('webid_token')
}