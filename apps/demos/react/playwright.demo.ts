import { defineConfig } from '@playwright/test';

const port = 4182;

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: `http://127.0.0.1:${String(port)}` },
  webServer: {
    command: `node node_modules/vite/bin/vite.js --port ${String(port)} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${String(port)}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
