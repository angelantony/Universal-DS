export function buildThemes(): Promise<
  Record<string, { css: string; resolved: Record<string, string | number> }>
>;
