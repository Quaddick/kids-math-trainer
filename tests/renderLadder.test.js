import { describe, it, expect, beforeEach } from 'vitest';
import { renderLadder } from '../src/ui/renderLadder.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderLadder', () => {
  it('рисует 6 ступеней, триллиард сверху, один снизу', () => {
    renderLadder(container);
    const steps = [...container.querySelectorAll('.ladder-step')];
    expect(steps.length).toBe(6);
    expect(steps[0].textContent).toContain('триллиард');
    expect(steps[steps.length - 1].textContent).toContain('один');
  });
  it('форматирует число миллиона с разделителями', () => {
    renderLadder(container);
    const mil = container.querySelector('.ladder-step--миллион');
    expect(mil.textContent).toContain('1 000 000');
  });
  it('подсвечивает указанные величины', () => {
    renderLadder(container, { highlight: ['миллиард'] });
    expect(container.querySelector('.ladder-step--миллиард').classList.contains('is-highlight')).toBe(true);
  });
  it('рисует плашку произвольного числа между ступенями', () => {
    // 200000 находится между тысячей (idx 1) и миллионом (idx 2)
    renderLadder(container, { markers: [{ value: 200000, belowIndex: 1, aboveIndex: 2 }] });
    const marker = container.querySelector('.ladder__marker');
    expect(marker).not.toBeNull();
    expect(marker.textContent).toContain('200 000');
  });
});
