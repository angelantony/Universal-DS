import { expect, test } from '@playwright/test';

/**
 * Pixel baselines are produced only in mcr.microsoft.com/playwright:v1.65.0-jammy.
 * Run with UDS_VISUAL=1. The default suite skips this file.
 */
test.skip(
  process.env['UDS_VISUAL'] !== '1',
  'Visual baselines belong to the Playwright Docker image.',
);

const viewports = [
  { name: 'mobile-s', width: 320, height: 900 },
  { name: 'mobile-m', width: 375, height: 900 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'laptop', width: 1024, height: 900 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'desktop-hd', width: 1920, height: 900 },
] as const;

const themes = ['light', 'dark', 'high-contrast'] as const;

test('records variants, sizes and states for every theme and viewport', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const stage = document.querySelector('#stage');
    if (!stage) return;
    stage.replaceChildren();
    const add = (attributes: Record<string, string>, text: string, label?: string) => {
      const button = document.createElement('uds-button') as HTMLElement & { ariaLabel: string };
      for (const [name, value] of Object.entries(attributes)) button.setAttribute(name, value);
      if (label !== undefined) button.ariaLabel = label;
      button.textContent = text;
      stage.append(button);
    };
    for (const tone of ['neutral', 'danger', 'success', 'warning']) {
      for (const variant of ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'text']) {
        add({ variant, tone }, `${variant} ${tone}`);
      }
    }
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) add({ size }, size);
    add({ disabled: '' }, 'disabled');
    add({ loading: '' }, 'loading');
    add({ 'icon-only': '', 'icon-start': 'check' }, '', 'Confirm');
    add({ 'icon-start': 'check' }, 'Save');
  });
  await page.evaluate(async () => {
    const pending = [...document.querySelectorAll('uds-button')].map((element) => {
      const control = element as HTMLElement & { updateComplete?: Promise<unknown> };
      return control.updateComplete ?? Promise.resolve();
    });
    await Promise.all(pending);
  });

  for (const theme of themes) {
    await page.evaluate((value) => {
      document.documentElement.setAttribute('data-uds-theme', value);
    }, theme);
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.locator('#stage')).toHaveScreenshot(
        `button-${theme}-${viewport.name}.png`,
        {
          animations: 'disabled',
        },
      );
    }
  }
});
