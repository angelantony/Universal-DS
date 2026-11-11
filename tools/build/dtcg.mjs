/**
 * @param {unknown} value
 * @param {string[]} path
 * @param {{ path: string[], token: Record<string, unknown> }[]} acc
 */
function walk(value, path, acc) {
  if (typeof value !== 'object' || value === null) return;
  if ('$value' in value) {
    acc.push({ path, token: /** @type {Record<string, unknown>} */ (value) });
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith('$')) continue;
    walk(child, [...path, key], acc);
  }
}

/**
 * @param {unknown} tree
 */
export function collectTokens(tree) {
  /** @type {{ path: string[], token: Record<string, unknown> }[]} */
  const tokens = [];
  walk(tree, [], tokens);
  return tokens;
}

/** CSS custom property name produced by Style Dictionary with prefix `uds`. */
export function cssName(path) {
  const kebab = path
    .map((part) =>
      part
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .toLowerCase(),
    )
    .join('-');
  return `--uds-${kebab}`;
}

/**
 * @param {unknown} tree
 * @param {string} fileLabel
 * @param {Set<string>} [knownPaths]
 */
export function assertValidDtcg(tree, fileLabel, knownPaths) {
  const tokens = collectTokens(tree);
  if (tokens.length === 0) {
    throw new Error(`${fileLabel} does not contain DTCG tokens`);
  }
  const paths = new Set(tokens.map((entry) => entry.path.join('.')));
  for (const entry of tokens) {
    if (typeof entry.token['$type'] !== 'string' || entry.token['$type'].length === 0) {
      throw new Error(`${fileLabel}: missing $type at ${entry.path.join('.')}`);
    }
    if (!('$value' in entry.token)) {
      throw new Error(`${fileLabel}: missing $value at ${entry.path.join('.')}`);
    }
    const raw = JSON.stringify(entry.token['$value']);
    for (const match of raw.matchAll(/\{([a-zA-Z0-9.]+)\}/g)) {
      const ref = match[1];
      if (!ref) continue;
      const known = knownPaths ?? paths;
      if (!known.has(ref)) {
        throw new Error(`${fileLabel}: broken alias {${ref}} in ${entry.path.join('.')}`);
      }
    }
  }
  return tokens;
}

/**
 * @param {string[]} path
 */
export function camelName(path) {
  return path
    .map((part, index) => {
      const words = part
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean);
      return words
        .map((word, wordIndex) => {
          const lower = word.toLowerCase();
          if (index === 0 && wordIndex === 0) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
    })
    .join('');
}
