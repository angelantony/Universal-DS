import { describe, expect, it } from 'vitest';
import { defineElement } from './index.js';

describe('server import', () => {
  it('imports and skips registration when custom elements are unavailable', () => {
    class Probe {
      readonly ready = true;
    }
    expect(new Probe().ready).toBe(true);
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'customElements');
    Object.defineProperty(globalThis, 'customElements', { value: undefined, configurable: true });
    try {
      expect(() => {
        defineElement('uds-import-probe', Probe as unknown as CustomElementConstructor);
      }).not.toThrow();
    } finally {
      if (descriptor) Object.defineProperty(globalThis, 'customElements', descriptor);
      else Reflect.deleteProperty(globalThis, 'customElements');
    }
  });
});
