import { describe, it, expect } from 'vitest';
import { parseNumber, splitDigits } from '../src/core/parse.js';

describe('parseNumber', () => {
  it('принимает целые неотрицательные', () => {
    expect(parseNumber('370')).toEqual({ valid: true, value: 370, error: null });
    expect(parseNumber('0')).toEqual({ valid: true, value: 0, error: null });
    expect(parseNumber('  42 ')).toEqual({ valid: true, value: 42, error: null });
  });
  it('отклоняет пустое, нечисловое и отрицательное', () => {
    expect(parseNumber('').valid).toBe(false);
    expect(parseNumber('abc').valid).toBe(false);
    expect(parseNumber('-5').valid).toBe(false);
    expect(parseNumber('3.5').valid).toBe(false);
    expect(parseNumber('-5').error).toBe('Давай попробуем положительные числа');
  });
});

describe('splitDigits', () => {
  it('разбивает на сотни/десятки/единицы', () => {
    expect(splitDigits(370)).toEqual({ hundreds: 3, tens: 7, ones: 0 });
    expect(splitDigits(8)).toEqual({ hundreds: 0, tens: 0, ones: 8 });
    expect(splitDigits(999)).toEqual({ hundreds: 9, tens: 9, ones: 9 });
    expect(splitDigits(420)).toEqual({ hundreds: 4, tens: 2, ones: 0 });
  });
});
