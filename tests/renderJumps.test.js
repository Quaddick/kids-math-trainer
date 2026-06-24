import { describe, it, expect, beforeEach } from 'vitest';
import { renderJumps } from '../src/ui/renderJumps.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderJumps', () => {
  it('370+50: 6 точек (старт + 5) и 5 дуг', () => {
    renderJumps(container, 370, 50);
    expect(container.querySelectorAll('.numline__point').length).toBe(6);
    expect(container.querySelectorAll('.jump').length).toBe(5);
  });
  it('подписывает крайние точки числами', () => {
    renderJumps(container, 370, 50);
    const points = [...container.querySelectorAll('.numline__point')];
    expect(points[0].textContent).toContain('370');
    expect(points[points.length - 1].textContent).toContain('420');
  });
  it('содержит маскота-Львёнка', () => {
    renderJumps(container, 370, 50);
    expect(container.querySelector('.mascot')).not.toBeNull();
  });
  it('23+14: 3 точки и 2 дуги (+10, +4)', () => {
    renderJumps(container, 23, 14);
    expect(container.querySelectorAll('.numline__point').length).toBe(3);
    const labels = [...container.querySelectorAll('.jump')].map((j) => j.textContent);
    expect(labels).toEqual(['+10', '+4']);
  });
});
