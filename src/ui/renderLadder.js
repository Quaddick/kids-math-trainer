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
