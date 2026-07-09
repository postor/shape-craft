import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    VitePWA({
      // `prompt` => we control when the new SW takes over, so we can show a
      // "update available" banner instead of silently swapping the page.
      registerType: 'prompt',
      // Only register the SW in production builds (dev HMR + SW caching clash).
      devOptions: { enabled: false },
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'ShapeCraft · 元件库与编辑器',
        short_name: 'ShapeCraft',
        description: 'AI 驱动的 3D 元件库与元件编辑器',
        theme_color: '#0f1115',
        background_color: '#0f1115',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Cache the app shell + assets so the editor works fully offline.
        globPatterns: ['**/*.{js,css,html,svg,woff2,png,ico}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        // Three.js is dynamically imported; make sure chunks are precached.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
