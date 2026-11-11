import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentCatalog } from '@uds/components/metadata';
import { renderAdapters, writeGenerated } from './render.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const check = process.argv.includes('--check');
const files = await renderAdapters(componentCatalog, root);

if (check) {
  const stale = files.filter((file) => {
    const current = existsSync(file.path) ? readFileSync(file.path, 'utf8') : '';
    return current !== file.contents;
  });
  if (stale.length > 0) {
    for (const file of stale) console.error(`out of date: ${file.path}`);
    process.exit(1);
  }
} else {
  writeGenerated(files);
  console.log(`wrote ${String(files.length)} adapter files`);
}
