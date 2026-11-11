import '@uds/themes/css';
import '@uds/tokens/css';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import '../../dist/button/define.js';
import type { UdsButton } from '../../dist/button/index.js';

function createButton(): UdsButton {
  const button = document.createElement('uds-button') as UdsButton;
  document.body.append(button);
  return button;
}

describe('uds-button', () => {
  it('names the control from the slot, submits, resets and keeps a 24px target', async () => {
    document.documentElement.lang = 'en';
    const form = document.createElement('form');
    const button = createButton();
    button.textContent = 'Save';
    button.type = 'submit';
    form.append(button);
    document.body.append(form);
    await button.updateComplete;

    const inner = button.shadowRoot?.querySelector('button');
    const slot = inner?.querySelector('slot');
    if (!(slot instanceof HTMLSlotElement)) throw new Error('Missing label slot');
    const label = slot
      .assignedNodes()
      .map((node) => node.textContent ?? '')
      .join('');
    expect(label).toContain('Save');
    expect(inner?.getAttribute('type')).toBe('button');

    const box = inner?.getBoundingClientRect();
    expect(box?.height).toBeGreaterThanOrEqual(24);
    expect(box?.width).toBeGreaterThanOrEqual(24);

    button.style.setProperty('--uds-button-min-block-size', '1px');
    button.style.setProperty('--uds-button-min-inline-size', '1px');
    await button.updateComplete;
    const shrunk = inner?.getBoundingClientRect();
    expect(shrunk?.height).toBeGreaterThanOrEqual(24);
    expect(shrunk?.width).toBeGreaterThanOrEqual(24);

    const submitted = new Promise<void>((resolve) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        resolve();
      });
    });
    inner?.click();
    await submitted;

    const input = document.createElement('input');
    input.value = 'draft';
    form.append(input);
    button.type = 'reset';
    await button.updateComplete;
    inner?.click();
    expect(input.value).toBe('');

    let activations = 0;
    button.addEventListener('click', () => {
      activations += 1;
    });
    button.disabled = true;
    await button.updateComplete;
    inner?.click();
    expect(activations).toBe(0);
    expect(inner?.disabled).toBe(true);

    form.remove();
  });

  it('keeps focus while loading, announces the status and warns when an icon has no name', async () => {
    const button = createButton();
    button.textContent = 'Save';
    await button.updateComplete;
    button.focus();
    expect(document.activeElement).toBe(button);

    button.loading = true;
    button.loadingLabel = 'Saving';
    await button.updateComplete;
    expect(document.activeElement).toBe(button);
    const inner = button.shadowRoot?.querySelector('button');
    expect(inner?.getAttribute('aria-busy')).toBe('true');
    expect(inner?.disabled).toBe(false);
    expect(button.shadowRoot?.querySelector('.live')?.textContent).toContain('Saving');

    let activations = 0;
    button.addEventListener('click', () => {
      activations += 1;
    });
    inner?.click();
    expect(activations).toBe(0);

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const iconButton = createButton();
    iconButton.iconOnly = true;
    iconButton.iconStart = 'close';
    await iconButton.updateComplete;
    expect(warn).toHaveBeenCalledOnce();
    expect(iconButton.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBeNull();
    iconButton.ariaLabel = 'Close';
    await iconButton.updateComplete;
    expect(iconButton.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBe(
      'Close',
    );
    warn.mockRestore();
    button.remove();
    iconButton.remove();
  });

  it('inherits fieldset disabled and has no automated accessibility violations', async () => {
    document.documentElement.lang = 'en';
    const form = document.createElement('form');
    const fieldset = document.createElement('fieldset');
    const button = createButton();
    button.textContent = 'Send';
    fieldset.append(button);
    form.append(fieldset);
    document.body.append(form);
    await button.updateComplete;

    fieldset.disabled = true;
    await button.updateComplete;
    expect(button.form.formDisabled).toBe(true);
    expect(button.shadowRoot?.querySelector('button')?.disabled).toBe(true);
    fieldset.disabled = false;
    await button.updateComplete;

    const results = await axe.run(form, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    });
    expect(results.violations).toEqual([]);
    form.remove();
  });
});
