import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';
import {
  RESOLVED_JSON_FORMAT,
  TOKEN_FORMAT,
  registerResolvedJsonFormat,
  registerTokenFormats,
} from '../../../tools/build/token-css.mjs';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokensRoot = resolve(packageRoot, '../tokens');
const primitives = `${tokensRoot}/src/tokens/primitive.*.json`;

/** @type {{ id: string, source: string[], selector: string, layer: string }[]} */
const themes = [
  {
    id: 'light',
    source: [`${tokensRoot}/src/tokens/semantic.json`],
    selector: ':root, [data-uds-theme="light"]',
    layer: 'uds.theme',
  },
  {
    id: 'dark',
    source: [`${packageRoot}/src/themes/dark.json`],
    selector: '[data-uds-theme="dark"]',
    layer: 'uds.theme',
  },
  {
    id: 'high-contrast',
    source: [`${packageRoot}/src/themes/high-contrast.json`],
    selector: '[data-uds-theme="high-contrast"]',
    layer: 'uds.theme',
  },
  {
    id: 'brand-a',
    source: [`${packageRoot}/src/themes/brand-a.json`],
    selector: '[data-uds-brand="brand-a"]',
    layer: 'uds.brand',
  },
];

export async function buildThemes() {
  await mkdir(resolve(packageRoot, 'dist'), { recursive: true });
  /** @type {Record<string, { css: string, resolved: Record<string, string | number> }>} */
  const built = {};
  for (const theme of themes) {
    const sd = new StyleDictionary({
      usesDtcg: true,
      log: { verbosity: 'silent', errors: { brokenReferences: 'throw' } },
      include: [primitives],
      source: theme.source,
      platforms: {
        css: {
          transformGroup: 'css',
          prefix: 'uds',
          buildPath: `${packageRoot}/dist/`,
          files: [
            {
              destination: `${theme.id}.css`,
              format: TOKEN_FORMAT,
              options: {
                layer: theme.layer,
                selector: theme.selector,
                outputReferences: true,
              },
            },
          ],
        },
        resolved: {
          transformGroup: 'css',
          prefix: 'uds',
          buildPath: `${packageRoot}/dist/`,
          files: [{ destination: `${theme.id}.resolved.json`, format: RESOLVED_JSON_FORMAT }],
        },
      },
    });
    registerTokenFormats(sd);
    registerResolvedJsonFormat(sd);
    await sd.buildAllPlatforms();
    built[theme.id] = {
      css: await readFile(resolve(packageRoot, `dist/${theme.id}.css`), 'utf8'),
      resolved: JSON.parse(
        await readFile(resolve(packageRoot, `dist/${theme.id}.resolved.json`), 'utf8'),
      ),
    };
  }
  const bundle = themes.map((theme) => `@import "./${theme.id}.css";`).join('\n') + '\n';
  await writeFile(resolve(packageRoot, 'dist/themes.css'), bundle);
  return built;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await buildThemes();
}
