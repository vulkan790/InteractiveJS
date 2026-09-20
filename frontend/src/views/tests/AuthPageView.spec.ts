import { describe, it, expect, vi, beforeEach} from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import { createRouter, createWebHistory } from "vue-router"
import AuthPageView from "../AuthPageView.vue"

const pushMock = vi.fn()
const setTokenMock = vi.fn()

vi.mock("vue-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("vue-router")>()
    return { ...actual, useRouter: () => ({ push: pushMock }) }
})

vi.mock("@/composables/useAuth", () => ({
    useAuth: () => ({ setToken: setTokenMock })
}))

vi.mock("@/api/fakeAPIBackend", () => ({
    fakeAuthorization: vi.fn((email: string, password: string) => {
        if (email === "good@test.com" && password === "correct-password")
        {
            return Promise.resolve({
                success: true,
                token: "fake-token",
                user: { id: "1", name: "Ivan", email, createdAt: ""},
                message: "ok"
            })
        }
        return Promise.reject({ success: false, message: "Неверный email или пароль" })
    })
}))

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: "/", name: "home", component: { template: "<div />"} }]
})

beforeEach(() => {
    pushMock.mockClear()
    setTokenMock.mockClear()
})

describe("AuthPage", () => {
    it("Показывает ошибку сервера при неверных данных", async () => {
        const wrapper = mount(AuthPageView, { global: { plugins: [router] } })

        await wrapper.find("#email").setValue("good@test.com")
        await wrapper.find("#password").setValue("wrong-password")
        await wrapper.find("form").trigger("submit.prevent")
        await flushPromises()

        expect(wrapper.text()).toContain("Неверный email или пароль")
        expect(setTokenMock).not.toHaveBeenCalled()
    })
    it("При верных данных перенаправка на /profile", async () => {
        vi.useFakeTimers()
        const wrapper = mount(AuthPageView, { global: { plugins: [router] } })

        await wrapper.find("#email").setValue("good@test.com")
        await wrapper.find("#password").setValue("correct-password")
        await wrapper.find("form").trigger("submit.prevent")
        await flushPromises()

        expect(setTokenMock).toHaveBeenCalledWith('fake-token')
        expect(wrapper.text()).toContain('Авторизация успешна')
    
        vi.advanceTimersByTime(1000)
        expect(pushMock).toHaveBeenCalledWith('/profile')
        vi.useRealTimers()
    })
})