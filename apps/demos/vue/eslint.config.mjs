import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  { ignores: ['typecheck/**', 'src/**/*.vue'] },
  {
    files: ['**/package.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['typescript', 'vue-tsc'],
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/vitest.config.{js,ts,mjs,mts}',
            '{projectRoot}/playwright.config.{js,ts,mjs,mts}',
            '{projectRoot}/**/*.test.ts',
            '{projectRoot}/scripts/**',
            '{projectRoot}/e2e/**/*',
            '{projectRoot}/src/**/*.vue',
          ],
        },
      ],
    },
  },
];
