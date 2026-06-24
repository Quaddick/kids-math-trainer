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
      // Клавиатура присылает только цифры, поэтому Number(raw) безопасен и parseNumber здесь не нужен.
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
