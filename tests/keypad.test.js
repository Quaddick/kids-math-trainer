import { describe, it, expect, vi } from 'vitest';
import { createKeypad } from '../src/ui/keypad.js';

describe('createKeypad', () => {
  it('создаёт 12 кнопок (10 цифр + удалить + очистить)', () => {
    const el = createKeypad({ onDigit() {}, onDelete() {}, onClear() {} });
    expect(el.querySelectorAll('button').length).toBe(12);
  });
  it('клик по цифре вызывает onDigit с этой цифрой', () => {
    const onDigit = vi.fn();
    const el = createKeypad({ onDigit, onDelete() {}, onClear() {} });
    const seven = [...el.querySelectorAll('.keypad__key')].find((b) => b.textContent === '7');
    seven.click();
    expect(onDigit).toHaveBeenCalledWith('7');
  });
  it('вызывает onDelete и onClear', () => {
    const onDelete = vi.fn();
    const onClear = vi.fn();
    const el = createKeypad({ onDigit() {}, onDelete, onClear });
    el.querySelector('[data-action="delete"]').click();
    el.querySelector('[data-action="clear"]').click();
    expect(onDelete).toHaveBeenCalled();
    expect(onClear).toHaveBeenCalled();
  });
});
