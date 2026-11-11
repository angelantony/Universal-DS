import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const WCAG_22_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const viewports = [
  { name: 'mobile-s', width: 320, height: 568 },
  { name: 'mobile-m', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'desktop-hd', width: 1920, height: 1080 },
] as const;

const themes = ['light', 'dark', 'high-contrast'] as const;
const variants = ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'text'] as const;
const tones = ['neutral', 'danger', 'success', 'warning'] as const;

async function paintMatrix(page: Page): Promise<void> {
  await page.evaluate(
    async ({ variants: variantList, tones: toneList }) => {
      const stage = document.querySelector('#stage');
      if (!stage) return;
      stage.replaceChildren();
      for (const variant of variantList) {
        for (const tone of toneList) {
          const button = document.createElement('uds-button');
          button.setAttribute('variant', variant);
          button.setAttribute('tone', tone);
          button.textContent = `${variant} ${tone}`;
          stage.append(button);
        }
      }
      const disabled = document.createElement('uds-button');
      disabled.setAttribute('disabled', '');
      disabled.textContent = 'Disabled';
      const loading = document.createElement('uds-button');
      loading.setAttribute('loading', '');
      loading.textContent = 'Loading';
      const icon = document.createElement('uds-button') as HTMLElement & { ariaLabel: string };
      icon.setAttribute('icon-only', '');
      icon.setAttribute('icon-start', 'check');
      icon.ariaLabel = 'Confirm';
      stage.append(disabled, loading, icon);
      const pending = [...stage.querySelectorAll('uds-button')].map((element) => {
        const control = element as HTMLElement & { updateComplete?: Promise<unknown> };
        return control.updateComplete ?? Promise.resolve();
      });
      await Promise.all(pending);
    },
    { variants, tones },
  );
}

test('fits the six viewports and reflows at 200% and 400%', async ({ page }) => {
  await page.goto('/');
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );
    expect(overflow, viewport.name).toBe(true);
  }

  await page.setViewportSize({ width: 320, height: 568 });
  for (const zoom of ['2', '4']) {
    await page.evaluate((value) => {
      document.documentElement.style.zoom = value;
    }, zoom);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    );
    expect(overflow, `zoom ${zoom}`).toBe(true);
  }
});

test('has no WCAG 2.2 AA violations for each theme', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const theme of themes) {
    await page.evaluate((value) => {
      document.documentElement.setAttribute('data-uds-theme', value);
    }, theme);
    await paintMatrix(page);
    const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA_TAGS).analyze();
    expect(results.violations, theme).toEqual([]);
  }
});

test('activates from the keyboard', async ({ page, browserName }) => {
  await page.goto('/');
  const focusNextKey =
    browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await page.keyboard.press(focusNextKey);
  await expect(page.getByRole('button', { name: 'Salva' })).toBeFocused();
  await page.keyboard.press('Enter');
});
