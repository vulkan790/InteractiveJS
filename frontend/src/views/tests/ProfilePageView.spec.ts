import { describe, it, expect, vi} from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import { createRouter, createWebHistory } from "vue-router"
import ProfilePageView from "../ProfilePageView.vue"

let statsTotal = 0
let progress = 0

vi.mock("@/composables/useAuth", () => ({
    useAuth: () => ({ 
        isAuth: () => true,
        getCurrentUser: () => ({
            id: "user-1",
            name: "Иван",
            email: "a@a.com",
            createdAt: "2026-01-15T00:00:00.000Z",
        }),
        token: { value: "fake-token" }
    })
}))

vi.mock("@/api/taskStats", () => ({
    getTasksStats: () => ({ total: statsTotal, byCategory: {}, lastUpdated: "" }),
    getProgressByCategory: () => progress
}))
 
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: { template: "<div />" } },
        { path: "/login", component: { template: "<div />" } }
    ]
})

describe("ProfilePageView - склонение количества задач", () => {
    const cases: [number, string][] = [
        [0, "задач"],
        [1, "задача"],
        [2, "задачи"],
        [4, "задачи"],
        [5, "задач"],
        [11, "задач"],
        [21, "задача"],
    ]

    it.each(cases)('%i -> "%s"', async (count, word) => {
        statsTotal = count
        const wrapper = mount(ProfilePageView, { global: { plugins: [router] } })
        await flushPromises()
    
        expect(wrapper.text()).toContain(`${count} ${word}`)
    })
})

describe("ProfilePageView", () => {
    it("показывает имя пользователя и процент прогресса", async () => {
        statsTotal = 3
        progress = 25
        const wrapper = mount(ProfilePageView, { global: { plugins: [router] } })
        await flushPromises()
    
        expect(wrapper.text()).toContain("Иван")
        expect(wrapper.text()).toContain("25%")
    })
})