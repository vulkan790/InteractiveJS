export const tasks = [
    {
        id: 'task-basics-1',
        difficulty: 'easy',
        title: 'Hello World',
        description: 'Выведите фразу "Hello World!" в консоли с помощью функции console.log().',
        category: 'Основы JS',
        categoryKey: 'Основы JS',
        inputExample: '',
        outputExample: 'Hello World!',
        solution: 'console.log("Hello World!");',
        tests: [
            { input: '', expected: 'Hello World!' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-basics-2',
        difficulty: 'easy',
        title: 'Сумма чисел',
        description: 'Создайте две переменные a и b, присвойте им числа 5 и 3 соответственно, и выведите их сумму.',
        category: 'Основы JS',
        categoryKey: 'Основы JS',
        inputExample: '',
        outputExample: '8',
        solution: 'let a = 5;\nlet b = 3;\nconsole.log(a + b);',
        tests: [
            { input: '', expected: '8' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-basics-3',
        difficulty: 'easy',
        title: 'Переменные',
        description: 'Создайте переменную name и присвойте ей ваше имя. Выведите "Привет, [ваше имя]!"',
        category: 'Основы JS',
        categoryKey: 'Основы JS',
        inputExample: '',
        outputExample: 'Привет, Иван!',
        solution: 'let name = "Иван";\nconsole.log("Привет, " + name + "!");',
        tests: [
            { input: '', expected: 'Привет, Иван!' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-conditions-1',
        difficulty: 'medium',
        title: 'Проверка числа',
        description: 'Напишите программу, которая проверяет, является ли число положительным, отрицательным или нулём. Число задано в переменной num.',
        category: 'Условные операторы и циклы',
        categoryKey: 'Условные операторы и циклы',
        inputExample: 'let num = 5;',
        outputExample: 'Положительное',
        solution: 'let num = 5;\nif (num > 0) {\n  console.log("Положительное");\n} else if (num < 0) {\n  console.log("Отрицательное");\n} else {\n  console.log("Ноль");\n}',
        tests: [
            { input: 'let num = 5;', expected: 'Положительное' },
            { input: 'let num = -3;', expected: 'Отрицательное' },
            { input: 'let num = 0;', expected: 'Ноль' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-conditions-2',
        difficulty: 'medium',
        title: 'Четное или нечетное',
        description: 'Проверьте, является ли число четным или нечетным. Число задано в переменной number.',
        category: 'Условные операторы и циклы',
        categoryKey: 'Условные операторы и циклы',
        inputExample: 'let number = 7;',
        outputExample: 'Нечетное',
        solution: 'let number = 7;\nif (number % 2 === 0) {\n  console.log("Четное");\n} else {\n  console.log("Нечетное");\n}',
        tests: [
            { input: 'let number = 7;', expected: 'Нечетное' },
            { input: 'let number = 4;', expected: 'Четное' },
            { input: 'let number = 0;', expected: 'Четное' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-functions-1',
        difficulty: 'medium',
        title: 'Функция суммы',
        description: 'Создайте функцию sum, которая принимает два числа и возвращает их сумму.',
        category: 'Функции',
        categoryKey: 'Функции',
        inputExample: 'console.log(sum(2, 3));',
        outputExample: '5',
        solution: 'function sum(a, b) {\n  return a + b;\n}\nconsole.log(sum(2, 3));',
        tests: [
            { input: 'console.log(sum(2, 3));', expected: '5' },
            { input: 'console.log(sum(10, 20));', expected: '30' },
            { input: 'console.log(sum(-5, 5));', expected: '0' }
        ],
        starterCode: '// Пишите ваш код здесь\n// Не удаляйте эту строку:\nconsole.log(sum(2, 3));'
    },
    {
        id: 'task-arrays-1',
        difficulty: 'medium',
        title: 'Сумма элементов массива',
        description: 'Напишите функцию, которая принимает массив чисел и возвращает сумму всех элементов.',
        category: 'Массивы и методы массивов',
        categoryKey: 'Массивы и методы массивов',
        inputExample: 'let arr = [1, 2, 3, 4, 5];',
        outputExample: '15',
        solution: 'let arr = [1, 2, 3, 4, 5];\nlet sum = 0;\nfor (let i = 0; i < arr.length; i++) {\n  sum += arr[i];\n}\nconsole.log(sum);',
        tests: [
            { input: 'let arr = [1, 2, 3, 4, 5];', expected: '15' },
            { input: 'let arr = [10, 20, 30];', expected: '60' },
            { input: 'let arr = [];', expected: '0' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-arrays-2',
        difficulty: 'hard',
        title: 'Поиск максимального элемента',
        description: 'Напишите функцию, которая находит максимальный элемент в массиве чисел.',
        category: 'Массивы и методы массивов',
        categoryKey: 'Массивы и методы массивов',
        inputExample: 'let numbers = [3, 7, 2, 9, 1];',
        outputExample: '9',
        solution: 'let numbers = [3, 7, 2, 9, 1];\nlet max = numbers[0];\nfor (let i = 1; i < numbers.length; i++) {\n  if (numbers[i] > max) {\n    max = numbers[i];\n  }\n}\nconsole.log(max);',
        tests: [
            { input: 'let numbers = [3, 7, 2, 9, 1];', expected: '9' },
            { input: 'let numbers = [-5, -2, -10];', expected: '-2' },
            { input: 'let numbers = [42];', expected: '42' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-objects-1',
        difficulty: 'medium',
        title: 'Работа с объектом',
        description: 'Создайте объект user с полями name и age. Добавьте метод greet, который выводит приветствие.',
        category: 'Объекты и ООП',
        categoryKey: 'Объекты и ООП',
        inputExample: '',
        outputExample: 'Привет, Иван! Мне 25 лет.',
        solution: 'let user = {\n  name: "Иван",\n  age: 25,\n  greet: function() {\n    console.log("Привет, " + this.name + "! Мне " + this.age + " лет.");\n  }\n};\nuser.greet();',
        tests: [
            { input: '', expected: 'Привет, Иван! Мне 25 лет.' }
        ],
        starterCode: '// Пишите ваш код здесь\n// Вызовите метод greet'
    },
    {
        id: 'task-dom-1',
        difficulty: 'hard',
        title: 'Создание элемента DOM',
        description: 'Напишите код, который создает новый div элемент с текстом "Привет, мир!" и добавляет его в body.',
        category: 'DOM-манипуляции',
        categoryKey: 'DOM-манипуляции',
        inputExample: '',
        outputExample: '[Элемент добавлен в DOM]',
        solution: 'let div = document.createElement("div");\ndiv.textContent = "Привет, мир!";\ndocument.body.appendChild(div);\nconsole.log("[Элемент добавлен в DOM]");',
        tests: [
            { input: '', expected: '[Элемент добавлен в DOM]' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-events-1',
        difficulty: 'hard',
        title: 'Обработчик клика',
        description: 'Создайте кнопку и добавьте обработчик события click, который выводит сообщение в консоль.',
        category: 'Обработка событий',
        categoryKey: 'Обработка событий',
        inputExample: '',
        outputExample: 'Кнопка нажата!',
        solution: 'let button = document.createElement("button");\nbutton.textContent = "Нажми меня";\nbutton.addEventListener("click", function() {\n  console.log("Кнопка нажата!");\n});\ndocument.body.appendChild(button);',
        tests: [
            { input: '', expected: '[Кнопка создана]' }
        ],
        starterCode: '// Пишите ваш код здесь\n'
    },
    {
        id: 'task-async-1',
        difficulty: 'hard',
        title: 'Промисы и setTimeout',
        description: 'Напишите функцию, которая возвращает промис, резолвящийся через 1 секунду с сообщением "Готово!"',
        category: 'Асинхронный JavaScript',
        categoryKey: 'Асинхронный JavaScript',
        inputExample: '',
        outputExample: 'Готово!',
        solution: 'function delayedMessage() {\n  return new Promise((resolve) => {\n    setTimeout(() => {\n      resolve("Готово!");\n    }, 1000);\n  });\n}\n\ndelayedMessage().then(message => console.log(message));',
        tests: [
            { input: '', expected: 'Готово!' }
        ],
        starterCode: '// Создайте функцию delayedMessage здесь\n\n// Пишите ваш код здесь\n'
    }
];

export const getTaskById = (id) => {
    return tasks.find(task => task.id === id) || null;
};

export const getAllTasks = () => {
    return tasks;
};

export const getTasksByCategory = (categoryKey) => {
    return tasks.filter(task => task.categoryKey === categoryKey);
};

export const getTasksByDifficulty = (difficulty) => {
    return tasks.filter(task => task.difficulty === difficulty);
};