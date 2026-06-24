// Ряд величин (обиходный ×1000). Сноска для взрослого: 10^15 строго научно — «квадриллион».
// Цвета ступеней задаются в CSS по классу ladder-step--<name>, чтобы данные оставались чистыми.
export const MAGNITUDES = [
  { name: 'один', power: 0, value: 1, zeros: 0 },
  { name: 'тысяча', power: 3, value: 1000, zeros: 3 },
  { name: 'миллион', power: 6, value: 1000000, zeros: 6 },
  { name: 'миллиард', power: 9, value: 1000000000, zeros: 9 },
  { name: 'триллион', power: 12, value: 1000000000000, zeros: 12 },
  { name: 'триллиард', power: 15, value: 1000000000000000, zeros: 15 },
];

export function getMagnitude(name) {
  return MAGNITUDES.find((m) => m.name === name) || null;
}
