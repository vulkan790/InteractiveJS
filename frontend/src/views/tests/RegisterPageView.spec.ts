import { describe, it, expect, vi, beforeEach} from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import { createRouter, createWebHistory } from "vue-router"
import RegisterPageView from "../RegisterPageView.vue"

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
    fakeRegistration: vi.fn(() => Promise.resolve({ success: true, id: "new-id", name: "Ivan", email: "a@a.com", message: "ok" }))
}))

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: "/", name: "home", component: { template: "<div />"} }]
})

const fillForm = async (wrapper: ReturnType<typeof mount>, overrides: Partial<Record<"name" | "email" | "password" | "confirmPassword", string>> = {}) => {
    const values = {
        name: "Иван",
        email: "a@a.com",
        password: "password123",
        confirmPassword: "password123",
        ...overrides,
    }
    await wrapper.find("#name").setValue(values.name)
    await wrapper.find("#email").setValue(values.email)
    await wrapper.find("#password").setValue(values.password)
    await wrapper.find("#confirmPassword").setValue(values.confirmPassword)
}

beforeEach(() => {
    pushMock.mockClear()
    setTokenMock.mockClear()
})

describe("RegisterPage", () => {
    it("Пароль короче 6 символов - ошибка, fakeRegistration не вызывается", async () => {
        const wrapper = mount(RegisterPageView, { global: { plugins: [router] } })
        
        await fillForm(wrapper, { password: "123", confirmPassword: "123" })
        await wrapper.find("form").trigger("submit.prevent")
        await flushPromises()
        
        expect(wrapper.text()).toContain("минимум 6 символов")
        expect(setTokenMock).not.toHaveBeenCalled()
    })
    it("пароли не совпадают — ошибка", async () => {
        const wrapper = mount(RegisterPageView, { global: { plugins: [router] } })
        await fillForm(wrapper, { confirmPassword: "другой-пароль" })
        await wrapper.find("form").trigger("submit.prevent")
        await flushPromises()
    
        expect(wrapper.text()).toContain("Пароли не совпадают")
    })
    it("корректные данные — успех, токен сохранён", async () => {
        const wrapper = mount(RegisterPageView, { global: { plugins: [router] } })
        await fillForm(wrapper)
        await wrapper.find("form").trigger("submit.prevent")
        await flushPromises()
    
        expect(wrapper.text()).toContain("Регистрация успешна")
        expect(setTokenMock).toHaveBeenCalled()
    })
})