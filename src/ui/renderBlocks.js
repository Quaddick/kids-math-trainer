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
