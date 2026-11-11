import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ComponentMetadata } from '@uds/metadata';
import prettier from 'prettier';
import { angularComponentSource, angularGeneratedIndex, angularPackageIndex } from './angular.js';
import {
  reactComponentSource,
  reactGeneratedIndex,
  reactJsxSource,
  reactPackageIndex,
} from './react.js';
import { vueComponentSource, vueGeneratedIndex, vuePackageIndex, vueTypesSource } from './vue.js';

export interface GeneratedFile {
  path: string;
  contents: string;
}

function sources(components: readonly ComponentMetadata[]): Map<string, string> {
  const files = new Map<string, string>();
  files.set('packages/react/src/generated/jsx.ts', reactJsxSource(components));
  files.set('packages/react/src/generated/index.ts', reactGeneratedIndex(components));
  files.set('packages/react/src/index.ts', reactPackageIndex(components));
  files.set('packages/angular/src/generated/index.ts', angularGeneratedIndex(components));
  files.set('packages/angular/src/index.ts', angularPackageIndex(components));
  files.set('packages/vue/src/generated/components.ts', vueTypesSource(components));
  files.set('packages/vue/src/generated/index.ts', vueGeneratedIndex(components));
  files.set('packages/vue/src/index.ts', vuePackageIndex(components));
  for (const metadata of components) {
    files.set(`packages/react/src/generated/${metadata.id}.ts`, reactComponentSource(metadata));
    files.set(`packages/angular/src/generated/${metadata.id}.ts`, angularComponentSource(metadata));
    files.set(`packages/vue/src/generated/${metadata.id}.ts`, vueComponentSource(metadata));
  }
  return files;
}

export async function renderAdapters(
  components: readonly ComponentMetadata[],
  root: string,
): Promise<GeneratedFile[]> {
  const rendered: GeneratedFile[] = [];
  for (const [relative, source] of sources(components)) {
    const path = join(root, relative);
    const config = await prettier.resolveConfig(path);
    const contents = await prettier.format(source, { ...config, filepath: path });
    rendered.push({ path, contents });
  }
  return rendered;
}

export function writeGenerated(files: readonly GeneratedFile[]): void {
  for (const file of files) {
    mkdirSync(dirname(file.path), { recursive: true });
    writeFileSync(file.path, file.contents);
  }
}
