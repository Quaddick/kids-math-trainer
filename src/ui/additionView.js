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
    // Клавиатура кладёт в слоты только строки из цифр (без ведущих нулей), поэтому Number() безопасен и parseNumber здесь не нужен.
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
