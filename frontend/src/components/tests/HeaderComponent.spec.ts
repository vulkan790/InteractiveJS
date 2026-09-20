import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { createRouter, createWebHistory } from "vue-router"
import HeaderComponent from "../HeaderComponent.vue"

let isAuthMock = false

vi.mock("../../composables/useAuth", () => ({
    useAuth: () => ({
        isAuth: () => isAuthMock,
        getCurrentUser: () => isAuthMock ? { id: "1", name: "Иван", email: "a@a.com", createdAt: "" } : null,
        removeToken: vi.fn(),
        token: { value: "" }
    })
}))

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: { template: "<div />"} },
        { path: "/login", component: { template: "<div />" } },
        { path: "/tasks", component: { template: "<div />" } },
        { path: "/profile", component: { template: "<div />" } }
    ]
})

describe("HeaderComponent", () => {
    it("Авторизованный видит ЗАДАЧИ и ПРОФИЛЬ, не видит ВОЙТИ", async () => {
        isAuthMock = true
        const wrapper = mount(HeaderComponent, { global: { plugins: [router] }})
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain("Задачи")
        expect(wrapper.text()).toContain("Профиль")
        expect(wrapper.text()).not.toContain("Войти")
    })
    it("Неавторизованный видит ВОЙТИ, но не видит ЗАДАЧИ и ПРОФИЛЬ", async () => {
        isAuthMock = false
        const wrapper = mount(HeaderComponent, { global: { plugins: [router] } })
        await wrapper.vm.$nextTick()
    
        expect(wrapper.text()).not.toContain("Задачи")
        expect(wrapper.text()).not.toContain("Профиль")
        expect(wrapper.text()).toContain("Войти")
    })
})