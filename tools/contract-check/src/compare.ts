export interface PublicContract {
  readonly properties: readonly string[];
  readonly attributes: readonly string[];
  readonly events: readonly string[];
  readonly slots: readonly string[];
  readonly cssParts: readonly string[];
  readonly cssProperties: readonly string[];
}

export function contractDifferences(
  metadata: PublicContract,
  implementation: PublicContract,
): string[] {
  const differences: string[] = [];
  const sides = [
    ['properties', metadata.properties, implementation.properties],
    ['attributes', metadata.attributes, implementation.attributes],
    ['events', metadata.events, implementation.events],
    ['slots', metadata.slots, implementation.slots],
    ['cssParts', metadata.cssParts, implementation.cssParts],
    ['cssProperties', metadata.cssProperties, implementation.cssProperties],
  ] as const;
  for (const [label, expected, actual] of sides) {
    const missing = expected.filter((item) => !actual.includes(item));
    const extra = actual.filter((item) => !expected.includes(item));
    if (missing.length > 0)
      differences.push(`${label} missing from implementation: ${missing.join(', ')}`);
    if (extra.length > 0) differences.push(`${label} missing from metadata: ${extra.join(', ')}`);
  }
  return differences;
}
