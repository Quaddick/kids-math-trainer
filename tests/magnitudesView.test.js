import { describe, it, expect } from 'vitest';
import { createMagnitudesView } from '../src/ui/magnitudesView.js';

describe('createMagnitudesView', () => {
  it('рисует лесенку из 6 ступеней', () => {
    const view = createMagnitudesView();
    expect(view.el.querySelectorAll('.ladder-step').length).toBe(6);
  });
  it('два слота сравнения и чипы величин', () => {
    const view = createMagnitudesView();
    expect(view.el.querySelector('.slot--a')).not.toBeNull();
    expect(view.el.querySelector('.slot--b')).not.toBeNull();
    expect(view.el.querySelectorAll('.mag-chips__chip').length).toBe(6);
  });
  it('выбор двух величин показывает вердикт', () => {
    const view = createMagnitudesView();
    const chips = [...view.el.querySelectorAll('.mag-chips__chip')];
    const million = chips.find((c) => c.dataset.name === 'миллион');
    const trillion = chips.find((c) => c.dataset.name === 'триллион');
    // слот A активен по умолчанию
    million.click();
    // переключаемся на слот B и выбираем триллион
    view.el.querySelector('.slot--b').click();
    trillion.click();
    expect(view.el.querySelector('.verdict__sign').textContent).toBe('<');
  });
  it('ввод 200000 с клавиатуры ставит плашку между ступенями', () => {
    const view = createMagnitudesView();
    // слот A активен по умолчанию; набираем 200000
    const keys = [...view.el.querySelectorAll('.keypad__key')];
    for (const d of ['2', '0', '0', '0', '0', '0']) {
      keys.find((k) => k.textContent === d).click();
    }
    const marker = view.el.querySelector('.ladder__marker');
    expect(marker).not.toBeNull();
    expect(marker.textContent).toContain('200 000');
  });
  it('очистка слота убирает вердикт', () => {
    const view = createMagnitudesView();
    const chips = [...view.el.querySelectorAll('.mag-chips__chip')];
    const million = chips.find((c) => c.dataset.name === 'миллион');
    const trillion = chips.find((c) => c.dataset.name === 'триллион');
    // слот A активен по умолчанию
    million.click();
    // переключаемся на слот B и выбираем триллион
    view.el.querySelector('.slot--b').click();
    trillion.click();
    // оба слота заполнены, вердикт есть
    expect(view.el.querySelector('.verdict__sign')).not.toBeNull();
    // нажимаем очистку активного слота B
    view.el.querySelector('[data-action="clear"]').click();
    // вердикт должен исчезнуть
    expect(view.el.querySelector('.verdict__sign')).toBeNull();
  });
});
