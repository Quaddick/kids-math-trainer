import { describe, it, expect } from 'vitest';
import { formatGroups } from '../src/core/format.js';

describe('formatGroups', () => {
  it('малые числа не меняются', () => {
    expect(formatGroups(5)).toBe('5');
    expect(formatGroups(0)).toBe('0');
    expect(formatGroups(999)).toBe('999');
  });
  it('группирует по 3 разряда', () => {
    expect(formatGroups(1000)).toBe('1 000');
    expect(formatGroups(200000)).toBe('200 000');
    expect(formatGroups(1000000)).toBe('1 000 000');
    expect(formatGroups(1000000000000000)).toBe('1 000 000 000 000 000');
  });
});
