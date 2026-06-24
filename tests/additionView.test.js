import { describe, it, expect } from 'vitest';
import { createAdditionView } from '../src/ui/additionView.js';

describe('createAdditionView', () => {
  it('стартует с примером 370 + 50 и ответом 420', () => {
    const view = createAdditionView();
    expect(view.el.querySelector('.answer').textContent).toContain('420');
    expect(view.el.querySelector('.step--blocks .blocks__total')).not.toBeNull();
  });
  it('setExample + show обновляет ответ', () => {
    const view = createAdditionView();
    view.setExample(120, 30);
    view.show();
    expect(view.el.querySelector('.answer').textContent).toContain('150');
  });
  it('показывает переключатель из трёх уровней', () => {
    const view = createAdditionView();
    expect(view.el.querySelectorAll('.levels__btn').length).toBe(3);
  });
  it('сумма > 999 даёт мягкое сообщение и не рисует ответ-блоки', () => {
    const view = createAdditionView();
    view.setExample(999, 999);
    view.show();
    expect(view.el.querySelector('.message').textContent).toBe('Возьмём числа поменьше 🙂');
    expect(view.el.querySelector('.step--blocks').children.length).toBe(0);
  });
});
