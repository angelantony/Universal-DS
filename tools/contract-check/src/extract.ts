import type { PublicContract } from './compare.js';

function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** Reads the public contract from Lit decorators and documentation tags. */
export function extractContract(source: string): PublicContract {
  const properties: string[] = [];
  const attributes: string[] = [];
  for (const match of source.matchAll(/@property\(([^)]*)\)\s*(?:override\s+)?accessor\s+(\w+)/g)) {
    const options = match[1] ?? '';
    const name = match[2];
    if (!name) continue;
    properties.push(name);
    if (/attribute:\s*false/.test(options)) continue;
    const explicit = /attribute:\s*'([^']+)'/.exec(options);
    if (explicit?.[1]) attributes.push(explicit[1]);
    else if (/reflect:\s*true/.test(options)) attributes.push(kebab(name));
  }
  const events = [...source.matchAll(/@fires\s+(\S+)/g)]
    .map((match) => match[1])
    .filter((name): name is string => name !== undefined);
  const slots = [...source.matchAll(/@slot\s+([^\n]*)/g)].map((match) => {
    const rest = (match[1] ?? '').trim();
    if (rest.startsWith('-')) return '';
    return rest.split(/\s+/)[0] ?? '';
  });
  const cssParts = [...source.matchAll(/@csspart\s+(\S+)/g)]
    .map((match) => match[1])
    .filter((name): name is string => name !== undefined);
  const cssProperties = [...source.matchAll(/@cssprop\s+(--uds-\S+)/g)]
    .map((match) => match[1])
    .filter((name): name is string => name !== undefined);
  return { properties, attributes, events, slots, cssParts, cssProperties };
}
