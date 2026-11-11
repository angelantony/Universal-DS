import { readdirSync, readFileSync } from 'node:fs';
import { collectTokens, cssName } from './tools/build/dtcg.mjs';

const primitiveNames = readdirSync('packages/tokens/src/tokens')
  .filter((file) => file.startsWith('primitive.'))
  .flatMap((file) =>
    collectTokens(JSON.parse(readFileSync(`packages/tokens/src/tokens/${file}`, 'utf8'))).map(
      (token) => cssName(token.path),
    ),
  );

/** @type {import('stylelint').Config} */
export default {
  files: [
    'packages/core/src/**/*.ts',
    'packages/icons/src/**/*.ts',
    'packages/components/src/**/*.ts',
  ],
  ignoreFiles: ['**/*.test.ts', '**/generated/**'],
  customSyntax: 'postcss-lit',
  plugins: ['./tools/lint/plugin.mjs'],
  rules: {
    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
    'uds/no-primitive-token': primitiveNames,
  },
};
