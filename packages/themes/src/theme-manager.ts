import { tokensVersion } from '@uds/tokens';

export const THEME_ATTRIBUTE = 'data-uds-theme';
export const BRAND_ATTRIBUTE = 'data-uds-brand';
export const THEME_STORAGE_KEY = 'uds-theme';
export const BRAND_STORAGE_KEY = 'uds-brand';

export type ThemeName = 'light' | 'dark' | 'high-contrast';

export interface ThemeTarget {
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

export interface ThemeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ApplyThemeOptions {
  theme?: ThemeName;
  /** `null` removes the brand attribute. */
  brand?: string | null;
  persist?: boolean;
  storage?: ThemeStorage;
}

function storageOrDefault(storage: ThemeStorage | undefined): ThemeStorage {
  if (storage) return storage;
  if (typeof globalThis.localStorage === 'undefined') {
    throw new Error('localStorage is not available. Pass a storage implementation to applyTheme.');
  }
  return globalThis.localStorage;
}

/** Applies a theme and/or brand without rebuilding. Optionally persists the choice. */
export function applyTheme(target: ThemeTarget, options: ApplyThemeOptions): void {
  if (options.theme !== undefined) target.setAttribute(THEME_ATTRIBUTE, options.theme);
  if (options.brand === null) target.removeAttribute(BRAND_ATTRIBUTE);
  else if (options.brand !== undefined) target.setAttribute(BRAND_ATTRIBUTE, options.brand);

  if (options.persist !== true) return;
  const storage = storageOrDefault(options.storage);
  if (options.theme !== undefined) storage.setItem(THEME_STORAGE_KEY, options.theme);
  if (options.brand === null) storage.removeItem(BRAND_STORAGE_KEY);
  else if (options.brand !== undefined) storage.setItem(BRAND_STORAGE_KEY, options.brand);
}

export function readPersistedPreferences(storage: Pick<ThemeStorage, 'getItem'>): {
  theme: string | null;
  brand: string | null;
} {
  return {
    theme: storage.getItem(THEME_STORAGE_KEY),
    brand: storage.getItem(BRAND_STORAGE_KEY),
  };
}

/**
 * Inline script for `<head>`, so the persisted theme is applied before first paint.
 * It touches only `localStorage` and `document.documentElement`.
 */
export function themeInitScript(): string {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var b=localStorage.getItem(${JSON.stringify(BRAND_STORAGE_KEY)});if(t)document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},t);if(b)document.documentElement.setAttribute(${JSON.stringify(BRAND_ATTRIBUTE)},b);}catch(e){}})();`;
}

/** Empty when the token stylesheet is absent. A different non-empty value is a mismatch. */
export function tokensVersionMismatch(actual: string, expected: string = tokensVersion): boolean {
  const value = actual.trim().replaceAll('"', '');
  return value !== '' && value !== expected;
}
