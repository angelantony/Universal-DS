function isDevelopment(): boolean {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env?.['NODE_ENV'] !== 'production';
}

/**
 * Idempotent custom element registration.
 * Does nothing during SSR (no `customElements`) and never throws when another copy
 * of the library already registered the same tag.
 */
export function defineElement(tag: string, ctor: CustomElementConstructor): void {
  if (typeof globalThis.customElements === 'undefined') return;
  const existing = customElements.get(tag);
  if (existing === undefined) {
    customElements.define(tag, ctor);
    return;
  }
  if (existing !== ctor && isDevelopment()) {
    console.warn(
      `[uds] <${tag}> is already defined by a different class. The existing registration was kept.`,
    );
  }
}
