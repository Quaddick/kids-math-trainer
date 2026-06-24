import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// base: './' — чтобы сборка работала и на GitHub Pages (подпуть), и на VPS.
export default defineConfig({
  base: './',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        lang: 'ru',
        name: 'Считаем со Львёнком',
        short_name: 'Львёнок',
        description: 'Наглядное сложение и сравнение чисел для детей',
        theme_color: '#ffd089',
        background_color: '#fff8ef',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
