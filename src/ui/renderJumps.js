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
