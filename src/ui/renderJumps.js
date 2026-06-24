import { computeJumps } from '../core/addition.js';

// Числовая прямая с прыжками по 10 и маскотом-Львёнком.
export function renderJumps(container, a, b) {
  container.innerHTML = '';
  const { jumps } = computeJumps(a, b);

  // Маскот — inline-SVG Львёнок вместо эмодзи для чёткости на ретина-дисплеях iPad.
  // Тест проверяет только наличие .mascot, не его содержимое — замена безопасна.
  const mascot = document.createElement('div');
  mascot.className = 'mascot';
  mascot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="56" height="56" aria-hidden="true" focusable="false">
  <!-- Грива — задняя часть -->
  <ellipse cx="40" cy="46" rx="26" ry="24" fill="#e08a00"/>
  <!-- Голова -->
  <ellipse cx="40" cy="38" rx="20" ry="19" fill="#f5a623"/>
  <!-- Ушки -->
  <ellipse cx="22" cy="22" rx="7" ry="7" fill="#f5a623"/>
  <ellipse cx="58" cy="22" rx="7" ry="7" fill="#f5a623"/>
  <ellipse cx="22" cy="22" rx="4" ry="4" fill="#e08a00"/>
  <ellipse cx="58" cy="22" rx="4" ry="4" fill="#e08a00"/>
  <!-- Мордочка -->
  <ellipse cx="40" cy="44" rx="12" ry="9" fill="#fde9c8"/>
  <!-- Глаза -->
  <ellipse cx="33" cy="34" rx="4" ry="4.5" fill="#fff"/>
  <ellipse cx="47" cy="34" rx="4" ry="4.5" fill="#fff"/>
  <circle cx="34" cy="35" r="2.5" fill="#3a2f2a"/>
  <circle cx="48" cy="35" r="2.5" fill="#3a2f2a"/>
  <circle cx="34.8" cy="34.2" r=".9" fill="#fff"/>
  <circle cx="48.8" cy="34.2" r=".9" fill="#fff"/>
  <!-- Носик -->
  <ellipse cx="40" cy="42" rx="4" ry="3" fill="#e05151"/>
  <!-- Рот -->
  <path d="M36 46 Q40 50 44 46" stroke="#3a2f2a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Усы -->
  <line x1="28" y1="43" x2="36" y2="44" stroke="#3a2f2a" stroke-width="1" stroke-linecap="round"/>
  <line x1="28" y1="46" x2="36" y2="45" stroke="#3a2f2a" stroke-width="1" stroke-linecap="round"/>
  <line x1="52" y1="43" x2="44" y2="44" stroke="#3a2f2a" stroke-width="1" stroke-linecap="round"/>
  <line x1="52" y1="46" x2="44" y2="45" stroke="#3a2f2a" stroke-width="1" stroke-linecap="round"/>
</svg>`;
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
