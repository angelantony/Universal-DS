export interface DtcgToken {
  readonly path: readonly string[];
  readonly token: Record<string, unknown>;
}

function walk(value: unknown, path: string[], acc: DtcgToken[]): void {
  if (typeof value !== 'object' || value === null) return;
  if ('$value' in value) {
    acc.push({ path, token: value });
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith('$')) continue;
    walk(child, [...path, key], acc);
  }
}

export function collectTokens(tree: unknown): DtcgToken[] {
  const tokens: DtcgToken[] = [];
  walk(tree, [], tokens);
  return tokens;
}

/** Validates DTCG tokens. Alias targets may live in `knownPaths` when files are split. */
export function assertValidDtcg(
  tree: unknown,
  fileLabel: string,
  knownPaths?: ReadonlySet<string>,
): DtcgToken[] {
  const tokens = collectTokens(tree);
  if (tokens.length === 0) throw new Error(`${fileLabel} does not contain DTCG tokens`);
  const paths = new Set(tokens.map((entry) => entry.path.join('.')));
  for (const entry of tokens) {
    const location = entry.path.join('.');
    if (typeof entry.token['$type'] !== 'string' || entry.token['$type'].length === 0) {
      throw new Error(`${fileLabel}: missing $type at ${location}`);
    }
    const raw = JSON.stringify(entry.token['$value']);
    for (const match of raw.matchAll(/\{([a-zA-Z0-9.]+)\}/g)) {
      const ref = match[1];
      if (ref !== undefined && !(knownPaths ?? paths).has(ref)) {
        throw new Error(`${fileLabel}: broken alias {${ref}} in ${location}`);
      }
    }
  }
  return tokens;
}
