import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  { ignores: ['typecheck/**'] },
  {
    files: ['**/package.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['typescript', '@types/react', '@types/react-dom'],
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
];
