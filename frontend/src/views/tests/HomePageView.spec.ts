import { describe, it, expect, vi, beforeEach} from "vitest"
import { mount } from "@vue/test-utils"
import { createRouter, createWebHistory } from "vue-router"
import HomePageView from "../HomePageView.vue"

let isAuthMock = false

vi.mock("../../composables/useAuth", () => ({
    useAuth: () => ({
        isAuth: () => isAuthMock,
        getCurrentUser: () => null,
        token: { value: "" }
    })
}))

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: { template: "<div />"} },
        { path: "/login", component: { template: "<div />" } },
        { path: "/tasks", component: { template: "<div />" } }
    ]
})

describe("HomePageView", () => {
    beforeEach(async () => {
        await router.push("/")
    })

    it('авторизованного ведёт на /tasks', async () => {
        isAuthMock = true
        const pushSpy = vi.spyOn(router, 'push')
        const wrapper = mount(HomePageView, { global: { plugins: [router] } })
        await wrapper.find('.cta-button').trigger('click')
    
        expect(pushSpy).toHaveBeenCalledWith('/tasks')
    })
    it("Неавторизованного ведёт на /login", async () => {
        isAuthMock = false
        const pushSpy = vi.spyOn(router, 'push')
        const wrapper = mount(HomePageView, { global: { plugins: [router] } })
        await wrapper.find('.cta-button').trigger('click')
    
        expect(pushSpy).toHaveBeenCalledWith('/login')
    })
})