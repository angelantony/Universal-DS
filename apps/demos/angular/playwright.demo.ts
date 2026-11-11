import { defineConfig } from '@playwright/test';

const port = 4183;

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: `http://127.0.0.1:${String(port)}` },
  webServer: {
    command: `node node_modules/@angular/cli/bin/ng.js serve --port ${String(port)} --host 127.0.0.1`,
    url: `http://127.0.0.1:${String(port)}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
