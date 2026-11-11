import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { describe, expect, it } from 'vitest';
// eslint-disable-next-line @nx/enforce-module-boundaries -- test-only checker, not a runtime dependency
import { contractDifferences, extractContract } from '@uds/contract-check';
import { buttonMetadata } from './button.meta.js';
import { parseButtonMetadata } from '../metadata.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

describe('button metadata', () => {
  it('parses and matches the class contract', async () => {
    expect(parseButtonMetadata().id).toBe('button');
    const source = await readFile(resolve(root, 'src/button/button.ts'), 'utf8');
    const implementation = extractContract(source);
    expect(
      contractDifferences(
        {
          properties: buttonMetadata.properties.map((property) => property.name),
          attributes: buttonMetadata.properties.flatMap((property) =>
            typeof property.attribute === 'string' ? [property.attribute] : [],
          ),
          events: (buttonMetadata.events as readonly { name: string }[]).map((event) => event.name),
          slots: buttonMetadata.slots.map((slot) => slot.name),
          cssParts: buttonMetadata.cssParts.map((part) => part.name),
          cssProperties: buttonMetadata.cssProperties.map((property) => property.name),
        },
        implementation,
      ),
    ).toEqual([]);
  });

  it('imports in Node without touching the document', async () => {
    const imported: unknown = await import('../../dist/button/index.js');
    expect(typeof imported).toBe('object');
  });

  it('stays inside the bundle budget, excluding Lit, core and icons', async () => {
    const built = await esbuild.build({
      absWorkingDir: root,
      entryPoints: ['dist/button/define.js'],
      bundle: true,
      write: false,
      format: 'esm',
      platform: 'browser',
      minify: true,
      packages: 'external',
    });
    const output = built.outputFiles[0];
    if (output === undefined) throw new Error('esbuild produced no output');
    const bytes = gzipSync(output.contents).byteLength;
    expect(bytes).toBeLessThanOrEqual(8 * 1024);
  });
});
