import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Avoid Windows native realpath restrictions in sandboxed checkouts.
  // This project deliberately has one dependency tree and no linked packages.
  resolve: { preserveSymlinks: true },
  test: {
    environment: 'jsdom',
    // Node 25's native storage must not shadow jsdom's browser storage.
    pool: 'forks',
    poolOptions: { forks: { execArgv: ['--no-experimental-webstorage'] } },
    include: ['src/**/*.test.{ts,tsx}'],
    clearMocks: true,
  },
});
