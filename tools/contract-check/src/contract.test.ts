import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentMetadataSchema } from '@uds/metadata';
import { describe, expect, it } from 'vitest';
import { probeMetadata } from '../fixtures/probe.meta.js';
import { contractDifferences } from './compare.js';
import { extractContract } from './extract.js';

describe('metadata contract check', () => {
  it('matches the fixture implementation and rejects drift', async () => {
    const source = await readFile(
      resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures/probe-element.ts'),
      'utf8',
    );
    const implementation = extractContract(source);
    const metadata = componentMetadataSchema.parse(probeMetadata);
    expect(
      contractDifferences(
        {
          properties: metadata.properties.map((property) => property.name),
          attributes: metadata.properties.flatMap((property) =>
            typeof property.attribute === 'string' ? [property.attribute] : [],
          ),
          events: metadata.events.map((event) => event.name),
          slots: metadata.slots.map((slot) => slot.name),
          cssParts: metadata.cssParts.map((part) => part.name),
          cssProperties: metadata.cssProperties.map((property) => property.name),
        },
        implementation,
      ),
    ).toEqual([]);

    expect(contractDifferences({ ...implementation, properties: [] }, implementation)).toEqual([
      'properties missing from metadata: variant, disabled',
    ]);
  });
});
