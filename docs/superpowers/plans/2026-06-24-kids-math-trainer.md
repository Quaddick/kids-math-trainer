# Детский математический тренажёр (сложение + величины) — План реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать офлайн PWA для iPad из двух разделов — наглядного калькулятора сложения и наглядного сравнения порядков чисел (тысяча → триллиард).

**Architecture:** Vite-проект на vanilla JS (ES-модули) + CSS. Чистая логика вынесена в `src/core/` (тестируется без DOM), UI-рендер — в `src/ui/`. Оболочка-роутер переключает два раздела вкладками. Тесты — Vitest (jsdom). Финал собирается в статику и публикуется как PWA.

**Tech Stack:** Vite, vanilla JS, CSS, Vitest + jsdom, vite-plugin-pwa.

**Спецификация:** [docs/superpowers/specs/2026-06-24-kids-calc-design.md](../specs/2026-06-24-kids-calc-design.md)

## Global Constraints

Эти ограничения действуют для КАЖДОЙ задачи (скопированы из спецификации):

- Стек: **Vite + vanilla JS (ES-модули) + CSS**. Без React/Vue/Tailwind/Bootstrap. В рантайме никаких UI-/CSS-фреймворков и сетевых запросов.
- **Node 18+** (в окружении Node 22, npm 10).
- **Без озвучки/аудио.**
- **Комментарии в коде — на русском.**
- Главный принцип UX: **смысл несут числа, цвет, форма и движение**; текст дублирует для взрослого. Ребёнок узнаёт цифры, но не читает буквы.
- **touch-first iPad:** тач-цели ≥48px (кнопки-цифры и «Показать» крупнее); никаких взаимодействий только на hover (отклик на `:active`); собственная экранная клавиатура (поля `readonly`); корректный `<meta name="viewport">`; `touch-action`/`user-select:none` на контролах; уважать `prefers-reduced-motion`; адаптив под телефон/планшет/ПК.
- **Ряд величин ×1000:** один(10⁰) → тысяча(10³) → миллион(10⁶) → миллиард(10⁹) → триллион(10¹²) → триллиард(10¹⁵). Сноска для взрослого: строго научно 10¹⁵ — «квадриллион».
- **Цвета разрядов:** сотни — фиолетовый, десятки — бирюзовый, единицы — оранжевый (одинаково во всех блоках).
- **Маскот — Львёнок** (🦁; в задаче стиля можно заменить эмодзи на inline-SVG).
- **PWA:** `manifest` с `display: standalone`, service worker для офлайн.
- **Деплой:** GitHub Pages / VPS по HTTPS.

## Структура файлов

```
Kids_calc/
├── index.html                  # каркас: <meta viewport>, <div id="app">, подключение main.js
├── package.json                # скрипты dev/build/preview/test, зависимости
├── vite.config.js              # конфиг Vite + vite-plugin-pwa + Vitest (jsdom)
├── .gitignore                  # node_modules, dist
├── public/
│   └── icon.svg                # иконка PWA (Львёнок на цветном фоне)
├── src/
│   ├── main.js                 # точка входа: монтирует приложение в #app
│   ├── router.js               # вкладки «Сложение | Величины», переключение разделов
│   ├── style.css               # все стили (токены цветов, touch, адаптив, анимации)
│   ├── core/                   # чистая логика, без DOM
│   │   ├── format.js           # formatGroups(n) — разделители групп по 3
│   │   ├── parse.js            # parseNumber(str), splitDigits(n)
│   │   ├── levels.js           # LEVELS, getLevel, validateOperands, DEFAULT_LEVEL_ID
│   │   ├── addition.js         # computeSum, computeJumps, computeDecomposition
│   │   ├── magnitudes.js       # MAGNITUDES, getMagnitude
│   │   └── compare.js          # compareValues, ratioIfRound, positionOnLadder
│   └── ui/                     # DOM-рендер
│       ├── keypad.js           # createKeypad(...) — экранная клавиатура
│       ├── renderBlocks.js     # блоки по разрядам + перенос
│       ├── renderJumps.js      # числовая прямая + Львёнок
│       ├── renderDecomposition.js  # разложение числа
│       ├── renderPlain.js      # обычная запись примера
│       ├── additionView.js     # сборка раздела «Сложение»
│       ├── renderLadder.js     # лесенка порядков
│       ├── renderCompare.js    # панель сравнения двух чисел
│       └── magnitudesView.js   # сборка раздела «Величины»
└── tests/                      # Vitest
    ├── format.test.js
    ├── parse.test.js
    ├── levels.test.js
    ├── addition.test.js
    ├── magnitudes.test.js
    ├── compare.test.js
    ├── keypad.test.js
    ├── renderBlocks.test.js
    ├── renderJumps.test.js
    ├── renderDecomposition.test.js
    ├── renderPlain.test.js
    ├── additionView.test.js
    ├── renderLadder.test.js
    ├── renderCompare.test.js
    └── magnitudesView.test.js
```

**Уточнения к спецификации (приняты при планировании):**
- Структура `core/` (чистая логика) + `ui/` (рендер) — детализация плоского списка модулей из §10 spec по принципу «split by responsibility».
- Добавлены модули `format.js` (общая утилита форматирования) и `addition.js` (чистая логика прыжков/разложения) для тестируемости.
- Правило валидации суммы: на любом уровне `a + b ≤ 999` (иначе мягкое сообщение «Возьмём числа поменьше 🙂») — чтобы блоки оставались в пределах 9 сотен и визуализация была чистой. Согласуется с §7 spec.

---

## Фаза 0 — Фундамент

### Task 1: Инициализация проекта (Vite + Vitest + git)

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `.gitignore`
- Create: `tests/format.test.js` (smoke-тест появится в Task 2; здесь — проверка, что Vitest запускается)
- Create: `src/core/format.js` (заглушечная функция-якорь для smoke-теста; полноценно — Task 2)

**Interfaces:**
- Produces: рабочие команды `npm run dev`, `npm run build`, `npm test`; смонтированный `#app`.

- [ ] **Step 1: Создать `package.json`**

```json
{
  "name": "kids-math-trainer",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview --host",
    "test": "vitest run"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vitest": "^2.1.0",
    "jsdom": "^25.0.0",
    "vite-plugin-pwa": "^0.20.0"
  }
}
```

- [ ] **Step 2: Установить зависимости**

Run: `npm install`
Expected: создаётся `node_modules/`, `package-lock.json`, без ошибок.

- [ ] **Step 3: Создать `vite.config.js`** (PWA добавим в Task 19; пока базовый конфиг + Vitest с jsdom)

