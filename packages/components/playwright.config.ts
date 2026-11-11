import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: process.env['UDS_BASE_URL'] ?? 'http://127.0.0.1:4178' },
  ...(process.env['UDS_BASE_URL']
    ? {}
    : {
        webServer: {
          command:
            'node node_modules/vite/bin/vite.js --config e2e/vite.config.ts --port 4178 --strictPort --host 127.0.0.1',
          url: 'http://127.0.0.1:4178',
          reuseExistingServer: !process.env['CI'],
        },
      }),
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
