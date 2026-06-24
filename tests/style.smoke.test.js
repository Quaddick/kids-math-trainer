import { describe, it, expect } from 'vitest';
import { createApp } from '../src/router.js';

describe('приложение со стилями', () => {
  it('монтируется без ошибок и содержит вкладки', () => {
    const app = createApp();
    expect(app.querySelector('.tabs')).not.toBeNull();
    expect(app.querySelector('.view-host')).not.toBeNull();
  });
});
