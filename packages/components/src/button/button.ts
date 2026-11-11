import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { FormAssociationController, UdsElement } from '@uds/core';
import {
  type ButtonSize,
  type ButtonTone,
  type ButtonType,
  type ButtonVariant,
} from './button.meta.js';
import { buttonStyles } from './button.styles.js';

function isDevelopment(): boolean {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env?.['NODE_ENV'] !== 'production';
}

/**
 * Action control. The native button lives in the shadow root and submits the
 * light-DOM form through ElementInternals.
 *
 * @slot - Visible label. Ignored for the accessible name when ariaLabel is set.
 * @csspart button - Inner native button.
 * @csspart label - Label and icons.
 * @csspart spinner - Loading indicator.
 * @cssprop --uds-button-background - Fill of the control.
 * @cssprop --uds-button-background-hover - Fill while hovered.
 * @cssprop --uds-button-background-active - Fill while pressed.
 * @cssprop --uds-button-color - Text and icon color.
 * @cssprop --uds-button-border-color - Border color.
 * @cssprop --uds-button-border-width - Border width.
 * @cssprop --uds-button-radius - Corner radius.
 * @cssprop --uds-button-padding-inline - Horizontal padding.
 * @cssprop --uds-button-padding-block - Vertical padding.
 * @cssprop --uds-button-font-size - Label size.
 * @cssprop --uds-button-font-weight - Label weight.
 * @cssprop --uds-button-shadow - Box shadow.
 * @cssprop --uds-button-min-block-size - Minimum block size. Never below 24px.
 * @cssprop --uds-button-min-inline-size - Minimum inline size. Never below 24px.
 * @cssprop --uds-button-gap - Space between icon and label.
 * @cssprop --uds-button-icon-size - Icon box size.
 */
export class UdsButton extends UdsElement {
  static formAssociated = true;
  static override styles = [UdsElement.styles, buttonStyles];

  readonly form = new FormAssociationController(this);

  @property({ reflect: true })
  accessor variant: ButtonVariant = 'primary';

  @property({ reflect: true })
  accessor tone: ButtonTone = 'neutral';

  @property({ reflect: true })
  accessor size: ButtonSize = 'md';

  @property({ reflect: true })
  accessor type: ButtonType = 'button';

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true })
  accessor loading = false;

  @property({ type: Boolean, reflect: true, attribute: 'full-width' })
  accessor fullWidth = false;

  @property({ reflect: true, attribute: 'icon-start' })
  accessor iconStart = '';

  @property({ reflect: true, attribute: 'icon-end' })
  accessor iconEnd = '';

  @property({ type: Boolean, reflect: true, attribute: 'icon-only' })
  accessor iconOnly = false;

  @property({ attribute: 'aria-label' })
  override accessor ariaLabel: string | null = null;

  @property({ attribute: 'loading-label' })
  accessor loadingLabel: string | undefined;

  private warnedIconOnly = false;

  formDisabledCallback(disabled: boolean): void {
    this.form.setFormDisabled(disabled);
  }

  override updated(): void {
    const label = this.ariaLabel;
    const missing = this.iconOnly && (label === null || label.length === 0);
    if (missing && !this.warnedIconOnly && isDevelopment()) {
      this.warnedIconOnly = true;
      console.warn('[uds] <uds-button icon-only> needs ariaLabel.');
    }
  }

  private onActivate(event: Event): void {
    if (this.disabled || this.loading || this.form.formDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.type === 'submit') this.form.submit();
    else if (this.type === 'reset') this.form.reset();
  }

  override render() {
    const inactive = this.disabled || this.form.formDisabled;
    const label = this.ariaLabel;
    return html`
      <button
        part="button"
        type="button"
        ?disabled=${inactive}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${this.loading ? 'true' : 'false'}
        aria-label=${label === null || label.length === 0 ? nothing : label}
        @click=${(event: Event) => {
          this.onActivate(event);
        }}
      >
        <span part="label" class="content">
          ${this.iconStart === '' ? nothing : html`<uds-icon name=${this.iconStart}></uds-icon>`}
          <span class="words"><slot></slot></span>
          ${this.iconEnd === '' ? nothing : html`<uds-icon name=${this.iconEnd}></uds-icon>`}
        </span>
        ${this.loading ? html`<span part="spinner" class="spinner" aria-hidden="true"></span>` : nothing}
      </button>
      <span class="live" aria-live="polite">
        ${
          this.loading && this.loadingLabel !== undefined && this.loadingLabel.length > 0
            ? this.loadingLabel
            : nothing
        }
      </span>
    `;
  }
}
