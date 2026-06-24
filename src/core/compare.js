// Логика сравнения величин для раздела «Соотношение величин».

export function compareValues(a, b) {
  if (a > b) return { bigger: 'a', sign: '>' };
  if (a < b) return { bigger: 'b', sign: '<' };
  return { bigger: 'equal', sign: '=' };
}

// Кратное «во сколько раз», только если ОБА числа — точные значения ряда величин.
export function ratioIfRound(a, b, magnitudes) {
  const isRound = (v) => magnitudes.some((m) => m.value === v);
  if (a === 0 || b === 0 || !isRound(a) || !isRound(b)) return null;
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  return { times: big / small };
}

// Позиция произвольного числа на лесенке: точная ступень либо между belowIndex и aboveIndex.
export function positionOnLadder(value, magnitudes) {
  const exact = magnitudes.findIndex((m) => m.value === value);
  if (exact !== -1) return { exactIndex: exact };

  let belowIndex = null;
  for (let i = 0; i < magnitudes.length; i++) {
    if (magnitudes[i].value < value) belowIndex = i;
  }
  const aboveIndex =
    belowIndex !== null && belowIndex + 1 < magnitudes.length ? belowIndex + 1 : null;
  return { belowIndex, aboveIndex };
}
