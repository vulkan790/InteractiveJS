import { describe, it, expect} from "vitest"
import { mount } from "@vue/test-utils"
import { createRouter, createWebHistory } from "vue-router"
import TaskComponent from "../TaskComponent.vue"
import type { Task } from "@/types/domain"

const sampleTask: Task = {
        id: 'task-basics-1',
        difficulty: 'easy',
        title: 'Hello World',
        description: 'Выведите фразу "Hello World!" в консоли с помощью функции console.log().',
        category: 'Основы JS',
        categoryKey: 'Основы JS',
        inputExample: '',
        outputExample: 'Hello World!',
        starterCode: '// Пишите ваш код здесь\n', 
        tests: [{ input: '', expected: 'Hello World!' }]
}

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: "/tasks/:id", name: "task", component: { template: "<div />"} }]
})

describe("TaskComponent", () => {
    it("Без пропа is-solved показывает \"Решить\"", async () => {
        const wrapper = mount(TaskComponent, {
            props: { task: sampleTask},
            global: { plugins: [router] }
        })
        expect(wrapper.text()).toContain("Решить")
        expect(wrapper.text()).not.toContain("Решено")
    })
    it("c is-solved показывает бейдж и текст \"Решено\"", async () => {
        const wrapper = mount(TaskComponent, {
            props: { task: sampleTask, isSolved: true },
            global: { plugins: [router] }
        })
        expect(wrapper.find('.solved-badge').exists()).toBe(true)
        expect(wrapper.text()).toContain('Решено')
    })
    it('переводит сложность на русский', () => {
        const wrapper = mount(TaskComponent, {
            props: { task: { ...sampleTask, difficulty: 'hard' } },
            global: { plugins: [router] }
        })
        expect(wrapper.text()).toContain('Сложная')
    })
})