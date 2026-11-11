import { describe, expect, it } from 'vitest';
import { componentMetadataJsonSchema, componentMetadataSchema, createRegistry } from './index.js';

const probe = {
  schemaVersion: 1,
  id: 'probe',
  tagName: 'uds-probe',
  name: 'Probe',
  description: 'A probe.',
  category: 'feedback',
  status: 'experimental',
  since: '0.0.0',
  properties: [
    {
      name: 'variant',
      description: 'Variant.',
      type: { kind: 'enum', values: ['alpha'] },
      default: 'alpha',
    },
  ],
  events: [],
  slots: [],
  cssParts: [],
  cssProperties: [],
  states: [],
  constraints: [],
  examples: [],
  accessibility: { role: 'generic', keyboard: [], requirements: [], knownLimitations: [] },
  responsive: { behavior: 'Inline.' },
};

describe('component metadata', () => {
  it('rejects an enum default outside the allowed values and a stable component without requirements', () => {
    expect(() =>
      componentMetadataSchema.parse({
        ...probe,
        properties: [{ ...probe.properties[0], default: 'nope' }],
      }),
    ).toThrow(/allowed values/);
    expect(() => componentMetadataSchema.parse({ ...probe, status: 'stable' })).toThrow(
      /accessibility requirements/,
    );
  });

  it('builds a registry and a JSON schema', () => {
    const registry = createRegistry([probe, { ...probe, id: 'other', tagName: 'uds-other' }]);
    expect(registry.get('probe')?.tagName).toBe('uds-probe');
    expect(registry.byCategory('feedback')).toHaveLength(2);
    expect(() => createRegistry([probe, probe])).toThrow(/Duplicate component id/);
    expect(componentMetadataJsonSchema()).toHaveProperty('properties');
  });
});
