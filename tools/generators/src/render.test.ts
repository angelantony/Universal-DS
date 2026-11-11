import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ComponentMetadata } from '@uds/metadata';
import { buttonMetadata, componentCatalog } from '@uds/components/metadata';
import { describe, expect, it } from 'vitest';
import { angularComponentSource } from './angular.js';
import { reactComponentSource } from './react.js';
import { renderAdapters } from './render.js';
import { vueComponentSource } from './vue.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const field = {
  schemaVersion: 1,
  id: 'field',
  tagName: 'uds-field',
  name: 'Field',
  description: 'Fixture for form-value adapter generation.',
  category: 'forms',
  status: 'experimental',
  since: '0.0.0',
  properties: [
    {
      name: 'value',
      attribute: false,
      description: 'Current value.',
      type: { kind: 'string' },
      default: '',
    },
  ],
  events: [{ name: 'uds-change', description: 'The value changed.', detail: null }],
  slots: [{ name: '', description: 'Default content.' }],
  cssParts: [],
  cssProperties: [],
  states: [],
  constraints: [],
  examples: [{ id: 'empty', title: 'Empty', config: { component: 'field', props: { value: '' } } }],
  accessibility: {
    role: 'textbox',
    keyboard: [],
    requirements: [],
    knownLimitations: [],
  },
  responsive: { behavior: 'Stretches.' },
} satisfies ComponentMetadata;

describe('adapter generator', () => {
  it('maps button metadata to binding-only adapters', () => {
    const react = reactComponentSource(buttonMetadata);
    const angular = angularComponentSource(buttonMetadata);
    const vue = vueComponentSource(buttonMetadata);
    expect(react).toContain("tagName: 'uds-button'");
    expect(react).toContain('createComponent');
    expect(react).not.toContain('onUds');
    expect(angular).toContain("selector: 'uds-button'");
    expect(angular).not.toContain('NG_VALUE_ACCESSOR');
    expect(angular).not.toContain('<button');
    expect(angular).not.toContain('css`');
    expect(vue).toContain("h(\n        'uds-button'");
    expect(vue).not.toContain('modelValue');
    expect(vue).not.toContain('<button');
  });

  it('emits React events, Angular value accessor and Vue v-model for form values', () => {
    expect(reactComponentSource(field)).toContain("onUdsChange: 'uds-change'");
    const angular = angularComponentSource(field);
    expect(angular).toContain('NG_VALUE_ACCESSOR');
    expect(angular).toContain('writeValue');
    expect(vueComponentSource(field)).toContain('modelValue');
    expect(vueComponentSource(field)).toContain('update:modelValue');
  });

  it('matches the committed adapters', async () => {
    const files = await renderAdapters(componentCatalog, root);
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(readFileSync(file.path, 'utf8')).toBe(file.contents);
    }
  });
});
