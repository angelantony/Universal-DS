import { describe, expect, it } from 'vitest';

/** Minimum platform features listed in docs/architecture/testing-strategy.md §3. */
describe('supported browser platform', () => {
  it('supports Custom Elements v1', () => {
    expect(typeof customElements.define).toBe('function');
  });

  it('supports open Shadow DOM with adopted stylesheets', () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open', delegatesFocus: true });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(':host { display: block; }');
    root.adoptedStyleSheets = [sheet];
    expect(root.adoptedStyleSheets).toHaveLength(1);
  });

  it('supports form-associated custom elements through ElementInternals', () => {
    class FormAssociatedProbe extends HTMLElement {
      static formAssociated = true;
      readonly internals = this.attachInternals();
    }
    customElements.define('uds-platform-probe', FormAssociatedProbe);

    const form = document.createElement('form');
    const probe = document.createElement('uds-platform-probe') as FormAssociatedProbe;
    form.append(probe);
    document.body.append(form);

    expect(probe.internals.form).toBe(form);
    form.remove();
  });

  it('supports :focus-visible and container queries', () => {
    expect(CSS.supports('selector(:focus-visible)')).toBe(true);
    expect(CSS.supports('container-type: inline-size')).toBe(true);
  });
});
