import { defineConfig } from 'vitest/config';

// Isolated test config (no PWA/Vite plugins) so we can run the store's
// bidirectional-sync verification without a browser or the production build.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
