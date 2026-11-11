import { sanitizeSvg } from './sanitize.js';

export type IconResolver = (name: string) => string | undefined | Promise<string | undefined>;

/**
 * Application resolvers run first, then the trusted built-in set.
 * Strings from resolvers are sanitized. Trusted icons are the build output of the
 * proprietary set and skip the sanitizer.
 */
export class IconRegistry {
  readonly #resolvers: IconResolver[] = [];
  readonly #trusted = new Map<string, string>();
  readonly #cache = new Map<string, string>();

  register(resolver: IconResolver): void {
    this.#resolvers.push(resolver);
    this.#cache.clear();
  }

  registerTrusted(icons: Readonly<Record<string, string>>): void {
    for (const [name, svg] of Object.entries(icons)) this.#trusted.set(name, svg);
  }

  async resolve(name: string): Promise<string | undefined> {
    const cached = this.#cache.get(name);
    if (cached !== undefined) return cached;
    for (const resolver of this.#resolvers) {
      const svg = await resolver(name);
      if (svg === undefined) continue;
      const safe = await sanitizeSvg(svg);
      if (safe === '') continue;
      this.#cache.set(name, safe);
      return safe;
    }
    return this.#trusted.get(name);
  }
}

export const iconRegistry = new IconRegistry();
