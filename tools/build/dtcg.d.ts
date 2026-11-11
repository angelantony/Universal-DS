export function collectTokens(tree: unknown): { path: string[]; token: Record<string, unknown> }[];

export function assertValidDtcg(
  tree: unknown,
  fileLabel: string,
  knownPaths?: Set<string>,
): { path: string[]; token: Record<string, unknown> }[];

export function cssName(path: string[]): string;

export function camelName(path: string[]): string;
