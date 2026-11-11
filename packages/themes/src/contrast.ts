/** WCAG 2.2 relative luminance and contrast, used to gate theme tokens. */

const TEXT_CONTRAST = 4.5;
const NON_TEXT_CONTRAST = 3;

export const TEXT_PAIRS = [
  ['--uds-color-text-default', '--uds-color-background-canvas'],
  ['--uds-color-text-default', '--uds-color-background-surface'],
  ['--uds-color-text-muted', '--uds-color-background-canvas'],
  ['--uds-color-text-muted', '--uds-color-background-surface'],
  ['--uds-color-action-primary-text', '--uds-color-action-primary-background'],
  ['--uds-color-action-secondary-text', '--uds-color-action-secondary-background'],
  ['--uds-color-success-text', '--uds-color-success-background'],
  ['--uds-color-warning-text', '--uds-color-warning-background'],
  ['--uds-color-danger-text', '--uds-color-danger-background'],
  ['--uds-color-info-text', '--uds-color-info-background'],
  ['--uds-color-danger-on-canvas', '--uds-color-background-canvas'],
  ['--uds-color-danger-on-canvas', '--uds-color-background-surface'],
  ['--uds-color-success-on-canvas', '--uds-color-background-canvas'],
  ['--uds-color-success-on-canvas', '--uds-color-background-surface'],
  ['--uds-color-warning-on-canvas', '--uds-color-background-canvas'],
  ['--uds-color-warning-on-canvas', '--uds-color-background-surface'],
] as const;

export const NON_TEXT_PAIRS = [
  ['--uds-color-focus-ring', '--uds-color-background-canvas'],
  ['--uds-color-focus-ring', '--uds-color-background-surface'],
  ['--uds-color-border-strong', '--uds-color-background-canvas'],
  ['--uds-color-action-secondary-border', '--uds-color-action-secondary-background'],
] as const;

export interface ContrastFailure {
  readonly foreground: string;
  readonly background: string;
  readonly ratio: number;
  readonly minimum: number;
}

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string) => {
    const digits = hex.trim().replace('#', '').slice(0, 6);
    if (!/^[0-9a-fA-F]{6}$/.test(digits)) {
      throw new Error(`Expected a 6-digit hex color, received "${hex}"`);
    }
    return (
      0.2126 * channel(Number.parseInt(digits.slice(0, 2), 16)) +
      0.7152 * channel(Number.parseInt(digits.slice(2, 4), 16)) +
      0.0722 * channel(Number.parseInt(digits.slice(4, 6), 16))
    );
  };
  const first = luminance(foreground);
  const second = luminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

export function auditContrast(
  colors: Readonly<Record<string, string>>,
): readonly ContrastFailure[] {
  const failures: ContrastFailure[] = [];
  const check = (pairs: readonly (readonly [string, string])[], minimum: number) => {
    for (const [foreground, background] of pairs) {
      const fg = colors[foreground];
      const bg = colors[background];
      if (fg === undefined || bg === undefined) {
        throw new Error(`Missing resolved color ${fg === undefined ? foreground : background}`);
      }
      const ratio = contrastRatio(fg, bg);
      if (ratio < minimum) failures.push({ foreground, background, ratio, minimum });
    }
  };
  check(TEXT_PAIRS, TEXT_CONTRAST);
  check(NON_TEXT_PAIRS, NON_TEXT_CONTRAST);
  return failures;
}
