import type { App, Plugin } from 'vue';

const installed = Symbol('uds-vue');

/** True when the tag belongs to Universal DS. */
export function isUdsElement(tag: string): boolean {
  return tag.startsWith('uds-');
}

/** Options for `@vitejs/plugin-vue` so `uds-*` tags stay custom elements. */
export function udsVueTemplateOptions(): {
  compilerOptions: { isCustomElement: (tag: string) => boolean };
} {
  return { compilerOptions: { isCustomElement: isUdsElement } };
}

/** Registers the design system with a Vue application. Importing the package defines the elements. */
export const udsVuePlugin: Plugin = {
  install(app: App): void {
    app.provide(installed, true);
  },
};
