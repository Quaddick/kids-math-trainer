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
