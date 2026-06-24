import { describe, it, expect } from 'vitest';
import { computeSum, computeJumps, computeDecomposition } from '../src/core/addition.js';

describe('computeSum', () => {
  it('складывает', () => {
    expect(computeSum(370, 50)).toBe(420);
  });
});

describe('computeJumps', () => {
  it('370 + 50 — пять прыжков по 10', () => {
    const r = computeJumps(370, 50);
    expect(r.start).toBe(370);
    expect(r.end).toBe(420);
    expect(r.jumps).toEqual([
      { from: 370, to: 380, delta: 10 },
      { from: 380, to: 390, delta: 10 },
      { from: 390, to: 400, delta: 10 },
      { from: 400, to: 410, delta: 10 },
      { from: 410, to: 420, delta: 10 },
    ]);
  });
  it('23 + 14 — прыжок по 10 и до-прыжок на 4', () => {
    const r = computeJumps(23, 14);
    expect(r.jumps).toEqual([
      { from: 23, to: 33, delta: 10 },
      { from: 33, to: 37, delta: 4 },
    ]);
    expect(r.end).toBe(37);
  });
  it('8 + 5 — один до-прыжок на 5', () => {
    const r = computeJumps(8, 5);
    expect(r.jumps).toEqual([{ from: 8, to: 13, delta: 5 }]);
  });
});

describe('computeDecomposition', () => {
  it('370 + 50 = 420 по разрядам', () => {
    expect(computeDecomposition(370, 50)).toEqual({
      aH: 300, aRest: 70, bH: 0, bRest: 50, restSum: 120, hundredSum: 300, total: 420,
    });
  });
});
