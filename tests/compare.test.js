import { describe, it, expect } from 'vitest';
import { compareValues, ratioIfRound, positionOnLadder } from '../src/core/compare.js';
import { MAGNITUDES } from '../src/core/magnitudes.js';

describe('compareValues', () => {
  it('определяет большее и знак', () => {
    expect(compareValues(1000000, 1000000000000)).toEqual({ bigger: 'b', sign: '<' });
    expect(compareValues(1000000000, 200000)).toEqual({ bigger: 'a', sign: '>' });
    expect(compareValues(5, 5)).toEqual({ bigger: 'equal', sign: '=' });
  });
});

describe('ratioIfRound', () => {
  it('кратное для двух величин ряда', () => {
    expect(ratioIfRound(1000000000000, 1000000, MAGNITUDES)).toEqual({ times: 1000000 });
  });
  it('null, если число не из ряда', () => {
    expect(ratioIfRound(200000, 1000000000, MAGNITUDES)).toBe(null);
  });
  it('null, если один из аргументов — ноль', () => {
    expect(ratioIfRound(0, 1000000, MAGNITUDES)).toBe(null);
  });
});

describe('positionOnLadder', () => {
  it('точное совпадение с величиной', () => {
    expect(positionOnLadder(1000000, MAGNITUDES)).toEqual({ exactIndex: 2 });
  });
  it('200000 — между тысячей (1) и миллионом (2)', () => {
    expect(positionOnLadder(200000, MAGNITUDES)).toEqual({ belowIndex: 1, aboveIndex: 2 });
  });
  it('значение выше триллиарда — belowIndex 5, aboveIndex null', () => {
    expect(positionOnLadder(5000000000000000, MAGNITUDES)).toEqual({ belowIndex: 5, aboveIndex: null });
  });
});
