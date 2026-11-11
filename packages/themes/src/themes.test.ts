import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { collectTokens } from '@uds/tokens';
import { auditContrast } from './contrast.js';
import {
  applyTheme,
  readPersistedPreferences,
  themeInitScript,
  tokensVersionMismatch,
} from './theme-manager.js';

const here = dirname(fileURLToPath(import.meta.url));

interface ThemeBuild {
  css: string;
  resolved: Record<string, string>;
}

function parseJson(text: string): unknown {
  return JSON.parse(text) as unknown;
}

function callExport(module: unknown, name: string): unknown {
  if (typeof module !== 'object' || module === null || !(name in module)) {
    throw new Error(`Missing ${name}`);
  }
  const exported = (module as Record<string, unknown>)[name];
  if (typeof exported !== 'function') throw new Error(`Missing ${name}`);
  const fn = exported as () => unknown;
  return fn();
}

function isThemeMap(value: unknown): value is Record<string, ThemeBuild> {
  return typeof value === 'object' && value !== null;
}

async function loadThemes(): Promise<Record<string, ThemeBuild>> {
  const imported: unknown = await import('../scripts/build.mjs');
  const built: unknown = await Promise.resolve(callExport(imported, 'buildThemes'));
  if (!isThemeMap(built)) throw new Error('Unexpected theme build output');
  return built;
}
const tokensRoot = resolve(here, '../../tokens/src/tokens/semantic.json');

function colorPaths(tree: unknown): string[] {
  return collectTokens(tree)
    .filter((token) => token.path[0] === 'color')
    .map((token) => token.path.join('.'))
    .sort();
}

describe('themes', () => {
  it('keeps the same semantic color paths in every theme', async () => {
    const light = colorPaths(parseJson(await readFile(tokensRoot, 'utf8')));
    for (const theme of ['dark', 'high-contrast']) {
      const tree = parseJson(await readFile(resolve(here, 'themes', `${theme}.json`), 'utf8'));
      expect(colorPaths(tree)).toEqual(light);
    }
  });

  it('meets WCAG contrast for text, focus and controls', async () => {
    const themes = await loadThemes();
    for (const theme of ['light', 'dark', 'high-contrast'] as const) {
      expect(auditContrast(themes[theme]?.resolved ?? {}), theme).toEqual([]);
    }
    const onLight = { ...themes['light']?.resolved, ...themes['brand-a']?.resolved };
    const onDark = { ...themes['dark']?.resolved, ...themes['brand-a']?.resolved };
    expect(auditContrast(onLight), 'brand on light').toEqual([]);
    expect(auditContrast(onDark), 'brand on dark').toEqual([]);
  });

  it('applies, persists and restores a theme without a rebuild', () => {
    const attributes = new Map<string, string>();
    const target = {
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      removeAttribute: (name: string) => attributes.delete(name),
    };
    const stored = new Map<string, string>();
    const storage = {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => stored.set(key, value),
      removeItem: (key: string) => stored.delete(key),
    };
    applyTheme(target, { theme: 'dark', brand: 'brand-a', persist: true, storage });
    expect(attributes.get('data-uds-theme')).toBe('dark');
    expect(readPersistedPreferences(storage)).toEqual({ theme: 'dark', brand: 'brand-a' });
    applyTheme(target, { brand: null, persist: true, storage });
    expect(attributes.has('data-uds-brand')).toBe(false);
    expect(stored.has('uds-brand')).toBe(false);
    expect(themeInitScript()).toContain('data-uds-theme');
    expect(tokensVersionMismatch('')).toBe(false);
    expect(tokensVersionMismatch('0.0.0')).toBe(false);
    expect(tokensVersionMismatch('9.9.9')).toBe(true);
  });
});
