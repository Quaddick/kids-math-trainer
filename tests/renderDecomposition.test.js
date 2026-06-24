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
  it('370 + 50: часть сотен 300 обёрнута в span .decomp__num--hundred', () => {
    renderDecomposition(container, 370, 50);
    const hundreds = container.querySelectorAll('.decomp__num--hundred');
    const values = Array.from(hundreds).map(el => el.textContent);
    expect(values).toContain('300');
  });
  it('370 + 50: остаток 70 обёрнут в span .decomp__num--rest', () => {
    renderDecomposition(container, 370, 50);
    const rests = container.querySelectorAll('.decomp__num--rest');
    const values = Array.from(rests).map(el => el.textContent);
    expect(values).toContain('70');
  });
});
