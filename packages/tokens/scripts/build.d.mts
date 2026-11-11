export function buildTokens(): Promise<{
  version: string;
  css: string;
  resolved: Record<string, string>;
}>;
