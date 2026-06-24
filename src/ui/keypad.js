// Экранная цифровая клавиатура. Используется и в калькуляторе, и в сравнении величин.
export function createKeypad({ onDigit, onDelete, onClear }) {
  const el = document.createElement('div');
  el.className = 'keypad';

  // Цифры 1..9, затем 0.
  for (const d of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'keypad__key';
    b.textContent = d;
    b.addEventListener('click', () => onDigit(d));
    el.appendChild(b);
  }

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'keypad__key keypad__key--action';
  del.dataset.action = 'delete';
  del.textContent = '⌫';
  del.addEventListener('click', () => onDelete());
  el.appendChild(del);

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'keypad__key keypad__key--action';
  clear.dataset.action = 'clear';
  clear.textContent = 'C';
  clear.addEventListener('click', () => onClear());
  el.appendChild(clear);

  return el;
}
