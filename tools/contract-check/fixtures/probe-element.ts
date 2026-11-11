import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Fixture element. Not a public component.
 *
 * @fires uds-probe
 * @slot - Default content
 * @slot icon - Optional icon
 * @csspart base
 * @cssprop --uds-probe-color
 */
export class UdsProbe extends LitElement {
  static override styles = css`
    :host {
      color: var(--uds-probe-color);
    }
  `;

  @property({ type: String, reflect: true })
  accessor variant = 'alpha';

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  override render() {
    return html`<div part="base"><slot name="icon"></slot><slot></slot></div>`;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('uds-probe')) {
  customElements.define('uds-probe', UdsProbe);
}
