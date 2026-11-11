import type { StoryContext } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '@uds/components/button';
import { appLocale, copy, type AppLocale } from './copy.js';

const variants = ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'text'] as const;
const tones = ['neutral', 'danger', 'success', 'warning'] as const;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

function labelsOf(context: StoryContext): (typeof copy)[AppLocale]['button'] {
  return copy[appLocale(context.globals['locale'])].button;
}

const row =
  'display:flex; flex-wrap:wrap; gap: var(--uds-space-component-gap); align-items:center; margin-block-end: var(--uds-space-layout-gap);';

export default { title: 'Azioni/Button' };

export const matrix = {
  name: 'Varianti',
  render: (_args: Record<string, never>, context: StoryContext): TemplateResult => {
    const labels = labelsOf(context);
    return html`
      ${tones.map(
        (tone) => html`
          <div style=${row}>
            ${variants.map(
              (variant) => html`
                <uds-button variant=${variant} tone=${tone}>${labels.save}</uds-button>
              `,
            )}
          </div>
        `,
      )}
    `;
  },
};

export const sizesStory = {
  name: 'Dimensioni',
  render: (_args: Record<string, never>, context: StoryContext): TemplateResult => {
    const labels = labelsOf(context);
    return html`
      <div style=${row}>
        ${sizes.map((size) => html`<uds-button size=${size}>${labels.save}</uds-button>`)}
      </div>
    `;
  },
};

export const states = {
  name: 'Stati',
  render: (_args: Record<string, never>, context: StoryContext): TemplateResult => {
    const labels = labelsOf(context);
    return html`
      <div style=${row}>
        <uds-button>${labels.save}</uds-button>
        <uds-button disabled>${labels.disabled}</uds-button>
        <uds-button loading loading-label=${labels.loading}>${labels.save}</uds-button>
        <uds-button icon-only icon-start="close" .ariaLabel=${labels.close}></uds-button>
        <uds-button icon-start="check">${labels.save}</uds-button>
      </div>
    `;
  },
};
