import { describe, it, expect } from 'vitest';
import { LEVELS, DEFAULT_LEVEL_ID, getLevel, validateOperands } from '../src/core/levels.js';

describe('LEVELS', () => {
  it('три уровня с нужными id и пределами', () => {
    expect(LEVELS.map((l) => l.id)).toEqual(['to20', 'to100', 'to999']);
    expect(getLevel('to20').max).toBe(20);
    expect(getLevel('to100').max).toBe(100);
    expect(getLevel('to999').max).toBe(999);
  });
  it('уровень по умолчанию — до 999, стартовый пример 370+50', () => {
    expect(DEFAULT_LEVEL_ID).toBe('to999');
    expect(getLevel('to999').examples[0]).toEqual([370, 50]);
  });
});

describe('validateOperands', () => {
  const lvl = getLevel('to999');
  it('пропускает корректные', () => {
    expect(validateOperands(370, 50, lvl)).toEqual({ valid: true, error: null });
  });
  it('отклоняет выход за предел уровня', () => {
    const small = getLevel('to20');
    expect(validateOperands(25, 1, small).valid).toBe(false);
    expect(validateOperands(25, 1, small).error).toBe('Возьмём числа поменьше 🙂');
  });
  it('отклоняет сумму больше 999', () => {
    expect(validateOperands(999, 999, lvl).valid).toBe(false);
    expect(validateOperands(999, 999, lvl).error).toBe('Возьмём числа поменьше 🙂');
  });
});
