import { html } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import { UdsElement, baseStyles, defineElement } from './index.js';
import { FormAssociationController } from './form-association.js';

describe('UdsElement', () => {
  it('opens a shadow root that delegates focus and ships the base styles', async () => {
    class StyledProbe extends UdsElement {
      override render() {
        return html`<button type="button">Probe</button>`;
      }
    }
    defineElement('uds-styled-probe', StyledProbe);
    const element = document.createElement('uds-styled-probe') as StyledProbe;
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot?.mode).toBe('open');
    expect(element.shadowRoot?.delegatesFocus).toBe(true);
    expect(baseStyles.cssText).toContain('forced-colors');
    expect(baseStyles.cssText).toContain('--uds-color-focus-ring');
    element.remove();
  });

  it('keeps an existing registration when the same tag is defined twice', () => {
    class First extends HTMLElement {}
    class Second extends HTMLElement {}
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    defineElement('uds-define-probe', First);
    defineElement('uds-define-probe', First);
    defineElement('uds-define-probe', Second);
    expect(customElements.get('uds-define-probe')).toBe(First);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});

describe('form association', () => {
  it('submits and resets the light-DOM form and inherits fieldset disabled', async () => {
    class FormProbe extends UdsElement {
      static formAssociated = true;
      readonly form = new FormAssociationController(this);

      override render() {
        return html`<button type="button" ?disabled=${this.form.formDisabled}>Send</button>`;
      }

      formDisabledCallback(disabled: boolean): void {
        this.form.setFormDisabled(disabled);
      }
    }
    defineElement('uds-form-probe', FormProbe);

    const form = document.createElement('form');
    const fieldset = document.createElement('fieldset');
    const probe = document.createElement('uds-form-probe') as FormProbe;
    fieldset.append(probe);
    form.append(fieldset);
    document.body.append(form);
    await probe.updateComplete;

    expect(probe.form.internals.form).toBe(form);
    const submitted = new Promise<void>((resolve) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        resolve();
      });
    });
    probe.form.submit();
    await submitted;

    const input = document.createElement('input');
    input.value = 'value';
    form.append(input);
    probe.form.reset();
    expect(input.value).toBe('');

    fieldset.disabled = true;
    await probe.updateComplete;
    expect(probe.form.formDisabled).toBe(true);
    form.remove();
  });
});
