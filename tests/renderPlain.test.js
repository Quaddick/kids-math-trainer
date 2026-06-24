import { describe, it, expect, beforeEach } from 'vitest';
import { renderPlain } from '../src/ui/renderPlain.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderPlain', () => {
  it('пишет пример с ответом', () => {
    renderPlain(container, 370, 50);
    expect(container.querySelector('.plain').textContent).toBe('370 + 50 = 420');
  });
});
