import { describe, expect, it } from 'vitest';
import {
  builtInIcons,
  iconRegistry,
  registerBuiltInIcons,
  sanitizeSvg,
  type UdsIcon,
} from '../dist/index.js';
import '../dist/define.js';

describe('svg sanitizer', () => {
  it('removes scripts, event handlers, foreign content and external references', async () => {
    const safe = await sanitizeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onload="alert(1)">
        <script>alert(1)</script>
        <foreignObject><iframe src="https://evil.example"></iframe></foreignObject>
        <path d="M0 0h1" fill="red" href="https://evil.example/x"/>
        <a href="javascript:alert(1)"><path d="M0 0h2"/></a>
      </svg>
    `);
    expect(safe.toLowerCase()).not.toContain('script');
    expect(safe.toLowerCase()).not.toContain('onload');
    expect(safe.toLowerCase()).not.toContain('foreignobject');
    expect(safe.toLowerCase()).not.toContain('iframe');
    expect(safe.toLowerCase()).not.toContain('href');
    expect(safe).toContain('currentColor');
    expect(safe).toContain('M0 0h1');
  });
});

describe('uds-icon', () => {
  it('renders a trusted icon, sanitizes a custom one and exposes a name only when labeled', async () => {
    registerBuiltInIcons();
    iconRegistry.register((name) =>
      name === 'custom'
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><script></script><path d="M1 1h1" fill="#ff0000"/></svg>'
        : undefined,
    );

    const icon = document.createElement('uds-icon') as UdsIcon;
    icon.name = 'check';
    document.body.append(icon);
    await icon.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await icon.updateComplete;
    expect(icon.shadowRoot?.querySelector('svg')).not.toBeNull();
    expect(icon.shadowRoot?.querySelector('[aria-hidden="true"]')).not.toBeNull();

    icon.label = 'Confirm';
    await icon.updateComplete;
    const graphic = icon.shadowRoot?.querySelector('[part="graphic"]');
    expect(graphic?.getAttribute('role')).toBe('img');
    expect(graphic?.getAttribute('aria-label')).toBe('Confirm');
    expect(graphic?.getAttribute('aria-hidden')).toBeNull();

    icon.name = 'custom';
    await icon.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await icon.updateComplete;
    const markup = icon.shadowRoot?.querySelector('svg')?.outerHTML ?? '';
    expect(markup.toLowerCase()).not.toContain('script');
    expect(markup).toContain('currentColor');
    expect(Object.keys(builtInIcons)).toContain('check');
    icon.remove();
  });
});
