import { describe, it, expect, beforeEach } from 'vitest';
import { renderVerdict } from '../src/ui/renderCompare.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderVerdict', () => {
  it('миллион vs триллион: триллион больше, знак <', () => {
    renderVerdict(container, 1000000, 1000000000000);
    expect(container.querySelector('.verdict__sign').textContent).toBe('<');
    expect(container.querySelector('.verdict__ratio').textContent).toContain('1 000 000');
  });
  it('200000 vs миллиард: миллиард больше, без кратного', () => {
    renderVerdict(container, 200000, 1000000000);
    expect(container.querySelector('.verdict__sign').textContent).toBe('<');
    expect(container.querySelector('.verdict__ratio')).toBeNull();
  });
  it('равные числа', () => {
    renderVerdict(container, 1000, 1000);
    expect(container.querySelector('.verdict__equal')).not.toBeNull();
  });
});
