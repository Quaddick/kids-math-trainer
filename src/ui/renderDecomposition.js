import { computeDecomposition } from '../core/addition.js';

// Цвета намеренно назначаются по структурной роли: сотни (--place-hundred) и остаток <100 (--place-ten) —
// а не по полному разбору единиц/десятков/сотен, поэтому оранжевый цвет единиц здесь не используется (так решено).

// Вспомогательная функция: создаёт span с классами decomp__num и модификатором разряда.
function numSpan(cls, value) {
  const span = document.createElement('span');
  span.className = `decomp__num decomp__num--${cls}`;
  span.textContent = String(value);
  return span;
}

// Добавляет строку разложения, строя её из текстовых узлов и span-ов по разрядам.
function addRow(container, parts) {
  const row = document.createElement('div');
  row.className = 'decomp__row';
  for (const part of parts) {
    if (typeof part === 'string') {
      row.appendChild(document.createTextNode(part));
    } else {
      row.appendChild(part);
    }
  }
  container.appendChild(row);
}

// Разложение числа по разрядам: показывает шаги от частей к итогу.
export function renderDecomposition(container, a, b) {
  container.innerHTML = '';
  const d = computeDecomposition(a, b);

  // Строка A: «370 = 300 + 70» либо «50 = 50», если сотен нет.
  if (a >= 100) {
    addRow(container, [
      `${a} = `,
      numSpan('hundred', d.aH),
      ' + ',
      numSpan('rest', d.aRest),
    ]);
  } else {
    addRow(container, [`${a} = ${a}`]);
  }

  // Строка B: «50 = 50» либо «300 = 300 + 0» если сотни есть.
  if (b >= 100) {
    addRow(container, [
      `${b} = `,
      numSpan('hundred', d.bH),
      ' + ',
      numSpan('rest', d.bRest),
    ]);
  } else {
    addRow(container, [`${b} = ${b}`]);
  }

  // Сумма остатков.
  addRow(container, [
    numSpan('rest', d.aRest),
    ' + ',
    numSpan('rest', d.bRest),
    ' = ',
    numSpan('rest', d.restSum),
  ]);

  // Финальное сложение сотен с остатками.
  addRow(container, [
    numSpan('hundred', d.hundredSum),
    ' + ',
    numSpan('rest', d.restSum),
    ` = ${d.total}`,
  ]);
}
