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
  it('setLevel переключает активную кнопку и перерисовывает примеры уровня to20', () => {
    const view = createAdditionView();
    view.setLevel('to20');
    // Кнопка уровня to20 должна получить класс is-active
    const btn = view.el.querySelector('.levels__btn[data-level="to20"]');
    expect(btn.classList.contains('is-active')).toBe(true);
    // Первый пример для уровня to20 — «8 + 5»
    const firstExample = view.el.querySelector('.examples__btn');
    expect(firstExample.textContent).toBe('8 + 5');
  });
  it('клавиатура записывает цифры в активный слот (слот B показывает 42)', () => {
    const view = createAdditionView();
    // Активируем слот B
    view.el.querySelector('.operand[data-slot="b"]').click();
    // Сброс значения слота
    view.el.querySelector('[data-action="clear"]').click();
    // Вводим «4», затем «2» (кнопки клавиатуры ищем по текстовому содержимому)
    const keys = [...view.el.querySelectorAll('.keypad__key')];
    keys.find((k) => k.textContent === '4').click();
    keys.find((k) => k.textContent === '2').click();
    expect(view.el.querySelector('.operand[data-slot="b"]').textContent).toBe('42');
  });
});
