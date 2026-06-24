import { describe, it, expect } from 'vitest';
import { createApp } from '../src/router.js';

describe('createApp', () => {
  it('две вкладки, по умолчанию активна Сложение', () => {
    const app = createApp();
    const tabs = [...app.querySelectorAll('.tabs__tab')];
    expect(tabs.length).toBe(2);
    expect(app.querySelector('.view--addition')).not.toBeNull();
    expect(app.querySelector('.view--magnitudes')).toBeNull();
  });
  it('переключение на Величины показывает лесенку', () => {
    const app = createApp();
    const tabMag = [...app.querySelectorAll('.tabs__tab')].find((t) => t.dataset.view === 'magnitudes');
    tabMag.click();
    expect(app.querySelector('.view--magnitudes')).not.toBeNull();
    expect(app.querySelector('.view--addition')).toBeNull();
  });
});