```js
import { defineConfig } from 'vite';

// base: './' — чтобы сборка работала и на GitHub Pages (подпуть), и на VPS.
export default defineConfig({
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 4: Создать `index.html`** (каркас с viewport и точкой монтирования)

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <!-- viewport: запрет масштабирования двойным тапом для tap-управления на iPad -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    />
    <title>Считаем со Львёнком</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Создать `src/core/format.js`** (якорь — расширим в Task 2)

```js
// Форматирование чисел: разделители групп по 3 разряда.
export function formatGroups(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
```

- [ ] **Step 6: Создать `src/main.js`** (минимальное монтирование — расширим в Task 17)

```js
// Точка входа приложения. Полноценная сборка разделов — в Task 17.
const app = document.querySelector('#app');
app.textContent = 'Загрузка…';
```

- [ ] **Step 7: Создать `.gitignore`**

```gitignore
node_modules
dist
.DS_Store
```

- [ ] **Step 8: Создать smoke-тест `tests/format.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { formatGroups } from '../src/core/format.js';

describe('инфраструктура', () => {
  it('Vitest запускается и видит модули core', () => {
    expect(formatGroups(1000)).toBe('1 000');
  });
});
```

- [ ] **Step 9: Запустить тест — убедиться, что проходит**

Run: `npm test`
Expected: PASS, 1 тест зелёный.

- [ ] **Step 10: Проверить dev-сервер и сборку**

Run: `npm run build`
Expected: создаётся `dist/` без ошибок.

- [ ] **Step 11: Инициализировать git и закоммитить**

```bash
git init
git add .
git commit -m "chore: инициализация Vite + Vitest проекта"
```

---

## Фаза 1 — Общая логика (core, строгий TDD)

### Task 2: `format.js` — форматирование чисел

**Files:**
- Modify: `src/core/format.js`
- Test: `tests/format.test.js`

**Interfaces:**
- Produces: `formatGroups(n: number|string) -> string` — вставляет неразрывные пробелы между группами по 3 цифры справа.

- [ ] **Step 1: Дописать тесты в `tests/format.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { formatGroups } from '../src/core/format.js';

describe('formatGroups', () => {
  it('малые числа не меняются', () => {
    expect(formatGroups(5)).toBe('5');
    expect(formatGroups(0)).toBe('0');
    expect(formatGroups(999)).toBe('999');
  });
  it('группирует по 3 разряда', () => {
    expect(formatGroups(1000)).toBe('1 000');
    expect(formatGroups(200000)).toBe('200 000');
    expect(formatGroups(1000000)).toBe('1 000 000');
    expect(formatGroups(1000000000000000)).toBe('1 000 000 000 000 000');
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что проходит** (реализация уже создана в Task 1)

Run: `npx vitest run tests/format.test.js`
Expected: PASS (все 2 блока). Если падает — синхронизировать реализацию из Task 1 Step 5.

- [ ] **Step 3: Коммит**

```bash
git add src/core/format.js tests/format.test.js
git commit -m "feat: formatGroups — разделители групп разрядов"
```

---

### Task 3: `parse.js` — парсинг и разбор на разряды

**Files:**
- Create: `src/core/parse.js`
- Test: `tests/parse.test.js`

**Interfaces:**
- Produces:
  - `parseNumber(str: string) -> { valid: boolean, value: number|null, error: string|null }` — принимает только неотрицательные целые.
  - `splitDigits(n: number) -> { hundreds: number, tens: number, ones: number }` — для `n ∈ [0, 999]`.

- [ ] **Step 1: Написать падающий тест `tests/parse.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { parseNumber, splitDigits } from '../src/core/parse.js';

describe('parseNumber', () => {
  it('принимает целые неотрицательные', () => {
    expect(parseNumber('370')).toEqual({ valid: true, value: 370, error: null });
    expect(parseNumber('0')).toEqual({ valid: true, value: 0, error: null });
    expect(parseNumber('  42 ')).toEqual({ valid: true, value: 42, error: null });
  });
  it('отклоняет пустое, нечисловое и отрицательное', () => {
    expect(parseNumber('').valid).toBe(false);
    expect(parseNumber('abc').valid).toBe(false);
    expect(parseNumber('-5').valid).toBe(false);
    expect(parseNumber('3.5').valid).toBe(false);
    expect(parseNumber('-5').error).toBe('Давай попробуем положительные числа');
  });
});

describe('splitDigits', () => {
  it('разбивает на сотни/десятки/единицы', () => {
    expect(splitDigits(370)).toEqual({ hundreds: 3, tens: 7, ones: 0 });
    expect(splitDigits(8)).toEqual({ hundreds: 0, tens: 0, ones: 8 });
    expect(splitDigits(999)).toEqual({ hundreds: 9, tens: 9, ones: 9 });
    expect(splitDigits(420)).toEqual({ hundreds: 4, tens: 2, ones: 0 });
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/parse.test.js`
Expected: FAIL с "Failed to resolve import" / "parseNumber is not a function".

- [ ] **Step 3: Реализовать `src/core/parse.js`**

```js
// Разбор и валидация введённых чисел.

// Парсит строку в неотрицательное целое. Возвращает результат с признаком valid.
export function parseNumber(str) {
  const trimmed = String(str).trim();
  // Только цифры: отсекает пустое, дробное, отрицательное, буквы.
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, value: null, error: 'Давай попробуем положительные числа' };
  }
  return { valid: true, value: Number(trimmed), error: null };
}

// Разбивает число 0..999 на разряды.
export function splitDigits(n) {
  return {
    hundreds: Math.floor(n / 100),
    tens: Math.floor(n / 10) % 10,
    ones: n % 10,
  };
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/parse.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/core/parse.js tests/parse.test.js
git commit -m "feat: parseNumber и splitDigits"
```

---

### Task 4: `levels.js` — уровни сложности и валидация операндов

**Files:**
- Create: `src/core/levels.js`
- Test: `tests/levels.test.js`

**Interfaces:**
- Produces:
  - `LEVELS: Array<{ id, label, emoji, max, examples: Array<[number, number]> }>`
  - `DEFAULT_LEVEL_ID = 'to999'`
  - `getLevel(id: string) -> level | null`
  - `validateOperands(a: number, b: number, level) -> { valid: boolean, error: string|null }`

- [ ] **Step 1: Написать падающий тест `tests/levels.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { LEVELS, DEFAULT_LEVEL_ID, getLevel, validateOperands } from '../src/core/levels.js';

describe('LEVELS', () => {
  it('три уровня с нужными id и пределами', () => {
    expect(LEVELS.map((l) => l.id)).toEqual(['to20', 'to100', 'to999']);
    expect(getLevel('to20').max).toBe(20);
    expect(getLevel('to100').max).toBe(100);
    expect(getLevel('to999').max).toBe(999);
  });
  it('уровень по умолчанию — до 999, стартовый пример 370+50', () => {
    expect(DEFAULT_LEVEL_ID).toBe('to999');
    expect(getLevel('to999').examples[0]).toEqual([370, 50]);
  });
});

describe('validateOperands', () => {
  const lvl = getLevel('to999');
  it('пропускает корректные', () => {
    expect(validateOperands(370, 50, lvl)).toEqual({ valid: true, error: null });
  });
  it('отклоняет выход за предел уровня', () => {
    const small = getLevel('to20');
    expect(validateOperands(25, 1, small).valid).toBe(false);
    expect(validateOperands(25, 1, small).error).toBe('Возьмём числа поменьше 🙂');
  });
  it('отклоняет сумму больше 999', () => {
    expect(validateOperands(999, 999, lvl).valid).toBe(false);
    expect(validateOperands(999, 999, lvl).error).toBe('Возьмём числа поменьше 🙂');
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/levels.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/core/levels.js`**

```js
// Конфигурация уровней сложности и валидация операндов сложения.

export const LEVELS = [
  { id: 'to20', label: 'До 20', emoji: '🐤', max: 20, examples: [[8, 5], [7, 6], [9, 4]] },
  { id: 'to100', label: 'До 100', emoji: '🐰', max: 100, examples: [[30, 40], [23, 14], [50, 35]] },
  {
    id: 'to999',
    label: 'До 999',
    emoji: '🦉',
    max: 999,
    examples: [[370, 50], [120, 30], [450, 70], [90, 40], [230, 80]],
  },
];

export const DEFAULT_LEVEL_ID = 'to999';

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || null;
}

// Проверяет операнды: неотрицательные, в пределах уровня, сумма ≤ 999 (для чистой визуализации блоков).
export function validateOperands(a, b, level) {
  if (a < 0 || b < 0) {
    return { valid: false, error: 'Давай попробуем положительные числа' };
  }
  if (a > level.max || b > level.max || a + b > 999) {
    return { valid: false, error: 'Возьмём числа поменьше 🙂' };
  }
  return { valid: true, error: null };
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/levels.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/core/levels.js tests/levels.test.js
git commit -m "feat: уровни сложности и валидация операндов"
```

---

### Task 5: `addition.js` — логика прыжков и разложения

**Files:**
- Create: `src/core/addition.js`
- Test: `tests/addition.test.js`

**Interfaces:**
- Consumes: `splitDigits` из `parse.js`.
- Produces:
  - `computeSum(a, b) -> number`
  - `computeJumps(a, b) -> { start: number, end: number, jumps: Array<{ from, to, delta }> }` — прыжки по 10, затем один до-прыжок на остаток единиц.
  - `computeDecomposition(a, b) -> { aH, aRest, bH, bRest, restSum, hundredSum, total }`

- [ ] **Step 1: Написать падающий тест `tests/addition.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { computeSum, computeJumps, computeDecomposition } from '../src/core/addition.js';

describe('computeSum', () => {
  it('складывает', () => {
    expect(computeSum(370, 50)).toBe(420);
  });
});

describe('computeJumps', () => {
  it('370 + 50 — пять прыжков по 10', () => {
    const r = computeJumps(370, 50);
    expect(r.start).toBe(370);
    expect(r.end).toBe(420);
    expect(r.jumps).toEqual([
      { from: 370, to: 380, delta: 10 },
      { from: 380, to: 390, delta: 10 },
      { from: 390, to: 400, delta: 10 },
      { from: 400, to: 410, delta: 10 },
      { from: 410, to: 420, delta: 10 },
    ]);
  });
  it('23 + 14 — прыжок по 10 и до-прыжок на 4', () => {
    const r = computeJumps(23, 14);
    expect(r.jumps).toEqual([
      { from: 23, to: 33, delta: 10 },
      { from: 33, to: 37, delta: 4 },
    ]);
    expect(r.end).toBe(37);
  });
  it('8 + 5 — один до-прыжок на 5', () => {
    const r = computeJumps(8, 5);
    expect(r.jumps).toEqual([{ from: 8, to: 13, delta: 5 }]);
  });
});

describe('computeDecomposition', () => {
  it('370 + 50 = 420 по разрядам', () => {
    expect(computeDecomposition(370, 50)).toEqual({
      aH: 300, aRest: 70, bH: 0, bRest: 50, restSum: 120, hundredSum: 300, total: 420,
    });
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/addition.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/core/addition.js`**

```js
// Чистая логика сложения: прыжки по числовой прямой и поразрядное разложение.

export function computeSum(a, b) {
  return a + b;
}

// Прыжки: сначала по +10 (целые десятки второго числа), затем один прыжок на остаток единиц.
export function computeJumps(a, b) {
  const jumps = [];
  let cur = a;
  const tenCount = Math.floor(b / 10);
  for (let i = 0; i < tenCount; i++) {
    jumps.push({ from: cur, to: cur + 10, delta: 10 });
    cur += 10;
  }
  const ones = b % 10;
  if (ones > 0) {
    jumps.push({ from: cur, to: cur + ones, delta: ones });
    cur += ones;
  }
  return { start: a, end: cur, jumps };
}

// Разложение: число = сотни + остаток(<100). Складываем остатки, затем прибавляем сотни.
// Пример: 370 + 50 -> 300+70 и 50; 70+50=120; 300+120=420.
export function computeDecomposition(a, b) {
  const aH = Math.floor(a / 100) * 100;
  const aRest = a % 100;
  const bH = Math.floor(b / 100) * 100;
  const bRest = b % 100;
  return {
    aH,
    aRest,
    bH,
    bRest,
    restSum: aRest + bRest,
    hundredSum: aH + bH,
    total: a + b,
  };
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/addition.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/core/addition.js tests/addition.test.js
git commit -m "feat: логика прыжков и разложения"
```

---

### Task 6: `magnitudes.js` — ряд величин

**Files:**
- Create: `src/core/magnitudes.js`
- Test: `tests/magnitudes.test.js`

**Interfaces:**
- Produces:
  - `MAGNITUDES: Array<{ name: string, power: number, value: number, zeros: number }>` — отсортирован по возрастанию: один, тысяча, миллион, миллиард, триллион, триллиард.
  - `getMagnitude(name: string) -> magnitude | null`

- [ ] **Step 1: Написать падающий тест `tests/magnitudes.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { MAGNITUDES, getMagnitude } from '../src/core/magnitudes.js';

describe('MAGNITUDES', () => {
  it('ряд ×1000 от единицы до триллиарда', () => {
    expect(MAGNITUDES.map((m) => m.name)).toEqual([
      'один', 'тысяча', 'миллион', 'миллиард', 'триллион', 'триллиард',
    ]);
  });
  it('каждый следующий в 1000 раз больше', () => {
    for (let i = 1; i < MAGNITUDES.length; i++) {
      expect(MAGNITUDES[i].value).toBe(MAGNITUDES[i - 1].value * 1000);
    }
  });
  it('триллиард = 10^15', () => {
    expect(getMagnitude('триллиард').value).toBe(1000000000000000);
    expect(getMagnitude('триллиард').zeros).toBe(15);
  });
  it('getMagnitude неизвестного — null', () => {
    expect(getMagnitude('квинтиллион')).toBe(null);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/magnitudes.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/core/magnitudes.js`**

```js
// Ряд величин (обиходный ×1000). Сноска для взрослого: 10^15 строго научно — «квадриллион».
// Цвета ступеней задаются в CSS по классу ladder-step--<name>, чтобы данные оставались чистыми.
export const MAGNITUDES = [
  { name: 'один', power: 0, value: 1, zeros: 0 },
  { name: 'тысяча', power: 3, value: 1000, zeros: 3 },
  { name: 'миллион', power: 6, value: 1000000, zeros: 6 },
  { name: 'миллиард', power: 9, value: 1000000000, zeros: 9 },
  { name: 'триллион', power: 12, value: 1000000000000, zeros: 12 },
  { name: 'триллиард', power: 15, value: 1000000000000000, zeros: 15 },
];

export function getMagnitude(name) {
  return MAGNITUDES.find((m) => m.name === name) || null;
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/magnitudes.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/core/magnitudes.js tests/magnitudes.test.js
git commit -m "feat: ряд величин до триллиарда"
```

---

### Task 7: `compare.js` — логика сравнения величин

**Files:**
- Create: `src/core/compare.js`
- Test: `tests/compare.test.js`

**Interfaces:**
- Consumes: `MAGNITUDES` из `magnitudes.js`.
- Produces:
  - `compareValues(a, b) -> { bigger: 'a'|'b'|'equal', sign: '>'|'<'|'=' }`
  - `ratioIfRound(a, b, magnitudes) -> { times: number } | null` — кратное, только если оба числа — значения ряда.
  - `positionOnLadder(value, magnitudes) -> { exactIndex: number } | { belowIndex: number|null, aboveIndex: number|null }`

- [ ] **Step 1: Написать падающий тест `tests/compare.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { compareValues, ratioIfRound, positionOnLadder } from '../src/core/compare.js';
import { MAGNITUDES } from '../src/core/magnitudes.js';

describe('compareValues', () => {
  it('определяет большее и знак', () => {
    expect(compareValues(1000000, 1000000000000)).toEqual({ bigger: 'b', sign: '<' });
    expect(compareValues(1000000000, 200000)).toEqual({ bigger: 'a', sign: '>' });
    expect(compareValues(5, 5)).toEqual({ bigger: 'equal', sign: '=' });
  });
});

describe('ratioIfRound', () => {
  it('кратное для двух величин ряда', () => {
    expect(ratioIfRound(1000000000000, 1000000, MAGNITUDES)).toEqual({ times: 1000000 });
  });
  it('null, если число не из ряда', () => {
    expect(ratioIfRound(200000, 1000000000, MAGNITUDES)).toBe(null);
  });
});

describe('positionOnLadder', () => {
  it('точное совпадение с величиной', () => {
    expect(positionOnLadder(1000000, MAGNITUDES)).toEqual({ exactIndex: 2 });
  });
  it('200000 — между тысячей (1) и миллионом (2)', () => {
    expect(positionOnLadder(200000, MAGNITUDES)).toEqual({ belowIndex: 1, aboveIndex: 2 });
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/compare.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/core/compare.js`**

```js
// Логика сравнения величин для раздела «Соотношение величин».

export function compareValues(a, b) {
  if (a > b) return { bigger: 'a', sign: '>' };
  if (a < b) return { bigger: 'b', sign: '<' };
  return { bigger: 'equal', sign: '=' };
}

// Кратное «во сколько раз», только если ОБА числа — точные значения ряда величин.
export function ratioIfRound(a, b, magnitudes) {
  const isRound = (v) => magnitudes.some((m) => m.value === v);
  if (a === 0 || b === 0 || !isRound(a) || !isRound(b)) return null;
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  return { times: big / small };
}

// Позиция произвольного числа на лесенке: точная ступень либо между belowIndex и aboveIndex.
export function positionOnLadder(value, magnitudes) {
  const exact = magnitudes.findIndex((m) => m.value === value);
  if (exact !== -1) return { exactIndex: exact };

  let belowIndex = null;
  for (let i = 0; i < magnitudes.length; i++) {
    if (magnitudes[i].value < value) belowIndex = i;
  }
  const aboveIndex =
    belowIndex !== null && belowIndex + 1 < magnitudes.length ? belowIndex + 1 : null;
  return { belowIndex, aboveIndex };
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/compare.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/core/compare.js tests/compare.test.js
git commit -m "feat: логика сравнения величин"
```

---

## Фаза 2 — Общий UI

### Task 8: `keypad.js` — экранная клавиатура

**Files:**
- Create: `src/ui/keypad.js`
- Test: `tests/keypad.test.js`

**Interfaces:**
- Produces: `createKeypad({ onDigit, onDelete, onClear }) -> HTMLElement` — контейнер `.keypad` с кнопками 0–9, `⌫` (delete), `C` (clear). Кнопки `type="button"`, класс `.keypad__key`; служебные — `.keypad__key--action`.

- [ ] **Step 1: Написать падающий тест `tests/keypad.test.js`**

```js
import { describe, it, expect, vi } from 'vitest';
import { createKeypad } from '../src/ui/keypad.js';

describe('createKeypad', () => {
  it('создаёт 12 кнопок (10 цифр + удалить + очистить)', () => {
    const el = createKeypad({ onDigit() {}, onDelete() {}, onClear() {} });
    expect(el.querySelectorAll('button').length).toBe(12);
  });
  it('клик по цифре вызывает onDigit с этой цифрой', () => {
    const onDigit = vi.fn();
    const el = createKeypad({ onDigit, onDelete() {}, onClear() {} });
    const seven = [...el.querySelectorAll('.keypad__key')].find((b) => b.textContent === '7');
    seven.click();
    expect(onDigit).toHaveBeenCalledWith('7');
  });
  it('вызывает onDelete и onClear', () => {
    const onDelete = vi.fn();
    const onClear = vi.fn();
    const el = createKeypad({ onDigit() {}, onDelete, onClear });
    el.querySelector('[data-action="delete"]').click();
    el.querySelector('[data-action="clear"]').click();
    expect(onDelete).toHaveBeenCalled();
    expect(onClear).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/keypad.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/keypad.js`**

```js
// Экранная цифровая клавиатура. Используется и в калькуляторе, и в сравнении величин.
export function createKeypad({ onDigit, onDelete, onClear }) {
  const el = document.createElement('div');
  el.className = 'keypad';

  // Цифры 1..9, затем 0.
  for (const d of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'keypad__key';
    b.textContent = d;
    b.addEventListener('click', () => onDigit(d));
    el.appendChild(b);
  }

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'keypad__key keypad__key--action';
  del.dataset.action = 'delete';
  del.textContent = '⌫';
  del.addEventListener('click', () => onDelete());
  el.appendChild(del);

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'keypad__key keypad__key--action';
  clear.dataset.action = 'clear';
  clear.textContent = 'C';
  clear.addEventListener('click', () => onClear());
  el.appendChild(clear);

  return el;
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/keypad.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/ui/keypad.js tests/keypad.test.js
git commit -m "feat: экранная клавиатура"
```

---

## Фаза 3 — Раздел «Сложение»

### Task 9: `renderBlocks.js` — блоки по разрядам

**Files:**
- Create: `src/ui/renderBlocks.js`
- Test: `tests/renderBlocks.test.js`

**Interfaces:**
- Consumes: `splitDigits` из `parse.js`.
- Produces: `renderBlocks(container: HTMLElement, a: number, b: number) -> void` — очищает контейнер и рисует:
  - группу слагаемого A (`.blocks__addend` с блоками),
  - группу слагаемого B,
  - группу итога (`.blocks__total`) с разрядами суммы.
  - Блоки: `.block--hundred`, `.block--ten`, `.block--one`. Итоговая группа помечается классом `.is-result`.

- [ ] **Step 1: Написать падающий тест `tests/renderBlocks.test.js`**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderBlocks } from '../src/ui/renderBlocks.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderBlocks', () => {
  it('рисует разрядные блоки для слагаемого 370', () => {
    renderBlocks(container, 370, 50);
    const a = container.querySelector('.blocks__addend');
    expect(a.querySelectorAll('.block--hundred').length).toBe(3);
    expect(a.querySelectorAll('.block--ten').length).toBe(7);
    expect(a.querySelectorAll('.block--one').length).toBe(0);
  });
  it('рисует итог 420: 4 сотни, 2 десятка', () => {
    renderBlocks(container, 370, 50);
    const total = container.querySelector('.blocks__total');
    expect(total.querySelectorAll('.block--hundred').length).toBe(4);
    expect(total.querySelectorAll('.block--ten').length).toBe(2);
  });
  it('перерисовка очищает прошлый результат', () => {
    renderBlocks(container, 370, 50);
    renderBlocks(container, 8, 5);
    expect(container.querySelectorAll('.blocks__addend').length).toBe(2);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/renderBlocks.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/renderBlocks.js`**

```js
import { splitDigits } from '../core/parse.js';

// Создаёт N блоков указанного разряда внутри группы.
function appendBlocks(group, count, kind) {
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = `block block--${kind}`;
    group.appendChild(b);
  }
}

// Рисует группу разрядных блоков для одного числа.
function buildGroup(n, className) {
  const group = document.createElement('div');
  group.className = className;
  const { hundreds, tens, ones } = splitDigits(n);
  appendBlocks(group, hundreds, 'hundred');
  appendBlocks(group, tens, 'ten');
  appendBlocks(group, ones, 'one');
  return group;
}

// Блоки по разрядам: A, B и итог суммы. Анимация переноса (CSS) навешивается классом is-result.
export function renderBlocks(container, a, b) {
  container.innerHTML = '';
  container.appendChild(buildGroup(a, 'blocks__addend'));
  container.appendChild(buildGroup(b, 'blocks__addend'));
  const total = buildGroup(a + b, 'blocks__total is-result');
  container.appendChild(total);
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/renderBlocks.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/ui/renderBlocks.js tests/renderBlocks.test.js
git commit -m "feat: блоки по разрядам"
```

---

### Task 10: `renderJumps.js` — числовая прямая и Львёнок

**Files:**
- Create: `src/ui/renderJumps.js`
- Test: `tests/renderJumps.test.js`

**Interfaces:**
- Consumes: `computeJumps` из `addition.js`.
- Produces: `renderJumps(container, a, b) -> void` — рисует числовую прямую с подписанными точками (старт + каждая `jump.to`), дуги прыжков (`.jump` с подписью `+10`/`+N`) и маскота `.mascot` (🦁).

- [ ] **Step 1: Написать падающий тест `tests/renderJumps.test.js`**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderJumps } from '../src/ui/renderJumps.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderJumps', () => {
  it('370+50: 6 точек (старт + 5) и 5 дуг', () => {
    renderJumps(container, 370, 50);
    expect(container.querySelectorAll('.numline__point').length).toBe(6);
    expect(container.querySelectorAll('.jump').length).toBe(5);
  });
  it('подписывает крайние точки числами', () => {
    renderJumps(container, 370, 50);
    const points = [...container.querySelectorAll('.numline__point')];
    expect(points[0].textContent).toContain('370');
    expect(points[points.length - 1].textContent).toContain('420');
  });
  it('содержит маскота-Львёнка', () => {
    renderJumps(container, 370, 50);
    expect(container.querySelector('.mascot')).not.toBeNull();
  });
  it('23+14: 3 точки и 2 дуги (+10, +4)', () => {
    renderJumps(container, 23, 14);
    expect(container.querySelectorAll('.numline__point').length).toBe(3);
    const labels = [...container.querySelectorAll('.jump')].map((j) => j.textContent);
    expect(labels).toEqual(['+10', '+4']);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/renderJumps.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/renderJumps.js`**

```js
import { computeJumps } from '../core/addition.js';

// Числовая прямая с прыжками по 10 и маскотом-Львёнком.
export function renderJumps(container, a, b) {
  container.innerHTML = '';
  const { jumps } = computeJumps(a, b);

  // Маскот.
  const mascot = document.createElement('div');
  mascot.className = 'mascot';
  mascot.textContent = '🦁';
  container.appendChild(mascot);

  // Линия с точками и дугами.
  const line = document.createElement('div');
  line.className = 'numline';

  // Точки: стартовая, затем конец каждого прыжка.
  const values = [a, ...jumps.map((j) => j.to)];
  values.forEach((v, i) => {
    const point = document.createElement('div');
    point.className = 'numline__point';
    point.textContent = String(v);
    line.appendChild(point);

    // Дуга после точки (кроме последней).
    if (i < jumps.length) {
      const arc = document.createElement('div');
      arc.className = 'jump';
      arc.textContent = `+${jumps[i].delta}`;
      line.appendChild(arc);
    }
  });

  container.appendChild(line);
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/renderJumps.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/ui/renderJumps.js tests/renderJumps.test.js
git commit -m "feat: числовая прямая и прыжки Львёнка"
```

---

### Task 11: `renderDecomposition.js` — разложение числа

**Files:**
- Create: `src/ui/renderDecomposition.js`
- Test: `tests/renderDecomposition.test.js`

**Interfaces:**
- Consumes: `computeDecomposition` из `addition.js`.
- Produces: `renderDecomposition(container, a, b) -> void` — строки разложения в элементах `.decomp__row`: разложение A, разложение B, сумма остатков, итог.

- [ ] **Step 1: Написать падающий тест `tests/renderDecomposition.test.js`**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderDecomposition } from '../src/ui/renderDecomposition.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderDecomposition', () => {
  it('370 + 50: показывает разрядные шаги и итог', () => {
    renderDecomposition(container, 370, 50);
    const text = container.textContent;
    expect(text).toContain('370 = 300 + 70');
    expect(text).toContain('50 = 50');
    expect(text).toContain('70 + 50 = 120');
    expect(text).toContain('300 + 120 = 420');
  });
  it('создаёт строки .decomp__row', () => {
    renderDecomposition(container, 370, 50);
    expect(container.querySelectorAll('.decomp__row').length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/renderDecomposition.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/renderDecomposition.js`**

```js
import { computeDecomposition } from '../core/addition.js';

function addRow(container, text) {
  const row = document.createElement('div');
  row.className = 'decomp__row';
  row.textContent = text;
  container.appendChild(row);
}

// Разложение числа по разрядам: показывает шаги от частей к итогу.
export function renderDecomposition(container, a, b) {
  container.innerHTML = '';
  const d = computeDecomposition(a, b);

  // Разложение A: «370 = 300 + 70» либо «50 = 50», если сотен нет.
  addRow(container, a >= 100 ? `${a} = ${d.aH} + ${d.aRest}` : `${a} = ${a}`);
  addRow(container, b >= 100 ? `${b} = ${d.bH} + ${d.bRest}` : `${b} = ${b}`);

  // Сумма остатков и финальное сложение сотен с остатками.
  addRow(container, `${d.aRest} + ${d.bRest} = ${d.restSum}`);
  addRow(container, `${d.hundredSum} + ${d.restSum} = ${d.total}`);
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/renderDecomposition.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/ui/renderDecomposition.js tests/renderDecomposition.test.js
git commit -m "feat: разложение числа"
```

---

### Task 12: `renderPlain.js` — обычная запись примера

**Files:**
- Create: `src/ui/renderPlain.js`
- Test: `tests/renderPlain.test.js`

**Interfaces:**
- Produces: `renderPlain(container, a, b) -> void` — итоговая строка `a + b = sum` в `.plain`.

- [ ] **Step 1: Написать падающий тест `tests/renderPlain.test.js`**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderPlain } from '../src/ui/renderPlain.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderPlain', () => {
  it('пишет пример с ответом', () => {
    renderPlain(container, 370, 50);
    expect(container.querySelector('.plain').textContent).toBe('370 + 50 = 420');
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/renderPlain.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/renderPlain.js`**

```js
// Обычная запись примера — итоговый шаг объяснения.
export function renderPlain(container, a, b) {
  container.innerHTML = '';
  const line = document.createElement('div');
  line.className = 'plain';
  line.textContent = `${a} + ${b} = ${a + b}`;
  container.appendChild(line);
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/renderPlain.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/ui/renderPlain.js tests/renderPlain.test.js
git commit -m "feat: обычная запись примера"
```

---

### Task 13: `additionView.js` — сборка раздела «Сложение»

**Files:**
- Create: `src/ui/additionView.js`
- Test: `tests/additionView.test.js`

**Interfaces:**
- Consumes: `createKeypad` (keypad.js), `LEVELS`/`getLevel`/`DEFAULT_LEVEL_ID`/`validateOperands` (levels.js), `parseNumber` (parse.js), `computeSum` (addition.js), `renderBlocks`/`renderJumps`/`renderDecomposition`/`renderPlain`.
- Produces: `createAdditionView() -> { el: HTMLElement, setExample(a, b): void, setLevel(id): void, show(): void }`.
  - `el` содержит: переключатель уровней `.levels`, поля ввода `.operand` (A и B, `readonly`), кнопку «Показать» `.show-btn`, кнопки-примеры `.examples`, область ответа `.answer`, четыре блока шагов `.step` (blocks/jumps/decomp/plain), область сообщения `.message`.
  - Активный слот ввода подсвечивается; экранная клавиатура пишет в активный слот.
  - `setExample(a, b)` подставляет числа; `show()` валидирует и рисует все шаги; при ошибке валидации — текст в `.message`, шаги очищаются.
  - Стартовое состояние: уровень `to999`, пример `370 + 50` уже показан.

- [ ] **Step 1: Написать падающий тест `tests/additionView.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { createAdditionView } from '../src/ui/additionView.js';

describe('createAdditionView', () => {
  it('стартует с примером 370 + 50 и ответом 420', () => {
    const view = createAdditionView();
    expect(view.el.querySelector('.answer').textContent).toContain('420');
    expect(view.el.querySelector('.step--blocks .blocks__total')).not.toBeNull();
  });
  it('setExample + show обновляет ответ', () => {
    const view = createAdditionView();
    view.setExample(120, 30);
    view.show();
    expect(view.el.querySelector('.answer').textContent).toContain('150');
  });
  it('показывает переключатель из трёх уровней', () => {
    const view = createAdditionView();
    expect(view.el.querySelectorAll('.levels__btn').length).toBe(3);
  });
  it('сумма > 999 даёт мягкое сообщение и не рисует ответ-блоки', () => {
    const view = createAdditionView();
    view.setExample(999, 999);
    view.show();
    expect(view.el.querySelector('.message').textContent).toBe('Возьмём числа поменьше 🙂');
    expect(view.el.querySelector('.step--blocks').children.length).toBe(0);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/additionView.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/additionView.js`**

```js
import { createKeypad } from './keypad.js';
import { LEVELS, getLevel, DEFAULT_LEVEL_ID, validateOperands } from '../core/levels.js';
import { computeSum } from '../core/addition.js';
import { renderBlocks } from './renderBlocks.js';
import { renderJumps } from './renderJumps.js';
import { renderDecomposition } from './renderDecomposition.js';
import { renderPlain } from './renderPlain.js';

// Раздел «Сложение»: ввод, уровни, примеры и четыре блока наглядного объяснения.
export function createAdditionView() {
  let levelId = DEFAULT_LEVEL_ID;
  let active = 'a'; // активный слот ввода для клавиатуры
  const value = { a: '370', b: '50' };

  const el = document.createElement('section');
  el.className = 'view view--addition';

  // --- Переключатель уровней ---
  const levels = document.createElement('div');
  levels.className = 'levels';
  for (const lvl of LEVELS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'levels__btn';
    btn.dataset.level = lvl.id;
    btn.textContent = `${lvl.emoji} ${lvl.label}`;
    btn.addEventListener('click', () => setLevel(lvl.id));
    levels.appendChild(btn);
  }
  el.appendChild(levels);

  // --- Поля ввода A + B ---
  const inputs = document.createElement('div');
  inputs.className = 'inputs';
  const inA = makeOperand('a');
  const plus = document.createElement('div');
  plus.className = 'inputs__plus';
  plus.textContent = '+';
  const inB = makeOperand('b');
  const showBtn = document.createElement('button');
  showBtn.type = 'button';
  showBtn.className = 'show-btn';
  showBtn.textContent = 'Показать';
  showBtn.addEventListener('click', show);
  inputs.append(inA, plus, inB, showBtn);
  el.appendChild(inputs);

  function makeOperand(slot) {
    const f = document.createElement('div');
    f.className = 'operand';
    f.dataset.slot = slot;
    f.addEventListener('click', () => setActive(slot));
    return f;
  }

  // --- Экранная клавиатура ---
  const keypad = createKeypad({
    onDigit(d) {
      // Ограничение длины — 3 цифры (до 999).
      if (value[active].length >= 3) value[active] = '';
      value[active] = String(Number(value[active] + d)); // убирает ведущие нули
      syncInputs();
    },
    onDelete() {
      value[active] = value[active].slice(0, -1);
      syncInputs();
    },
    onClear() {
      value[active] = '';
      syncInputs();
    },
  });
  el.appendChild(keypad);

  // --- Кнопки-примеры ---
  const examples = document.createElement('div');
  examples.className = 'examples';
  el.appendChild(examples);

  // --- Ответ и сообщение ---
  const answer = document.createElement('div');
  answer.className = 'answer';
  const message = document.createElement('div');
  message.className = 'message';
  el.append(answer, message);

  // --- Четыре блока объяснения ---
  const stepBlocks = makeStep('blocks');
  const stepJumps = makeStep('jumps');
  const stepDecomp = makeStep('decomp');
  const stepPlain = makeStep('plain');
  el.append(stepBlocks, stepJumps, stepDecomp, stepPlain);

  function makeStep(kind) {
    const s = document.createElement('div');
    s.className = `step step--${kind}`;
    return s;
  }

  // --- Логика ---
  function setActive(slot) {
    active = slot;
    syncInputs();
  }

  function syncInputs() {
    for (const f of inputs.querySelectorAll('.operand')) {
      const slot = f.dataset.slot;
      f.textContent = value[slot] === '' ? '0' : value[slot];
      f.classList.toggle('is-active', slot === active);
    }
  }

  function setLevel(id) {
    levelId = id;
    for (const btn of levels.querySelectorAll('.levels__btn')) {
      btn.classList.toggle('is-active', btn.dataset.level === id);
    }
    renderExamples();
  }

  function renderExamples() {
    examples.innerHTML = '';
    for (const [a, b] of getLevel(levelId).examples) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'examples__btn';
      btn.textContent = `${a} + ${b}`;
      btn.addEventListener('click', () => {
        setExample(a, b);
        show();
      });
      examples.appendChild(btn);
    }
  }

  function setExample(a, b) {
    value.a = String(a);
    value.b = String(b);
    syncInputs();
  }

  function clearSteps() {
    for (const s of [stepBlocks, stepJumps, stepDecomp, stepPlain]) s.innerHTML = '';
  }

  function show() {
    const a = Number(value.a || '0');
    const b = Number(value.b || '0');
    const check = validateOperands(a, b, getLevel(levelId));
    if (!check.valid) {
      message.textContent = check.error;
      answer.textContent = '';
      clearSteps();
      return;
    }
    message.textContent = '';
    answer.textContent = String(computeSum(a, b));
    renderBlocks(stepBlocks, a, b);
    renderJumps(stepJumps, a, b);
    renderDecomposition(stepDecomp, a, b);
    renderPlain(stepPlain, a, b);
  }

  // --- Старт ---
  setLevel(levelId);
  syncInputs();
  show();

  return { el, setExample, setLevel, show };
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/additionView.test.js`
Expected: PASS.

- [ ] **Step 5: Запустить весь набор тестов**

Run: `npm test`
Expected: PASS, все тесты Фаз 0–3 зелёные.

- [ ] **Step 6: Коммит**

```bash
git add src/ui/additionView.js tests/additionView.test.js
git commit -m "feat: сборка раздела Сложение"
```

---

## Фаза 4 — Раздел «Величины»

### Task 14: `renderLadder.js` — лесенка порядков

**Files:**
- Create: `src/ui/renderLadder.js`
- Test: `tests/renderLadder.test.js`

**Interfaces:**
- Consumes: `MAGNITUDES` (magnitudes.js), `formatGroups` (format.js).
- Produces: `renderLadder(container, { highlight = [], markers = [] } = {}) -> void` — рисует ступени снизу вверх (триллиард сверху). Каждая ступень — `.ladder-step` с классом `.ladder-step--<name>`, содержит название, число (через `formatGroups`) и метку `×1000` между ступенями. `highlight` — массив имён величин для подсветки (класс `.is-highlight`). `markers` — массив `{ value, belowIndex, aboveIndex }` (индексы в исходном порядке `MAGNITUDES`); каждый рисует плашку `.ladder__marker` с числом, вставленную между соответствующими ступенями.

- [ ] **Step 1: Написать падающий тест `tests/renderLadder.test.js`**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderLadder } from '../src/ui/renderLadder.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderLadder', () => {
  it('рисует 6 ступеней, триллиард сверху, один снизу', () => {
    renderLadder(container);
    const steps = [...container.querySelectorAll('.ladder-step')];
    expect(steps.length).toBe(6);
    expect(steps[0].textContent).toContain('триллиард');
    expect(steps[steps.length - 1].textContent).toContain('один');
  });
  it('форматирует число миллиона с разделителями', () => {
    renderLadder(container);
    const mil = container.querySelector('.ladder-step--миллион');
    expect(mil.textContent).toContain('1 000 000');
  });
  it('подсвечивает указанные величины', () => {
    renderLadder(container, { highlight: ['миллиард'] });
    expect(container.querySelector('.ladder-step--миллиард').classList.contains('is-highlight')).toBe(true);
  });
  it('рисует плашку произвольного числа между ступенями', () => {
    // 200000 находится между тысячей (idx 1) и миллионом (idx 2)
    renderLadder(container, { markers: [{ value: 200000, belowIndex: 1, aboveIndex: 2 }] });
    const marker = container.querySelector('.ladder__marker');
    expect(marker).not.toBeNull();
    expect(marker.textContent).toContain('200 000');
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/renderLadder.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/renderLadder.js`**

```js
import { MAGNITUDES } from '../core/magnitudes.js';
import { formatGroups } from '../core/format.js';

// Лесенка порядков: триллиард сверху, один снизу. Между ступенями — метка ×1000
// и (при наличии) плашки произвольных чисел из режима сравнения.
export function renderLadder(container, { highlight = [], markers = [] } = {}) {
  container.innerHTML = '';
  const ladder = document.createElement('div');
  ladder.className = 'ladder';

  // Сверху вниз: от большего к меньшему.
  const ordered = [...MAGNITUDES].reverse();
  ordered.forEach((m, i) => {
    const origIdx = MAGNITUDES.length - 1 - i; // индекс в исходном (возрастающем) порядке

    const step = document.createElement('div');
    step.className = `ladder-step ladder-step--${m.name}`;
    if (highlight.includes(m.name)) step.classList.add('is-highlight');

    const name = document.createElement('span');
    name.className = 'ladder-step__name';
    name.textContent = m.name;

    const num = document.createElement('span');
    num.className = 'ladder-step__num';
    num.textContent = formatGroups(m.value);

    step.append(name, num);
    ladder.appendChild(step);

    // Плашки произвольных чисел: вставляем под ступенью, которая является верхней границей (aboveIndex).
    for (const mk of markers) {
      if (mk.aboveIndex === origIdx) {
        const marker = document.createElement('div');
        marker.className = 'ladder__marker';
        marker.textContent = formatGroups(mk.value);
        ladder.appendChild(marker);
      }
    }

    // Метка ×1000 между ступенями (не после последней).
    if (i < ordered.length - 1) {
      const mult = document.createElement('div');
      mult.className = 'ladder__mult';
      mult.textContent = '×1000';
      ladder.appendChild(mult);
    }
  });

  container.appendChild(ladder);
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/renderLadder.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/ui/renderLadder.js tests/renderLadder.test.js
git commit -m "feat: лесенка порядков"
```

---

### Task 15: `renderCompare.js` — панель сравнения

**Files:**
- Create: `src/ui/renderCompare.js`
- Test: `tests/renderCompare.test.js`

**Interfaces:**
- Consumes: `compareValues`/`ratioIfRound` (compare.js), `MAGNITUDES` (magnitudes.js), `formatGroups` (format.js).
- Produces: `renderVerdict(container, valueA, valueB) -> void` — рисует вердикт сравнения двух чисел: знак (`.verdict__sign`), указание большего со стрелкой (`.verdict__bigger`) и, если оба — круглые величины ряда, кратное (`.verdict__ratio`, текст «в N раз больше»). При равенстве — `.verdict__equal`.

- [ ] **Step 1: Написать падающий тест `tests/renderCompare.test.js`**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderVerdict } from '../src/ui/renderCompare.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderVerdict', () => {
  it('миллион vs триллион: триллион больше, знак <', () => {
    renderVerdict(container, 1000000, 1000000000000);
    expect(container.querySelector('.verdict__sign').textContent).toBe('<');
    expect(container.querySelector('.verdict__ratio').textContent).toContain('1 000 000');
  });
  it('200000 vs миллиард: миллиард больше, без кратного', () => {
    renderVerdict(container, 200000, 1000000000);
    expect(container.querySelector('.verdict__sign').textContent).toBe('<');
    expect(container.querySelector('.verdict__ratio')).toBeNull();
  });
  it('равные числа', () => {
    renderVerdict(container, 1000, 1000);
    expect(container.querySelector('.verdict__equal')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/renderCompare.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/renderCompare.js`**

```js
import { compareValues, ratioIfRound } from '../core/compare.js';
import { MAGNITUDES } from '../core/magnitudes.js';
import { formatGroups } from '../core/format.js';

// Вердикт сравнения двух чисел: знак, кто больше (стрелка) и кратное для круглых величин.
export function renderVerdict(container, valueA, valueB) {
  container.innerHTML = '';
  const { bigger, sign } = compareValues(valueA, valueB);

  const signEl = document.createElement('div');
  signEl.className = 'verdict__sign';
  signEl.textContent = sign;
  container.appendChild(signEl);

  if (bigger === 'equal') {
    const eq = document.createElement('div');
    eq.className = 'verdict__equal';
    eq.textContent = 'Поровну!';
    container.appendChild(eq);
    return;
  }

  const biggerValue = bigger === 'a' ? valueA : valueB;
  const arrow = document.createElement('div');
  arrow.className = 'verdict__bigger';
  arrow.textContent = `${bigger === 'a' ? '⬅' : '➡'} ${formatGroups(biggerValue)} больше`;
  container.appendChild(arrow);

  // Кратное — только если оба числа точные величины ряда.
  const ratio = ratioIfRound(valueA, valueB, MAGNITUDES);
  if (ratio) {
    const r = document.createElement('div');
    r.className = 'verdict__ratio';
    r.textContent = `в ${formatGroups(ratio.times)} раз больше`;
    container.appendChild(r);
  }
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/renderCompare.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/ui/renderCompare.js tests/renderCompare.test.js
git commit -m "feat: вердикт сравнения величин"
```

---

### Task 16: `magnitudesView.js` — сборка раздела «Величины»

**Files:**
- Create: `src/ui/magnitudesView.js`
- Test: `tests/magnitudesView.test.js`

**Interfaces:**
- Consumes: `renderLadder` (renderLadder.js), `renderVerdict` (renderCompare.js), `createKeypad` (keypad.js), `MAGNITUDES` (magnitudes.js), `positionOnLadder` (compare.js), `parseNumber` (parse.js).
- Produces: `createMagnitudesView() -> { el: HTMLElement }`.
  - `el` содержит: лесенку `.ladder-host`, два слота сравнения `.slot` (A и B, `.slot--a`/`.slot--b`), кнопки-величины `.mag-chips` (быстрый выбор из ряда), экранную клавиатуру для произвольного числа, область вердикта `.verdict`.
  - Тап по слоту делает его активным; тап по чипу величины кладёт её значение в активный слот; клавиатура вводит произвольное число в активный слот.
  - Как только оба слота заполнены — рисуется вердикт и подсветка позиций на лесенке.

- [ ] **Step 1: Написать падающий тест `tests/magnitudesView.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { createMagnitudesView } from '../src/ui/magnitudesView.js';

describe('createMagnitudesView', () => {
  it('рисует лесенку из 6 ступеней', () => {
    const view = createMagnitudesView();
    expect(view.el.querySelectorAll('.ladder-step').length).toBe(6);
  });
  it('два слота сравнения и чипы величин', () => {
    const view = createMagnitudesView();
    expect(view.el.querySelector('.slot--a')).not.toBeNull();
    expect(view.el.querySelector('.slot--b')).not.toBeNull();
    expect(view.el.querySelectorAll('.mag-chips__chip').length).toBe(6);
  });
  it('выбор двух величин показывает вердикт', () => {
    const view = createMagnitudesView();
    const chips = [...view.el.querySelectorAll('.mag-chips__chip')];
    const million = chips.find((c) => c.dataset.name === 'миллион');
    const trillion = chips.find((c) => c.dataset.name === 'триллион');
    // слот A активен по умолчанию
    million.click();
    // переключаемся на слот B и выбираем триллион
    view.el.querySelector('.slot--b').click();
    trillion.click();
    expect(view.el.querySelector('.verdict__sign').textContent).toBe('<');
  });
  it('ввод 200000 с клавиатуры ставит плашку между ступенями', () => {
    const view = createMagnitudesView();
    // слот A активен по умолчанию; набираем 200000
    const keys = [...view.el.querySelectorAll('.keypad__key')];
    for (const d of ['2', '0', '0', '0', '0', '0']) {
      keys.find((k) => k.textContent === d).click();
    }
    const marker = view.el.querySelector('.ladder__marker');
    expect(marker).not.toBeNull();
    expect(marker.textContent).toContain('200 000');
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/magnitudesView.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/ui/magnitudesView.js`**

```js
import { renderLadder } from './renderLadder.js';
import { renderVerdict } from './renderCompare.js';
import { createKeypad } from './keypad.js';
import { MAGNITUDES } from '../core/magnitudes.js';
import { positionOnLadder } from '../core/compare.js';

// Раздел «Соотношение величин»: лесенка порядков + сравнение двух чисел.
export function createMagnitudesView() {
  let active = 'a';
  const slots = { a: { value: null, raw: '', name: null }, b: { value: null, raw: '', name: null } };

  const el = document.createElement('section');
  el.className = 'view view--magnitudes';

  // --- Лесенка ---
  const ladderHost = document.createElement('div');
  ladderHost.className = 'ladder-host';
  el.appendChild(ladderHost);

  // --- Слоты сравнения ---
  const compare = document.createElement('div');
  compare.className = 'compare';
  const slotA = makeSlot('a');
  const slotB = makeSlot('b');
  compare.append(slotA, slotB);
  el.appendChild(compare);

  function makeSlot(name) {
    const s = document.createElement('div');
    s.className = `slot slot--${name}`;
    s.addEventListener('click', () => setActive(name));
    return s;
  }

  // --- Чипы величин ---
  const chips = document.createElement('div');
  chips.className = 'mag-chips';
  for (const m of MAGNITUDES) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'mag-chips__chip';
    chip.dataset.name = m.name;
    chip.textContent = m.name;
    chip.addEventListener('click', () => {
      slots[active] = { value: m.value, raw: '', name: m.name };
      update();
    });
    chips.appendChild(chip);
  }
  el.appendChild(chips);

  // --- Клавиатура для произвольного числа ---
  const keypad = createKeypad({
    onDigit(d) {
      const cur = slots[active].raw;
      // Ограничение длины ввода — 16 цифр (до триллиарда).
      const raw = (cur + d).slice(0, 16);
      slots[active] = { value: Number(raw), raw, name: null };
      update();
    },
    onDelete() {
      const raw = slots[active].raw.slice(0, -1);
      slots[active] = { value: raw ? Number(raw) : null, raw, name: null };
      update();
    },
    onClear() {
      slots[active] = { value: null, raw: '', name: null };
      update();
    },
  });
  el.appendChild(keypad);

  // --- Вердикт ---
  const verdict = document.createElement('div');
  verdict.className = 'verdict';
  el.appendChild(verdict);

  // --- Логика ---
  function setActive(name) {
    active = name;
    paintSlots();
  }

  function paintSlots() {
    for (const [name, node] of [['a', slotA], ['b', slotB]]) {
      const s = slots[name];
      node.textContent = s.name ?? (s.raw || '—');
      node.classList.toggle('is-active', name === active);
    }
  }

  function highlightNames() {
    const names = [];
    for (const name of ['a', 'b']) {
      const s = slots[name];
      if (s.name) names.push(s.name);
    }
    return names;
  }

  // Плашки для произвольных чисел (без имени величины): позиция между ступенями.
  function markersForSlots() {
    const markers = [];
    for (const name of ['a', 'b']) {
      const s = slots[name];
      if (s.value !== null && !s.name) {
        const pos = positionOnLadder(s.value, MAGNITUDES);
        if (pos.belowIndex != null && pos.aboveIndex != null) {
          markers.push({ value: s.value, belowIndex: pos.belowIndex, aboveIndex: pos.aboveIndex });
        }
      }
    }
    return markers;
  }

  function update() {
    paintSlots();
    renderLadder(ladderHost, { highlight: highlightNames(), markers: markersForSlots() });
    if (slots.a.value !== null && slots.b.value !== null) {
      renderVerdict(verdict, slots.a.value, slots.b.value);
    } else {
      verdict.innerHTML = '';
      verdict.textContent = 'Выбери два числа';
    }
  }

  // --- Старт ---
  update();

  return { el };
}
```

Примечание: выбранные с чипов величины подсвечивают свои ступени (`highlight`), а введённые с клавиатуры произвольные числа отмечаются плашкой между нужными ступенями (`markers` через `positionOnLadder`).

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/magnitudesView.test.js`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/ui/magnitudesView.js tests/magnitudesView.test.js
git commit -m "feat: сборка раздела Величины"
```

---

## Фаза 5 — Интеграция и оболочка

### Task 17: `router.js` + `main.js` — навигация вкладками

**Files:**
- Create: `src/router.js`
- Modify: `src/main.js`
- Test: `tests/router.test.js`

**Interfaces:**
- Consumes: `createAdditionView` (additionView.js), `createMagnitudesView` (magnitudesView.js).
- Produces: `createApp() -> HTMLElement` — корневой элемент с вкладками `.tabs` («➕ Сложение», «📊 Величины») и областью `.view-host`. По умолчанию активна вкладка «Сложение». Переключение вкладок меняет содержимое `.view-host`.

- [ ] **Step 1: Написать падающий тест `tests/router.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/router.js';

describe('createApp', () => {
  it('две вкладки, по умолчанию активна Сложение', () => {
    const app = createApp();
    const tabs = [...app.querySelectorAll('.tabs__tab')];
    expect(tabs.length).toBe(2);
    expect(app.querySelector('.view--addition')).not.toBeNull();
    expect(app.querySelector('.view--magnitudes')).toBeNull();
  });
  it('переключение на Величины показывает лесенку', () => {
    const app = createApp();
    const tabMag = [...app.querySelectorAll('.tabs__tab')].find((t) => t.dataset.view === 'magnitudes');
    tabMag.click();
    expect(app.querySelector('.view--magnitudes')).not.toBeNull();
    expect(app.querySelector('.view--addition')).toBeNull();
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run tests/router.test.js`
Expected: FAIL "Failed to resolve import".

- [ ] **Step 3: Реализовать `src/router.js`**

```js
import { createAdditionView } from './ui/additionView.js';
import { createMagnitudesView } from './ui/magnitudesView.js';

// Оболочка приложения: вкладки «Сложение | Величины» и переключение разделов.
const TABS = [
  { id: 'addition', label: '➕ Сложение', factory: createAdditionView },
  { id: 'magnitudes', label: '📊 Величины', factory: createMagnitudesView },
];

export function createApp() {
  let current = 'addition';

  const app = document.createElement('div');
  app.className = 'app';

  const tabs = document.createElement('nav');
  tabs.className = 'tabs';
  for (const t of TABS) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs__tab';
    tab.dataset.view = t.id;
    tab.textContent = t.label;
    tab.addEventListener('click', () => switchTo(t.id));
    tabs.appendChild(tab);
  }
  app.appendChild(tabs);

  const host = document.createElement('div');
  host.className = 'view-host';
  app.appendChild(host);

  function switchTo(id) {
    current = id;
    host.innerHTML = '';
    const tab = TABS.find((t) => t.id === id);
    host.appendChild(tab.factory().el);
    for (const btn of tabs.querySelectorAll('.tabs__tab')) {
      btn.classList.toggle('is-active', btn.dataset.view === id);
    }
  }

  switchTo(current);
  return app;
}
```

- [ ] **Step 4: Обновить `src/main.js`** (смонтировать приложение)

```js
import { createApp } from './router.js';
import './style.css';

// Точка входа: монтируем приложение в #app.
const root = document.querySelector('#app');
root.innerHTML = '';
root.appendChild(createApp());
```

- [ ] **Step 5: Создать заготовку `src/style.css`** (минимум, чтобы импорт работал; полноценные стили — Task 18)

```css
/* Базовые стили — расширяются в Task 18 (frontend-design). */
:root {
  --place-hundred: #7c4dff; /* сотни — фиолетовый */
  --place-ten: #00bcd4;     /* десятки — бирюзовый */
  --place-one: #ff9800;     /* единицы — оранжевый */
}
* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; margin: 0; }
```

- [ ] **Step 6: Запустить тест — убедиться, что проходит**

Run: `npx vitest run tests/router.test.js`
Expected: PASS.

- [ ] **Step 7: Прогнать весь набор тестов и проверить сборку**

Run: `npm test && npm run build`
Expected: все тесты зелёные; `dist/` собирается без ошибок.

- [ ] **Step 8: Ручная проверка в браузере**

Run: `npm run dev`
Открыть указанный адрес. Ожидается: вкладка «Сложение» с примером 370 + 50, ответом 420 и четырьмя блоками; переключение на «Величины» показывает лесенку и сравнение.

- [ ] **Step 9: Коммит**

```bash
git add src/router.js src/main.js src/style.css tests/router.test.js
git commit -m "feat: навигация вкладками и точка входа"
```

---

## Фаза 6 — Стиль и платформа

### Task 18: Визуальный слой и touch-first (frontend-design)

**Files:**
- Modify: `src/style.css`
- Modify (при необходимости — inline-SVG Львёнка вместо эмодзи): `src/ui/renderJumps.js`
- Test: `tests/style.smoke.test.js` (smoke — наличие ключевых классов/переменных используется уже существующими тестами; здесь добавляем проверку, что приложение монтируется без ошибок со стилями)

**Interfaces:**
- Consumes: всю готовую разметку (классы из Task 8–17).
- Produces: завершённый визуальный слой — без новых JS-интерфейсов.

**ВАЖНО:** перед реализацией этой задачи активировать скилл **frontend-design** (как договорено в спецификации §10) и оформлять стили в его рамках. Ниже — обязательные требования и каркас; полировку (тени, скругления, типографику, дружелюбный облик Львёнка) ведёт frontend-design.

Обязательные требования к стилям (из Global Constraints):
- Цвета разрядов: `.block--hundred` → `--place-hundred`, `.block--ten` → `--place-ten`, `.block--one` → `--place-one`. Те же цвета — в разложении (`.decomp__row`) для соответствующих частей.
- Каждый порядок величин (`.ladder-step--один …--триллиард`) — свой цвет ступени.
- Тач-цели: `.keypad__key`, `.show-btn`, `.levels__btn`, `.examples__btn`, `.tabs__tab`, `.slot`, `.mag-chips__chip`, `.operand` — `min-height: 56px` (служебные не меньше 48px); достаточные отступы.
- `:active`-состояния для отклика на тап; никаких `:hover`-зависимых действий.
- `.operand`, `.tabs__tab`, кнопки — `user-select: none; touch-action: manipulation;`
- Адаптив: портрет/альбом iPad, телефон, ПК (Grid/Flex, медиазапросы).
- Анимации блоков/прыжков — через CSS; обернуть в `@media (prefers-reduced-motion: no-preference)`.

- [ ] **Step 1: Активировать frontend-design и написать smoke-тест `tests/style.smoke.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/router.js';

describe('приложение со стилями', () => {
  it('монтируется без ошибок и содержит вкладки', () => {
    const app = createApp();
    expect(app.querySelector('.tabs')).not.toBeNull();
    expect(app.querySelector('.view-host')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Запустить smoke-тест**

Run: `npx vitest run tests/style.smoke.test.js`
Expected: PASS.

- [ ] **Step 3: Реализовать стили в `src/style.css`** (каркас обязательных правил; визуальную полировку добавляет frontend-design)

```css
/* === Токены === */
:root {
  --place-hundred: #7c4dff; /* сотни — фиолетовый */
  --place-ten: #00bcd4;     /* десятки — бирюзовый */
  --place-one: #ff9800;     /* единицы — оранжевый */
  --bg: #fff8ef;
  --card: #ffffff;
  --ink: #3a2f2a;
  --tap: 56px;
}

* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  font-family: system-ui, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-text-size-adjust: 100%;
}

/* Контролы — крупные тач-цели, без выделения, отклик на нажатие */
.keypad__key, .show-btn, .levels__btn, .examples__btn,
.tabs__tab, .slot, .mag-chips__chip, .operand {
  min-height: var(--tap);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  cursor: pointer;
  border-radius: 16px;
  border: none;
  font-size: 1.25rem;
}
.keypad__key:active, .show-btn:active, .levels__btn:active,
.examples__btn:active, .tabs__tab:active, .slot:active,
.mag-chips__chip:active { transform: scale(0.96); }

/* Вкладки */
.tabs { display: flex; gap: 8px; padding: 12px; }
.tabs__tab { flex: 1; background: #fde9c8; }
.tabs__tab.is-active { background: #ffd089; font-weight: 700; }

/* Поля ввода */
.inputs { display: flex; align-items: center; gap: 12px; justify-content: center; padding: 12px; }
.operand { min-width: 96px; padding: 12px 20px; background: var(--card); font-size: 2rem;
  text-align: center; border: 3px solid transparent; }
.operand.is-active { border-color: var(--place-ten); }
.inputs__plus { font-size: 2rem; }
.show-btn { background: #8bd17c; padding: 0 24px; font-weight: 700; }

/* Клавиатура */
.keypad { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 420px;
  margin: 0 auto; padding: 12px; }
.keypad__key { background: var(--card); }
.keypad__key--action { background: #ffd7b0; }

/* Примеры */
.examples { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; padding: 8px; }
.examples__btn { background: #d8ecff; padding: 0 16px; }

/* Уровни */
.levels { display: flex; gap: 8px; justify-content: center; padding: 8px; }
.levels__btn { background: #eee; padding: 0 16px; }
.levels__btn.is-active { background: #c5e8ff; font-weight: 700; }

/* Ответ и сообщение */
.answer { font-size: 3rem; font-weight: 800; text-align: center; }
.message { text-align: center; color: #c0392b; min-height: 1.5rem; }

/* Блоки по разрядам */
.step { padding: 12px; }
.blocks__addend, .blocks__total { display: inline-flex; flex-wrap: wrap; gap: 4px;
  padding: 8px; vertical-align: top; }
.block { border-radius: 6px; }
.block--hundred { width: 40px; height: 40px; background: var(--place-hundred); }
.block--ten { width: 12px; height: 40px; background: var(--place-ten); }
.block--one { width: 12px; height: 12px; background: var(--place-one); }

/* Числовая прямая + Львёнок */
.numline { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.numline__point { padding: 6px 10px; background: var(--card); border-radius: 12px; }
.jump { padding: 2px 8px; color: var(--place-ten); font-weight: 700; }
.mascot { font-size: 2.5rem; }

/* Разложение */
.decomp__row { font-size: 1.4rem; padding: 4px 0; text-align: center; }

/* Обычная запись */
.plain { font-size: 2rem; font-weight: 700; text-align: center; }

/* Лесенка порядков */
.ladder { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px; }
.ladder-step { display: flex; gap: 16px; justify-content: space-between; align-items: center;
  width: 100%; max-width: 520px; padding: 12px 20px; border-radius: 16px; color: #fff; }
.ladder-step.is-highlight { outline: 4px solid #ffce54; }
.ladder__mult { font-size: .9rem; color: #888; }
.ladder-step--один { background: #b0bec5; }
.ladder-step--тысяча { background: #4db6ac; }
.ladder-step--миллион { background: #5c9cff; }
.ladder-step--миллиард { background: #9575cd; }
.ladder-step--триллион { background: #ec7063; }
.ladder-step--триллиард { background: #f39c12; }

/* Сравнение */
.compare { display: flex; gap: 16px; justify-content: center; padding: 12px; }
.slot { min-width: 120px; padding: 16px; background: var(--card); text-align: center;
  border: 3px solid transparent; font-size: 1.4rem; }
.slot.is-active { border-color: var(--place-ten); }
.mag-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; padding: 8px; }
.mag-chips__chip { background: #efe3ff; padding: 0 14px; }
.verdict { text-align: center; padding: 12px; }
.verdict__sign { font-size: 3rem; font-weight: 800; }
.verdict__bigger { font-size: 1.4rem; font-weight: 700; }
.verdict__ratio { color: #6a5acd; }

/* Анимации — только если пользователь не против движения */
@media (prefers-reduced-motion: no-preference) {
  .blocks__total.is-result { animation: pop .4s ease; }
  @keyframes pop { from { transform: scale(.8); opacity: .4; } to { transform: scale(1); opacity: 1; } }
}

/* Адаптив */
@media (max-width: 600px) {
  .answer { font-size: 2.2rem; }
  .keypad { max-width: 100%; }
}
```

- [ ] **Step 4: (опционально) Заменить эмодзи Львёнка на inline-SVG** — если frontend-design решит, что SVG уместнее. Тест `renderJumps.test.js` проверяет `.mascot`, не его содержимое, поэтому замена внутренностей `.mascot` не ломает тесты.

- [ ] **Step 5: Прогнать все тесты**

Run: `npm test`
Expected: PASS (включая smoke-тест стилей).

- [ ] **Step 6: Ручная проверка адаптива и touch**

Run: `npm run dev` и открыть на iPad по локальной сети (`http://<IP-компа>:5173`).
Проверить: крупные кнопки, нет случайного зума двойным тапом, цвета разрядов и порядков, читаемость в портрете и альбоме.

- [ ] **Step 7: Коммит**

```bash
git add src/style.css src/ui/renderJumps.js tests/style.smoke.test.js
git commit -m "feat: визуальный слой и touch-first стили"
```

---

### Task 19: PWA, финальная сборка и деплой

**Files:**
- Modify: `vite.config.js`
- Create: `public/icon.svg`
- Modify: `index.html` (тема и описание)
- Create: `README.md` (инструкции запуска/деплоя)

**Interfaces:**
- Produces: устанавливаемое офлайн-PWA; инструкции деплоя.

- [ ] **Step 1: Создать иконку `public/icon.svg`** (Львёнок-эмодзи на фирменном фоне; vite-plugin-pwa сгенерирует растровые размеры)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#ffd089"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="320">🦁</text>
</svg>
```

- [ ] **Step 2: Подключить `vite-plugin-pwa` в `vite.config.js`**

```js
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Считаем со Львёнком',
        short_name: 'Львёнок',
        description: 'Наглядное сложение и сравнение чисел для детей',
        theme_color: '#ffd089',
        background_color: '#fff8ef',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 3: Добавить тему в `index.html`** (внутри `<head>`)

```html
    <meta name="theme-color" content="#ffd089" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

- [ ] **Step 4: Установить плагин (если не установлен в Task 1) и собрать**

Run: `npm install && npm run build`
Expected: в `dist/` появляются `manifest.webmanifest` и `sw.js` (service worker), сборка без ошибок.

- [ ] **Step 5: Проверить PWA локально**

Run: `npm run preview`
Открыть адрес; в DevTools → Application убедиться, что manifest валиден и service worker регистрируется.

- [ ] **Step 6: Создать `README.md`**

```markdown
# Считаем со Львёнком

Детский математический тренажёр: наглядное сложение и сравнение порядков чисел.

## Разработка
- `npm install`
- `npm run dev` — dev-сервер (доступен в локальной сети для iPad)
- `npm test` — тесты (Vitest)

## Сборка и деплой
- `npm run build` — статика в `dist/`
- Деплой на GitHub Pages (Settings → Pages → ветка/папка) или на VPS (раздать `dist/` по HTTPS).
- На iPad: открыть URL в Safari → «Поделиться» → «На экран Домой» → офлайн-приложение.

## Стек
Vite + vanilla JS + CSS, PWA (vite-plugin-pwa). Без UI-фреймворков.
```

- [ ] **Step 7: Финальный прогон тестов и сборки**

Run: `npm test && npm run build`
Expected: все тесты зелёные; `dist/` собран с manifest и service worker.

- [ ] **Step 8: Коммит**

```bash
git add vite.config.js public/icon.svg index.html README.md
git commit -m "feat: PWA, иконка и инструкции деплоя"
```

---

## Самопроверка плана (выполнена при написании)

**1. Покрытие спецификации:**
- §1/§3 два раздела + навигация → Task 17 (router), Task 13/16 (views). ✓
- §4 уровни сложности + старт 370+50 → Task 4 (levels), Task 13 (additionView). ✓
- §5/§6 структура и четыре блока (блоки/прыжки/разложение/запись) → Task 9–13. ✓
- §6 Львёнок на прыжках → Task 10. ✓
- §6a лесенка, ряд величин, сравнение, примеры ребёнка → Task 6, 7, 14, 15, 16. ✓
- §7 валидация (положительные, диапазон, сумма ≤999, мягкие сообщения) → Task 3, 4, 13; формат до триллиарда → Task 2, 16. ✓
- §8 цвета разрядов/порядков → Task 18. ✓
- §9 touch-first/PWA standalone → Task 18, 19. ✓
- §10 модули (включая core/ui split, magnitudes, ladder, compare, router, keypad reuse) → все задачи. ✓
- §10a dev/build/deploy → Task 1, 19. ✓
- §11 критерии готовности → покрыты тестами и ручными проверками Task 13, 16, 17, 18, 19. ✓
- §12 YAGNI: вычитание, аудио, метафоры из жизни, зум ×1000 — НЕ включены. ✓

**2. Сканирование плейсхолдеров:** «TODO/TBD/implement later» в шагах с кодом отсутствуют; весь код приведён целиком. Визуальная полировка в Task 18 описана конкретными правилами, не плейсхолдером.

**3. Консистентность типов/имён:** `splitDigits`, `computeJumps`/`computeDecomposition`, `formatGroups`, `compareValues`/`ratioIfRound`/`positionOnLadder`, `createKeypad({onDigit,onDelete,onClear})`, `renderBlocks/renderJumps/renderDecomposition/renderPlain(container,a,b)`, `renderLadder(container,{highlight})`, `renderVerdict(container,a,b)`, `createAdditionView/createMagnitudesView()→{el,...}`, `createApp()` — имена согласованы между задачами и совпадают с импортами.
