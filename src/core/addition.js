// Чистая логика сложения: прыжки по числовой прямой и поразрядное разложение.

export function computeSum(a, b) {
  return a + b;
}

// Прыжки: сначала по +10 (целые десятки второго числа), затем один прыжок на остаток единиц.
export function computeJumps(a, b) {
  const jumps = [];
  let cur = a;
  const tenCount = Math.floor(b / 10);
  for (let i = 0; i < tenCount; i++) {
    jumps.push({ from: cur, to: cur + 10, delta: 10 });
    cur += 10;
  }
  const ones = b % 10;
  if (ones > 0) {
    jumps.push({ from: cur, to: cur + ones, delta: ones });
    cur += ones;
  }
  return { start: a, end: cur, jumps };
}

// Разложение: число = сотни + остаток(<100). Складываем остатки, затем прибавляем сотни.
// Пример: 370 + 50 -> 300+70 и 50; 70+50=120; 300+120=420.
export function computeDecomposition(a, b) {
  const aH = Math.floor(a / 100) * 100;
  const aRest = a % 100;
  const bH = Math.floor(b / 100) * 100;
  const bRest = b % 100;
  return {
    aH,
    aRest,
    bH,
    bRest,
    restSum: aRest + bRest,
    hundredSum: aH + bH,
    total: a + b,
  };
}
