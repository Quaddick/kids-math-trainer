import { defineConfig } from 'vite';

// base: './' — чтобы сборка работала и на GitHub Pages (подпуть), и на VPS.
export default defineConfig({
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
