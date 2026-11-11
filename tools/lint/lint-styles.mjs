import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import stylelint from 'stylelint';
import config from '../../stylelint.config.mjs';

const roots = ['packages/core/src', 'packages/icons/src', 'packages/components/src'];

function filesIn(directory) {
  const found = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) found.push(...filesIn(path));
    else if (path.endsWith('.ts') && !path.endsWith('.test.ts') && !path.includes('/generated/')) {
      found.push(path);
    }
  }
  return found;
}

function cssBlocks(source) {
  return [...source.matchAll(/css`([\s\S]*?)`/g)].map((match) => match[1] ?? '');
}

const cssConfig = { ...config, customSyntax: undefined };
const failures = [];

for (const file of roots.flatMap((root) => filesIn(root))) {
  const css = cssBlocks(readFileSync(file, 'utf8')).join('\n');
  if (css.trim() === '') continue;
  const result = await stylelint.lint({
    code: css,
    codeFilename: `${file}.css`,
    config: cssConfig,
  });
  for (const warning of result.results.flatMap((item) => item.warnings)) {
    failures.push(`${file}:${String(warning.line)} ${warning.text}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Stylelint passed.');
}
