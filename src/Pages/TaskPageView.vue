<script setup>
import HeaderComponent from '@/Components/HeaderComponent.vue';
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../Api/useAuth.js'
import { ref, onMounted, computed, watch } from 'vue'
import { markedTaskAsSolved, getUserStats } from '../Api/taskStats.js'
import { getTaskById, getAllTasks } from '../Api/tasksData.js'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const taskId = route.params.id
const currentUser = ref(null)
const code = ref('')
const output = ref('')
const isRunning = ref(false)
const isSolved = ref(false)
const testResults = ref([])
const task = ref(null)
const allTasks = ref([])

const difficultyLabels = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно'
}

onMounted(() => {
    const user = auth.getCurrentUser()
    if (!user) 
    {
        router.push('/login')
        return
    }
    currentUser.value = user

    const loadedTask = getTaskById(taskId)
    if (!loadedTask) 
    {
        router.push('/tasks')
        return
    }
    task.value = loadedTask

    allTasks.value = getAllTasks()
    
    if (user) 
    {
        const stats = getUserStats(user.id)
        isSolved.value = stats.solvedTasks?.includes(taskId) || false
    }
    
    const savedCode = localStorage.getItem(`task_code_${taskId}_${user.id}`)
    if (savedCode)
        code.value = savedCode
    else
        code.value = task.value.starterCode || '// Пишите ваш код здесь'
})

const runCode = async () => {
    isRunning.value = true
    output.value = ''
    testResults.value = []

    try
    {
        for (var i = 0; i < task.value.tests.length; ++i)
        {
            const test = task.value.tests[i]

            const originalConsoleLog = console.log
            const logs = []

            console.log = (...args) => {
                logs.push(args.map(arg => {
                    if (typeof arg === 'object') 
                    {
                        try 
                        {
                            return JSON.stringify(arg)
                        } 
                        catch 
                        {
                            return String(arg)
                        }
                    }
                    return String(arg)
                }).join(' '))
            }
            try
            {
                const fullCode = test.input ? test.input + '\n' + code.value : code.value
                
                const func = new Function(fullCode)
                func()
                
                const result = logs.join('\n').trim()
                const passed = result === test.expected.trim()
                
                testResults.value.push({
                    testNumber: i + 1,
                    input: test.input || 'Нет входных данных',
                    expected: test.expected,
                    actual: result || '[Нет вывода]',
                    passed: passed
                })
                
                if (!passed) 
                {
                    output.value += `Тест ${i + 1} не пройден\n`
                    output.value += `Ожидалось: ${test.expected}\n`
                    output.value += `Получено: ${result || '[Нет вывода]'}\n\n`
                } 
                else
                    output.value += `Тест ${i + 1} пройден\n`
            }
            catch (e)
            {
                testResults.value.push({
                    testNumber: i + 1,
                    input: test.input || 'Нет входных данных',
                    expected: test.expected,
                    actual: `Ошибка: ${e.message}`,
                    passed: false
                })
                output.value += `Тест ${i + 1} ошибка: ${e.message}\n\n`
            }
            finally
            {
                console.log = originalConsoleLog
            }
        }
        const allTestPassed = testResults.value.length > 0 && testResults.value.every(test => test.passed)
        if (allTestPassed && !isSolved.value && currentUser.value)
        {
            const marked = markedTaskAsSolved(
                currentUser.value.id, 
                task.value.id, 
                task.value.categoryKey
            )
            if (marked) 
            {
                isSolved.value = true
                setTimeout(() => {
                    alert('Все тесты пройдены! Задача решена успешно!')
                }, 100)
            }
        }
    }
    catch (e)
    {
        output.value = `Критическая ошибка: ${e.message}`
    }
    finally 
    {
        isRunning.value = false
    }
}

const saveCode = () => {
    if (currentUser.value)
        localStorage.setItem(`task_code_${taskId}_${currentUser.value.id}`, code.value)
}

const goToTasks = () => {
    router.push('/tasks')
}

watch(() => code.value, () => {
    if (!isRunning.value)
        saveCode()
})
</script>

<template>
    <div class="task-container">
        <HeaderComponent />
        <div class="task-main">
            <div class="container" v-if="task">
                <div class="task-wrapper">
                    <div class="task-left">
                        <div class="task-header">
                            <div class="task-title-row">
                                <h1 class="task-title">{{ task.title }}</h1>
                                <span class="task-difficulty" :class="task.difficulty">
                                    {{ difficultyLabels[task.difficulty] || task.difficulty }}
                                </span>
                                <span v-if="isSolved" class="solved-badge">Решено</span>
                            </div>
                            <button @click="goToTasks" class="back-button">← К списку задач</button>
                        </div>
                        <div class="task-description">
                            <p>{{ task.description }}</p>
                        </div>
                        <div class="task-io">
                            <div class="io-block">
                                <h3 class="io-title">Пример Input:</h3>
                                <div class="io-content">
                                    <pre v-if="task.inputExample">{{ task.inputExample }}</pre>
                                    <span v-else class="no-data">Нет входных данных</span>
                                </div>
                            </div>
                            <div class="io-block">
                                <h3 class="io-title">Пример Output:</h3>
                                <div class="io-content">
                                    <pre>{{ task.outputExample }}</pre>
                                </div>
                            </div>
                        </div>
                        <div class="task-tests" v-if="task.tests && task.tests.length > 0">
                            <h3 class="tests-title">Тесты:</h3>
                            <div class="tests-list">
                                <div v-for="(test, index) in task.tests" :key="index" class="test-item">
                                    <div class="test-header">
                                        <span class="test-number">Тест {{ index + 1 }}</span>
                                        <span v-if="testResults[index]" 
                                              :class="['test-status', testResults[index].passed ? 'passed' : 'failed']">
                                            {{ testResults[index].passed ? '✓' : '✗' }}
                                        </span>
                                    </div>
                                    <div class="test-content">
                                        <div class="test-input">
                                            <strong>Input:</strong>
                                            <pre>{{ test.input || 'Нет входных данных' }}</pre>
                                        </div>
                                        <div class="test-expected">
                                            <strong>Expected:</strong>
                                            <pre>{{ test.expected }}</pre>
                                        </div>
                                        <div v-if="testResults[index]" class="test-actual">
                                            <strong>Actual:</strong>
                                            <pre :class="{ 'text-error': !testResults[index].passed }">
                                                {{ testResults[index].actual }}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="task-right">
                        <div class="code-editor">
                            <div class="editor-header">
                                <span class="editor-title">Пишите код здесь:</span>
                            </div>
                            <textarea 
                                v-model="code" 
                                class="code-textarea" 
                                :placeholder="task.starterCode"
                                spellcheck="false"></textarea>
                        </div>
                        <button 
                            @click="runCode" 
                            class="run-button"
                            :disabled="isRunning"
                            :class="{ 'running': isRunning }">
                            {{ isRunning ? 'Выполняется...' : 'Запустить' }}
                        </button>
                        <div class="output-container">
                            <div class="output-header">
                                <h3 class="output-title">Результаты тестов:</h3>
                                <button 
                                    v-if="output" 
                                    @click="output = ''; testResults = []" 
                                    class="clear-button">
                                    Очистить
                                </button>
                            </div>
                            <div class="output-content">
                                <pre class="output-text">
                                    {{ output || 'Запустите код, чтобы увидеть результаты...' }}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container" v-else>
                <div class="task-not-found">
                    <h2>Задача не найдена</h2>
                    <p>Задача с ID "{{ taskId }}" не существует.</p>
                    <button @click="goToTasks" class="back-to-tasks">Вернуться к списку задач</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped src="../style.css"></style>