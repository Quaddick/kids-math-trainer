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
