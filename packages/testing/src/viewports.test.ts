import { describe, expect, it } from 'vitest';
import { STANDARD_VIEWPORTS } from './viewports.js';

describe('STANDARD_VIEWPORTS', () => {
  it('covers the widths required by the testing strategy', () => {
    expect(STANDARD_VIEWPORTS.map((viewport) => viewport.width)).toEqual([
      320, 375, 768, 1024, 1440, 1920,
    ]);
  });

  it('has unique names', () => {
    const names = STANDARD_VIEWPORTS.map((viewport) => viewport.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
