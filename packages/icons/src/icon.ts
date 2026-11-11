import { html, css, nothing, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { UdsElement, baseStyles } from '@uds/core';
import { iconRegistry } from './registry.js';

/**
 * Decorative by default. Set `label` to expose an accessible name (`role="img"`).
 *
 * @csspart graphic
 * @cssprop --uds-icon-size - Width and height. Defaults to the icon.size token.
 */
export class UdsIcon extends UdsElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        display: inline-flex;
        width: var(--uds-icon-size);
        height: var(--uds-icon-size);
        color: inherit;
        vertical-align: middle;
      }

      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ];

  @property({ reflect: true })
  accessor name = '';

  /** Accessible name. When omitted the icon is hidden from assistive technology. */
  @property()
  accessor label: string | undefined;

  @state()
  private accessor markup = '';

  override updated(changed: PropertyValues<this>): void {
    if (changed.has('name')) void this.load();
  }

  private async load(): Promise<void> {
    const requested = this.name;
    const markup = requested === '' ? '' : await iconRegistry.resolve(requested);
    if (requested === this.name) this.markup = markup ?? '';
  }

  override render() {
    const label = this.label;
    const informative = label !== undefined && label.length > 0;
    return html`<span
      part="graphic"
      role=${informative ? 'img' : 'presentation'}
      aria-label=${informative ? label : nothing}
      aria-hidden=${informative ? nothing : 'true'}
    >
      ${unsafeSVG(this.markup)}
    </span>`;
  }
}
