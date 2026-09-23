import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import { createRouter, createWebHistory } from "vue-router"
import { markedTaskAsSolved } from "@/api/taskStats"
import TasksPageView from "../TasksPageView.vue"

vi.mock("@/composables/useAuth", () => ({
    useAuth: () => ({ 
        isAuth: () => true,
        getCurrentUser: () => ({
            id: "user-1",
            name: "Иван",
            email: "a@a.com",
            createdAt: "",
        }),
        removeToken: vi.fn(),
        token: { value: "fake-token" }
    })
}))

const routes = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: { template: "<div />" }
        },
        {
            path: '/profile',
            name: 'profile',
            component: { template: "<div />" }
        },
        {
            path: '/login',
            name: 'login',
            component: { template: "<div />" }
        },
        {
            path: '/tasks',
            name: 'tasks',
            component: { template: "<div />" }
        },
        {
            path: '/tasks/:id',
            name: 'task',
            component: { template: "<div />" }
        }
    ]
})

beforeEach(() => {
    localStorage.clear()
})

describe("TasksPageView - фильтры", () => {
    it("Поиск по названию сужает список задач", async () => {
        const wrapper = mount(TasksPageView, { global: { plugins: [routes] } })

        await wrapper.vm.$nextTick()
        await wrapper.find(".search-input").setValue("Hello World")
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain("Найдено задач: 1")
    })
    it("Поиск по фильтру easy оставляет только лёгкие задачи", async () => {
        const wrapper = mount(TasksPageView, { global: { plugins: [routes] } })

        await wrapper.vm.$nextTick()

        const difficultySelect = wrapper.findAll(".filter-select")[1]
        await difficultySelect?.setValue("easy")
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain("Найдено задач: 3")
    })
    it('кнопка "Сбросить" возвращает список к полному', async () => {
        const wrapper = mount(TasksPageView, { global: { plugins: [routes] } })
        await wrapper.vm.$nextTick()
 
        await wrapper.find(".search-input").setValue("Hello World")
        await wrapper.vm.$nextTick()
        await wrapper.find(".reset-button").trigger("click")
        await wrapper.vm.$nextTick()
 
        expect(wrapper.text()).toContain("Найдено задач: 12")
    })
})

describe("TasksPageView — интеграция со статусом решения (регрессия бейджа)", () => {
    it("нерешённая задача показывает \"Решить\", а не \"Решено\"", async () => {
        const wrapper = mount(TasksPageView, { global: { plugins: [routes] } })
        await wrapper.vm.$nextTick()
 
        expect(wrapper.text()).toContain("Решить")
        expect(wrapper.find(".solved-badge").exists()).toBe(false)
    })
 
    it("Решённая задача показывает бейдж и \"Решено ✓\", а не \"Решить\"", async () => {
        markedTaskAsSolved("user-1", "task-basics-1", "Основы JS")
 
        const wrapper = mount(TasksPageView, { global: { plugins: [routes] } })
        await wrapper.vm.$nextTick()
 
        expect(wrapper.find(".solved-badge").exists()).toBe(true)
        expect(wrapper.text()).toContain("Решено ✓")
    })
})