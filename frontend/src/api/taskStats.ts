import { type CategoryKey } from "@/types/domain"

const TASK_STATS_KEY = 'tasks_stats'

const TASK_CATEGORIES: CategoryKey[] = [
    'Основы JS',
    'Условные операторы и циклы',
    'Функции',
    'Массивы и методы массивов',
    'Объекты и ООП',
    'DOM-манипуляции',
    'Обработка событий',
    'Асинхронный JavaScript'
]

export interface UserStatsRecord
{
    userID: string
    total: number
    byCategory: Record<string, number>
    solvedTasks: string[]
    lastUpdated: string
}
 
type AllStats = Record<string, UserStatsRecord>
 
const loadAll = (): AllStats => JSON.parse(localStorage.getItem(TASK_STATS_KEY) ?? '{}') as AllStats
 
const saveAll = (all: AllStats): void => { 
    localStorage.setItem(TASK_STATS_KEY, JSON.stringify(all))
}

const initStats = (userID: string): UserStatsRecord => {
    const byCategory: Record<string, number> = {}
    TASK_CATEGORIES.forEach((category) => {
        byCategory[category] = 0
    })
    return {
        userID,
        total: 0,
        byCategory,
        solvedTasks: [],
        lastUpdated: new Date().toISOString(),
    }
}
 
export const getUserStats = (userID: string): UserStatsRecord => {
    const all = loadAll()
    const existing = all[userID]
    if (existing) 
        return existing
    
    const fresh = initStats(userID)
    all[userID] = fresh
    saveAll(all)
    return fresh
}
 
export const saveUserStats = (userID: string, stats: UserStatsRecord): void => {
    const all = loadAll()
    all[userID] = { ...stats, lastUpdated: new Date().toISOString() }
    saveAll(all)
}
 
export const markedTaskAsSolved = (userID: string, taskID: string, category: string): boolean => {
    const stats = getUserStats(userID)
    if (stats.solvedTasks.includes(taskID)) 
        return false
    
    stats.total += 1
    stats.byCategory[category] = (stats.byCategory[category] ?? 0) + 1
    stats.solvedTasks = [...stats.solvedTasks, taskID]
    saveUserStats(userID, stats)
    return true
}
 
export interface TasksStats {
    total: number
    byCategory: Record<string, number>
    lastUpdated: string
}
 
export const getTasksStats = (userID: string): TasksStats => {
    const stats = getUserStats(userID)
    return {
        total: stats.total,
        byCategory: { ...stats.byCategory },
        lastUpdated: stats.lastUpdated,
    }
}
 
export const getProgressByCategory = (userId: string): number => {
    const stats = getUserStats(userId)
    const totalCategories = TASK_CATEGORIES.length
    const solvedCategories = Object.values(stats.byCategory).filter((count) => count > 0).length
    return Math.round((solvedCategories / totalCategories) * 100)
}