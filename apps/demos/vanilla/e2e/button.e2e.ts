import { expect, test } from '@playwright/test';

test('properties, slot, click, submit and reset', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => customElements.get('uds-button') !== undefined);

  const button = page.locator('#label-button');
  await expect(button).toHaveJSProperty('variant', 'outline');
  await expect(button).toHaveJSProperty('tone', 'danger');
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await button.click();
  await expect(page.locator('#count')).toHaveText('1');

  await expect(page.locator('#submit-button')).toHaveJSProperty('type', 'submit');
  await expect(page.locator('#reset-button')).toHaveJSProperty('type', 'reset');
  await page.locator('#title').fill('draft');
  await page.locator('#submit-button').click();
  await expect(page.locator('#submitted')).toHaveText('yes');
  await page.locator('#reset-button').click();
  await expect(page.locator('#title')).toHaveValue('');

  await expect(page.locator('#disabled')).toHaveJSProperty('disabled', true);
  await page.locator('#disabled').click({ force: true });
  await expect(page.locator('#disabled-count')).toHaveText('0');
});
