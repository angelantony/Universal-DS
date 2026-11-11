import { describe, expect, it } from 'vitest';
import { builtInIcons } from './built-in.js';

describe('built-in icons', () => {
  it('contains no active content and inherits color', () => {
    expect(Object.keys(builtInIcons).length).toBeGreaterThan(0);
    for (const svg of Object.values(builtInIcons)) {
      expect(svg.toLowerCase()).not.toContain('<script');
      expect(svg.toLowerCase()).not.toContain('onload');
      expect(svg).toContain('currentColor');
    }
  });
});
