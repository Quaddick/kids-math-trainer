// Разбор и валидация введённых чисел.

// Парсит строку в неотрицательное целое. Возвращает результат с признаком valid.
export function parseNumber(str) {
  const trimmed = String(str).trim();
  // Только цифры: отсекает пустое, дробное, отрицательное, буквы.
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, value: null, error: 'Давай попробуем положительные числа' };
  }
  return { valid: true, value: Number(trimmed), error: null };
}

// Разбивает число 0..999 на разряды.
export function splitDigits(n) {
  return {
    hundreds: Math.floor(n / 100),
    tens: Math.floor(n / 10) % 10,
    ones: n % 10,
  };
}
