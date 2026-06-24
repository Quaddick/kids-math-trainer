import { describe, it, expect } from 'vitest';
import { MAGNITUDES, getMagnitude } from '../src/core/magnitudes.js';

describe('MAGNITUDES', () => {
  it('ряд ×1000 от единицы до триллиарда', () => {
    expect(MAGNITUDES.map((m) => m.name)).toEqual([
      'один', 'тысяча', 'миллион', 'миллиард', 'триллион', 'триллиард',
    ]);
  });
  it('каждый следующий в 1000 раз больше', () => {
    for (let i = 1; i < MAGNITUDES.length; i++) {
      expect(MAGNITUDES[i].value).toBe(MAGNITUDES[i - 1].value * 1000);
    }
  });
  it('триллиард = 10^15', () => {
    expect(getMagnitude('триллиард').value).toBe(1000000000000000);
    expect(getMagnitude('триллиард').zeros).toBe(15);
  });
  it('getMagnitude неизвестного — null', () => {
    expect(getMagnitude('квинтиллион')).toBe(null);
  });
});
