// Форматирование чисел: разделители групп по 3 разряда.
export function formatGroups(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
