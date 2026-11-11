import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

const config: stylelint.Config = {
  plugins: ['./plugin.mjs'],
  customSyntax: 'postcss-lit',
  rules: {
    'color-no-hex': true,
    'uds/no-primitive-token': ['--uds-color-blue-700', '--uds-space-4'],
  },
};

async function lint(code: string) {
  return stylelint.lint({ code, config });
}

describe('component style rules', () => {
  it('rejects primitive tokens and raw colors', async () => {
    const result = await lint(
      'css` :host { color: var(--uds-color-blue-700); background: #fff; } `',
    );
    expect(result.results[0]?.warnings.map((warning) => warning.rule).sort()).toEqual([
      'color-no-hex',
      'uds/no-primitive-token',
    ]);
  });

  it('allows semantic and component tokens', async () => {
    const result = await lint(
      'css` :host { color: var(--uds-color-text-default); padding: var(--uds-space-component-padding); } `',
    );
    expect(result.results[0]?.warnings).toEqual([]);
  });
});
