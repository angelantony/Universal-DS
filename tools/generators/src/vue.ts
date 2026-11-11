import type { ComponentMetadata } from '@uds/metadata';
import {
  className,
  generatedBanner,
  isFormValue,
  propertyDefault,
  propertyTsType,
} from './names.js';

function propLine(metadata: ComponentMetadata): string {
  return metadata.properties
    .map((property) => {
      const type = propertyTsType(property);
      const vueType =
        property.type.kind === 'boolean'
          ? 'Boolean'
          : property.type.kind === 'number'
            ? 'Number'
            : 'String';
      return `    ${property.name}: { default: ${propertyDefault(property)}, type: ${vueType} as PropType<${type}> },`;
    })
    .join('\n');
}

function bindings(metadata: ComponentMetadata): string {
  return metadata.properties
    .map((property) => `          ${property.name}: props.${property.name},`)
    .join('\n');
}

function children(metadata: ComponentMetadata): string {
  const named = metadata.slots.filter((slot) => slot.name !== '');
  if (named.length === 0) return "slots['default']?.()";
  const namedNodes = named
    .map((slot) => `h('span', { slot: '${slot.name}' }, slots['${slot.name}']?.())`)
    .join(', ');
  return `[slots['default']?.(), ${namedNodes}]`;
}

export function vueComponentSource(metadata: ComponentMetadata): string {
  const name = className(metadata.id);
  const form = isFormValue(metadata);
  const modelProp = form ? '\n    modelValue: { default: undefined },' : '';
  const modelBinding = form ? '\n          value: props.modelValue,' : '';
  const vnodeHook = form
    ? `
          onVnodeMounted: (vnode: VNode) => {
            const element = vnode.el;
            if (!(element instanceof HTMLElement)) return;
            element.addEventListener('${metadata.events[0]?.name ?? 'uds-change'}', () => {
              emit('update:modelValue', Reflect.get(element, 'value'));
            });
          },`
    : '';
  const vnodeImport = form ? "\nimport type { VNode } from 'vue';" : '';
  const setupContext = form ? '{ attrs, emit, slots }' : '{ attrs, slots }';
  return `${generatedBanner}
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';${vnodeImport}
import '@uds/components/${metadata.id}';

export const ${name} = defineComponent({
  name: '${name}',
  inheritAttrs: false,
  props: {
${propLine(metadata)}${modelProp}
  },
  setup(props, ${setupContext}) {
    return () =>
      h(
        '${metadata.tagName}',
        {
          ...attrs,${modelBinding}
${bindings(metadata)}${vnodeHook}
        },
        ${children(metadata)},
      );
  },
});
`;
}

export function vueGeneratedIndex(components: readonly ComponentMetadata[]): string {
  const lines = components.map((metadata) => {
    const name = className(metadata.id);
    return `export { ${name} } from './${metadata.id}.js';`;
  });
  return `${generatedBanner}\n${lines.join('\n')}\n`;
}

export function vueTypesSource(components: readonly ComponentMetadata[]): string {
  const imports = components
    .map((metadata) => {
      const name = className(metadata.id);
      return `import { ${name} } from './${metadata.id}.js';`;
    })
    .join('\n');
  const lines = components
    .map((metadata) => {
      const name = className(metadata.id);
      return `    ${name}: typeof ${name};`;
    })
    .join('\n');
  return `${generatedBanner}
/* eslint-disable @typescript-eslint/consistent-type-imports -- typeof needs the class value */
${imports}
/* eslint-enable @typescript-eslint/consistent-type-imports */

declare module 'vue' {
  interface GlobalComponents {
${lines}
  }
}
`;
}

export function vuePackageIndex(components: readonly ComponentMetadata[]): string {
  const names = components.map((metadata) => className(metadata.id)).join(', ');
  return `${generatedBanner}
import './generated/components.js';

export { isUdsElement, udsVuePlugin, udsVueTemplateOptions } from './plugin.js';
export { ${names} } from './generated/index.js';
`;
}
