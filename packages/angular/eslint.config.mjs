import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/package.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['ng-packagr', '@angular/compiler-cli', 'rxjs', 'tslib'],
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
