import nx from '@nx/eslint-plugin';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import * as jsoncParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

const frameworkImports = [
  'react',
  'react-dom',
  'react/*',
  'react-dom/*',
  '@angular/*',
  'vue',
  '@vue/*',
];

/** Allowed dependencies between projects. Mirrors docs/architecture/dependency-graph.md §3. */
const depConstraints = [
  { sourceTag: 'type:foundation', onlyDependOnLibsWithTags: ['type:foundation'] },
  { sourceTag: 'type:runtime', onlyDependOnLibsWithTags: ['type:runtime', 'type:foundation'] },
  { sourceTag: 'type:adapter', onlyDependOnLibsWithTags: ['type:runtime', 'type:foundation'] },
  { sourceTag: 'type:tooling', onlyDependOnLibsWithTags: ['type:tooling', 'type:foundation'] },
  {
    sourceTag: 'type:generator',
    onlyDependOnLibsWithTags: ['type:tooling', 'type:foundation', 'type:runtime'],
  },
  {
    sourceTag: 'type:app',
    onlyDependOnLibsWithTags: ['type:foundation', 'type:runtime', 'type:adapter', 'type:tooling'],
  },
  { sourceTag: 'type:test-util', onlyDependOnLibsWithTags: ['type:foundation', 'type:runtime'] },
  {
    sourceTag: 'framework:none',
    onlyDependOnLibsWithTags: ['framework:none'],
    bannedExternalImports: frameworkImports,
  },
  {
    sourceTag: 'framework:react',
    onlyDependOnLibsWithTags: ['framework:react', 'framework:none'],
  },
  {
    sourceTag: 'framework:angular',
    onlyDependOnLibsWithTags: ['framework:angular', 'framework:none'],
  },
  { sourceTag: 'framework:vue', onlyDependOnLibsWithTags: ['framework:vue', 'framework:none'] },
];

const testFiles = ['**/*.test.ts', '**/*.e2e.ts', '**/e2e/**/*.ts'];

/**
 * For projects tagged `framework:none`. Needed in addition to Nx `bannedExternalImports`,
 * which only detects packages already installed in the workspace.
 */
export const frameworkAgnostic = defineConfig({
  files: ['**/*.ts', '**/*.js'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: frameworkImports,
            message: 'Framework-agnostic packages must not import React, Angular or Vue.',
          },
        ],
      },
    ],
  },
});

export default defineConfig(
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/coverage',
      '**/test-results',
      '**/playwright-report',
      '**/.nx',
      '**/*.timestamp*',
    ],
  },
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        { enforceBuildableLibDependency: true, allow: [], depConstraints },
      ],
    },
  },
  {
    files: testFiles,
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: depConstraints.map((constraint) =>
            constraint.sourceTag === 'framework:none'
              ? constraint
              : {
                  ...constraint,
                  onlyDependOnLibsWithTags: [
                    ...constraint.onlyDependOnLibsWithTags,
                    'type:test-util',
                  ],
                },
          ),
        },
      ],
    },
  },
  {
    files: ['**/package.json'],
    languageOptions: { parser: jsoncParser },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/vitest.config.{js,ts,mjs,mts}',
            '{projectRoot}/playwright.config.{js,ts,mjs,mts}',
            '{projectRoot}/**/*.test.ts',
            '{projectRoot}/scripts/**',
            '{projectRoot}/e2e/**/*',
          ],
        },
      ],
    },
  },
  prettier,
);
