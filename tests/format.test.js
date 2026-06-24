import { describe, it, expect } from 'vitest';
import { formatGroups } from '../src/core/format.js';

describe('инфраструктура', () => {
  it('Vitest запускается и видит модули core', () => {
    expect(formatGroups(1000)).toBe('1 000');
  });
});
