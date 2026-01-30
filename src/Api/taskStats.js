const TASK_STATS_KEY = 'tasks_stats'

const TASK_CATEGORIES = [
    'Основы JS',
    'Условные операторы и циклы',
    'Функции',
    'Массивы и методы массивов',
    'Объекты и ООП',
    'DOM-манипуляции',
    'Обработка событий',
    'Асинхронный JavaScript'
]

const initStats = (userID) => {
    const userStats = {
        userID,
        total: 0,
        byCategory: {},
        solvedTasks: [],
        lastUpdated: new Date().toISOString()
    }

    TASK_CATEGORIES.forEach(category => { userStats.byCategory[category] = 0 })
    return userStats
}

export const getUserStats = (userID) => {
    const allStats = JSON.parse(localStorage.getItem(TASK_STATS_KEY) || '{}')

    if (!allStats[userID])
    {
        allStats[userID] = initStats(userID)
        localStorage.setItem(TASK_STATS_KEY, JSON.stringify(allStats))
    }

    return allStats[userID];
}

export const saveUserStats = (userID, stats) => {
    const allStats = JSON.parse(localStorage.getItem(TASK_STATS_KEY) || '{}')
    allStats[userID] = {
        ...stats,
        lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(TASK_STATS_KEY, JSON.stringify(allStats))
}

export const markedTaskAsSolved = (userID, taskID, category) => {
    const stats = getUserStats(userID)

    if (!stats.solvedTasks.includes(taskID))
    {
        stats.total += 1
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
        stats.solvedTasks = [...(stats.solvedTasks || []), taskID]
        saveUserStats(userID, stats)
        return true
    }

    return false
}

export const getTasksStats = (userID) => {
    const stats = getUserStats(userID)

    return {
        total: stats.total,
        byCategory: { ...stats.byCategory },
        lastUpdated: stats.lastUpdated
    }
}

export const getProgressByCategory = (userId) => {
    const stats = getUserStats(userId)
    const totalCategories = TASK_CATEGORIES.length
    const solvedCategories = Object.values(stats.byCategory).filter(count => count > 0).length
    
    return Math.round((solvedCategories / totalCategories) * 100)
}