'use strict'

const vm = require("node:vm")
const MAX_OUTPUT_LINES = 200
const MAX_LINE_LEN = 2000

function readStdin()
{
    return new Promise((resolve, reject) => {
        let buf = "";
        process.stdin.setEncoding("utf-8")
        process.stdin.on("data", (c) => {
            buf += c
        })
        process.stdin.on("end", () => resolve(buf))
        process.stdin.on("error", reject)
    })
}

function formatArg(a)
{
    if (typeof(a) === "string")
        return a
    try
    {
        return JSON.stringify(a)
    }
    catch
    {
        return String(a)
    }
}

function normalize(lines)
{
    return lines.map((l) => l.replace(/[ \t]+$/g, '')).join('\n').trim()
}

function makeConsole(lines)
{
    const push = (...args) => {
        if (lines.length >= MAX_OUTPUT_LINES)
            return
        lines.push(args.map(formatArg).join(' ').slice(0, MAX_LINE_LEN))
    }

    return {
        log: push,
        info: push,
        warn: push,
        error: push,
        debug: push
    }
}

function runOne(code, test, timeoutMs)
{
    const lines = []

    const context = vm.createContext(
        {
            console: makeConsole(lines)
        },
        {
            microtaskMode: 'afterEvaluate',
            codeGeneration: {
                strings: false,
                wasm: false
            }
        }
    )

    try
    {
        if (test.input)
            new vm.Script(String(test.input), { filename: "test-setup.js" }).runInContext(context, { timeout: timeoutMs, displayErrors: true })

        new vm.Script(`{\n${code}\n}`, { filename: "solution.js" }).runInContext(context, { timeout: timeoutMs, displayErrors: true })
    }
    catch (error)
    {
        return {
            passed: false,
            expected: test.expected,
            actual: normalize(lines),
            error: `${err && err.name ? err.name : 'Error'}: ${err && err.message ? err.message : String(err)}`
        }
    }

    const actual = normalize(lines)
    return {
        passed: actual === String(test.expected).trim(),
        expected: test.expected,
        actual, 
        error: null
    }
}

function emit(obj)
{
    const json = JSON.stringify(obj)
    process.stdout.write(json, () => process.exit(0))
}

(async () => {
    let payload
    try
    {
        payload = JSON.parse(await readStdin())
    }
    catch (error)
    {
        emit({
            fatal: `bad payload: ${e.message}`
        })
        return
    }

    const code = String(payload.code ?? '')
    const tests = Array.isArray(payload.tests) ? payload.tests : []
    const timeoutMs = Number.isInteger(payload.timeoutMs) && payload.timeoutMs > 0 ? payload.timeoutMs : 2000

    const results = tests.map((t) => {
        try
        {
            return runOne(code, t, timeoutMs)
        }
        catch (error)
        {
            return { 
                passed: false, 
                expected: t.expected, 
                actual: '', 
                error: `runner: ${e.message}` 
            }
        }
    })

    emit({ results, passed: results.length > 0 && results.every((r) => r.passed) })
})().catch((e) => emit({ fatal: `runner crashed: ${e.message}` }))