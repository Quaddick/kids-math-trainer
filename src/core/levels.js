// Конфигурация уровней сложности и валидация операндов сложения.

export const LEVELS = [
  { id: 'to20', label: 'До 20', emoji: '🐤', max: 20, examples: [[8, 5], [7, 6], [9, 4]] },
  { id: 'to100', label: 'До 100', emoji: '🐰', max: 100, examples: [[30, 40], [23, 14], [50, 35]] },
  {
    id: 'to999',
    label: 'До 999',
    emoji: '🦉',
    max: 999,
    examples: [[370, 50], [120, 30], [450, 70], [90, 40], [230, 80]],
  },
];

export const DEFAULT_LEVEL_ID = 'to999';

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || null;
}

// Проверяет операнды: неотрицательные, в пределах уровня, сумма ≤ 999 (для чистой визуализации блоков).
export function validateOperands(a, b, level) {
  if (a < 0 || b < 0) {
    return { valid: false, error: 'Давай попробуем положительные числа' };
  }
  if (a > level.max || b > level.max || a + b > 999) {
    return { valid: false, error: 'Возьмём числа поменьше 🙂' };
  }
  return { valid: true, error: null };
}
