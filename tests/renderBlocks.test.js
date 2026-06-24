import { describe, it, expect, beforeEach } from 'vitest';
import { renderBlocks } from '../src/ui/renderBlocks.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderBlocks', () => {
  it('рисует разрядные блоки для слагаемого 370', () => {
    renderBlocks(container, 370, 50);
    const a = container.querySelector('.blocks__addend');
    expect(a.querySelectorAll('.block--hundred').length).toBe(3);
    expect(a.querySelectorAll('.block--ten').length).toBe(7);
    expect(a.querySelectorAll('.block--one').length).toBe(0);
  });
  it('рисует итог 420: 4 сотни, 2 десятка', () => {
    renderBlocks(container, 370, 50);
    const total = container.querySelector('.blocks__total');
    expect(total.querySelectorAll('.block--hundred').length).toBe(4);
    expect(total.querySelectorAll('.block--ten').length).toBe(2);
  });
  it('перерисовка очищает прошлый результат', () => {
    renderBlocks(container, 370, 50);
    renderBlocks(container, 8, 5);
    expect(container.querySelectorAll('.blocks__addend').length).toBe(2);
  });
});
