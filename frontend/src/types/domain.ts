export type Difficult = "easy" | "medium" | "hard"
export type Role = "user" | "author" | "moderator" | "admin"
export type TaskStatus = "draft" | "pending_review" | "changes_requested" | "published" | "rejected"
export type CategoryKey =
  | "Основы JS"
  | "Условные операторы и циклы"
  | "Функции"
  | "Массивы и методы массивов"
  | "Объекты и ООП"
  | "DOM-манипуляции"
  | "Обработка событий"
  | "Асинхронный JavaScript"

export interface User
{
    id: string
    email: string
    name: string
    role?: Role
    createdAt: string
}

export interface TaskTest
{
    input: string
    expected: string
}

export interface Task
{
    id: string
    title: string
    description: string
    difficulty: Difficult
    category: string
    categoryKey: CategoryKey
    inputExample: string
    outputExample: string
    starterCode: string
    tests: TaskTest[]
    status?: TaskStatus
    authorId?: string
}

export interface TestResult
{
    testNumber: number
    passed: boolean
    input?: string
    expected?: string
    actual?: string
}

export interface SubmitResult
{
    passed: number
    total: number
    solved: boolean
    tests: TestResult[]
}

export interface UserStatus
{
    total: number
    byCategory: Record<CategoryKey, number>
    lastUpdated: string
}

export interface RegisterPayload 
{
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface LoginPayload 
{
    email: string
    password: string
}