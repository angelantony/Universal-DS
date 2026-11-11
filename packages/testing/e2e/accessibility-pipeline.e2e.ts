import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_22_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test('reports no violations for an accessible native form', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <head><title>Accessible form</title></head>
      <body>
        <main>
          <form>
            <label for="email">Email</label>
            <input id="email" type="email" />
            <button type="submit">Send</button>
          </form>
        </main>
      </body>
    </html>
  `);

  const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA_TAGS).analyze();
  expect(results.violations).toEqual([]);
});

test('detects a known violation, so a green run is meaningful', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <head><title>Broken form</title></head>
      <body><main><button type="button"></button></main></body>
    </html>
  `);

  const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA_TAGS).analyze();
  expect(results.violations.map((violation) => violation.id)).toContain('button-name');
});

test('moves focus to the native button with the keyboard', async ({ page, browserName }) => {
  await page.setContent('<main><button type="button">Action</button></main>');
  // Safari on macOS skips buttons on Tab unless the user presses Option+Tab
  // (or enables "Press Tab to highlight each item"); WebKit reproduces it.
  const focusNextKey =
    browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await page.keyboard.press(focusNextKey);
  await expect(page.getByRole('button', { name: 'Action' })).toBeFocused();
});
