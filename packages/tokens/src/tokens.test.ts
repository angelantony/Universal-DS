import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { assertValidDtcg, collectTokens } from './dtcg.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

interface TokenBuild {
  version: string;
  css: string;
  resolved: Record<string, string>;
}

function parseJson(text: string): unknown {
  return JSON.parse(text) as unknown;
}

function callExport(module: unknown, name: string): unknown {
  if (typeof module !== 'object' || module === null || !(name in module)) {
    throw new Error(`Missing ${name}`);
  }
  const exported = (module as Record<string, unknown>)[name];
  if (typeof exported !== 'function') throw new Error(`Missing ${name}`);
  const fn = exported as () => unknown;
  return fn();
}

function isTokenBuild(value: unknown): value is TokenBuild {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    typeof value.version === 'string' &&
    'css' in value &&
    typeof value.css === 'string' &&
    'resolved' in value &&
    typeof value.resolved === 'object' &&
    value.resolved !== null
  );
}

async function loadTokenBuild(): Promise<TokenBuild> {
  const imported: unknown = await import('../scripts/build.mjs');
  const built: unknown = await Promise.resolve(callExport(imported, 'buildTokens'));
  if (!isTokenBuild(built)) throw new Error('Unexpected token build output');
  return built;
}

describe('design tokens', () => {
  it('validates DTCG sources and resolves every alias', async () => {
    const files = [
      'primitive.color.json',
      'primitive.typography.json',
      'primitive.spacing.json',
      'primitive.shape.json',
      'primitive.layout.json',
      'primitive.motion.json',
      'semantic.json',
    ];
    const trees = await Promise.all(
      files.map(async (file) =>
        parseJson(await readFile(resolve(root, 'src/tokens', file), 'utf8')),
      ),
    );
    const known = new Set(
      trees.flatMap((tree) => collectTokens(tree).map((token) => token.path.join('.'))),
    );
    for (const [index, tree] of trees.entries()) {
      expect(() => assertValidDtcg(tree, files[index] ?? 'token', known)).not.toThrow();
    }
  });

  it('builds layered CSS, resolved JSON and token names', async () => {
    const built = await loadTokenBuild();
    expect(built.css).toContain('@layer uds.tokens, uds.theme, uds.brand;');
    expect(built.css).toContain(`--uds-tokens-version: ${built.version};`);
    expect(built.css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(built.css).toContain('--uds-motion-duration-normal: 0s;');
    expect(built.css).toContain('--uds-color-text-default: var(--uds-color-neutral-900);');
    expect(built.css).toContain(
      '--uds-button-background: var(--uds-color-action-primary-background);',
    );
    expect(built.resolved['--uds-color-text-default']).toBe('#0f172a');
    expect(built.css).toMatchSnapshot();
  });
});
