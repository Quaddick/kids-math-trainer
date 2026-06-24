// Обычная запись примера — итоговый шаг объяснения.
export function renderPlain(container, a, b) {
  container.innerHTML = '';
  const line = document.createElement('div');
  line.className = 'plain';
  line.textContent = `${a} + ${b} = ${a + b}`;
  container.appendChild(line);
}
