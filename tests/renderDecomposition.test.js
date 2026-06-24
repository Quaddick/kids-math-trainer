import { describe, it, expect, beforeEach } from 'vitest';
import { renderDecomposition } from '../src/ui/renderDecomposition.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderDecomposition', () => {
  it('370 + 50: показывает разрядные шаги и итог', () => {
    renderDecomposition(container, 370, 50);
    const text = container.textContent;
    expect(text).toContain('370 = 300 + 70');
    expect(text).toContain('50 = 50');
    expect(text).toContain('70 + 50 = 120');
    expect(text).toContain('300 + 120 = 420');
  });
  it('создаёт строки .decomp__row', () => {
    renderDecomposition(container, 370, 50);
    expect(container.querySelectorAll('.decomp__row').length).toBeGreaterThanOrEqual(3);
  });
});
