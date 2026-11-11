import type { StoryContext } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '@uds/icons/define';
import { appLocale, copy, type AppLocale } from './copy.js';

const builtInIcons = [
  ['check', 'confirm'],
  ['close', 'close'],
  ['info', 'information'],
  ['warning', 'warning'],
  ['error', 'error'],
  ['chevron-right', 'next'],
] as const;

function labelsOf(context: StoryContext): (typeof copy)[AppLocale]['icons'] {
  return copy[appLocale(context.globals['locale'])].icons;
}

const itemStyle =
  'display:flex; flex-direction:column; align-items:center; gap: var(--uds-space-2); color: var(--uds-color-text-default); font-family: var(--uds-font-family-body); font-size: var(--uds-font-size-label); font-weight: var(--uds-font-weight-label);';

export default { title: 'Icone/Icona' };

export const builtIn = {
  name: 'Integrate',
  render: (_args: Record<string, never>, context: StoryContext): TemplateResult => {
    const labels = labelsOf(context);
    return html`
      <div style="display:flex; gap: var(--uds-space-layout-gap); align-items:flex-end;">
        ${builtInIcons.map(
          ([name, key]) => html`
            <div style=${itemStyle}>
              <uds-icon name=${name} label=${labels[key]}></uds-icon>
              <span>${labels[key]}</span>
            </div>
          `,
        )}
      </div>
    `;
  },
};

export const decorative = {
  name: 'Decorativa',
  render: (_args: Record<string, never>, context: StoryContext): TemplateResult => {
    const labels = labelsOf(context);
    return html`
      <div style=${itemStyle}>
        <uds-icon name="check"></uds-icon>
        <span>${labels.decorative}</span>
      </div>
    `;
  },
};
