import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { conditions: ['@uds/source'] },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
