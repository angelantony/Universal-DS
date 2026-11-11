import { css } from 'lit';

/**
 * Public custom properties are the styling API (ADR-0011).
 * Variant and tone rules assign them from semantic tokens. A style attribute on the host wins.
 */
export const buttonStyles = css`
  :host {
    display: inline-flex;
    max-width: 100%;
    vertical-align: middle;
    color: var(--uds-button-color);
    --uds-button-border-color: transparent;
    --uds-button-background-hover: color-mix(
      in srgb,
      var(--uds-button-background) 88%,
      var(--uds-color-text-default)
    );
    --uds-button-background-active: color-mix(
      in srgb,
      var(--uds-button-background) 76%,
      var(--uds-color-text-default)
    );
    --uds-button-min-block-size: var(--uds-button-size-md-min-block);
    --uds-button-min-inline-size: var(--uds-button-size-xs-min-block);
    --uds-button-icon-size: var(--uds-button-size-md-icon);
  }

  :host([size='xs']) {
    --uds-button-min-block-size: var(--uds-button-size-xs-min-block);
    --uds-button-padding-inline: var(--uds-button-size-xs-padding-inline);
    --uds-button-padding-block: var(--uds-button-size-xs-padding-block);
    --uds-button-font-size: var(--uds-button-size-xs-font-size);
    --uds-button-icon-size: var(--uds-button-size-xs-icon);
  }

  :host([size='sm']) {
    --uds-button-min-block-size: var(--uds-button-size-sm-min-block);
    --uds-button-padding-inline: var(--uds-button-size-sm-padding-inline);
    --uds-button-padding-block: var(--uds-button-size-sm-padding-block);
    --uds-button-font-size: var(--uds-button-size-sm-font-size);
    --uds-button-icon-size: var(--uds-button-size-sm-icon);
  }

  :host([size='lg']) {
    --uds-button-min-block-size: var(--uds-button-size-lg-min-block);
    --uds-button-padding-inline: var(--uds-button-size-lg-padding-inline);
    --uds-button-padding-block: var(--uds-button-size-lg-padding-block);
    --uds-button-font-size: var(--uds-button-size-lg-font-size);
    --uds-button-icon-size: var(--uds-button-size-lg-icon);
  }

  :host([size='xl']) {
    --uds-button-min-block-size: var(--uds-button-size-xl-min-block);
    --uds-button-padding-inline: var(--uds-button-size-xl-padding-inline);
    --uds-button-padding-block: var(--uds-button-size-xl-padding-block);
    --uds-button-font-size: var(--uds-button-size-xl-font-size);
    --uds-button-icon-size: var(--uds-button-size-xl-icon);
  }

  :host([variant='secondary']:not([disabled])) {
    --uds-button-background: var(--uds-color-action-secondary-background);
    --uds-button-color: var(--uds-color-action-secondary-text);
    --uds-button-border-color: var(--uds-color-action-secondary-border);
  }

  :host([variant='tertiary']:not([disabled])) {
    --uds-button-background: var(--uds-color-background-surface);
    --uds-button-color: var(--uds-color-text-default);
    --uds-button-border-color: var(--uds-color-border-strong);
  }

  :host([variant='outline']:not([disabled])),
  :host([variant='ghost']:not([disabled])),
  :host([variant='text']:not([disabled])) {
    --uds-button-background: transparent;
    --uds-button-color: var(--uds-color-text-default);
    --uds-button-border-color: transparent;
    --uds-button-background-hover: color-mix(in srgb, var(--uds-button-color) 12%, transparent);
    --uds-button-background-active: color-mix(in srgb, var(--uds-button-color) 20%, transparent);
  }

  :host([variant='outline']:not([disabled])) {
    --uds-button-border-color: var(--uds-button-color);
  }

  :host(
    [tone='danger']:not([disabled]):not([variant='outline']):not([variant='ghost']):not(
        [variant='text']
      ):not([variant='custom'])
  ) {
    --uds-button-background: var(--uds-color-danger-background);
    --uds-button-color: var(--uds-color-danger-text);
    --uds-button-border-color: transparent;
  }

  :host(
    [tone='success']:not([disabled]):not([variant='outline']):not([variant='ghost']):not(
        [variant='text']
      ):not([variant='custom'])
  ) {
    --uds-button-background: var(--uds-color-success-background);
    --uds-button-color: var(--uds-color-success-text);
    --uds-button-border-color: transparent;
  }

  :host(
    [tone='warning']:not([disabled]):not([variant='outline']):not([variant='ghost']):not(
        [variant='text']
      ):not([variant='custom'])
  ) {
    --uds-button-background: var(--uds-color-warning-background);
    --uds-button-color: var(--uds-color-warning-text);
    --uds-button-border-color: transparent;
  }

  :host([variant='outline'][tone='danger']:not([disabled])),
  :host([variant='ghost'][tone='danger']:not([disabled])),
  :host([variant='text'][tone='danger']:not([disabled])) {
    --uds-button-color: var(--uds-color-danger-on-canvas);
    --uds-button-background: transparent;
  }

  :host([variant='outline'][tone='success']:not([disabled])),
  :host([variant='ghost'][tone='success']:not([disabled])),
  :host([variant='text'][tone='success']:not([disabled])) {
    --uds-button-color: var(--uds-color-success-on-canvas);
    --uds-button-background: transparent;
  }

  :host([variant='outline'][tone='warning']:not([disabled])),
  :host([variant='ghost'][tone='warning']:not([disabled])),
  :host([variant='text'][tone='warning']:not([disabled])) {
    --uds-button-color: var(--uds-color-warning-on-canvas);
    --uds-button-background: transparent;
  }

  :host([variant='outline'][tone='danger']:not([disabled])),
  :host([variant='outline'][tone='success']:not([disabled])),
  :host([variant='outline'][tone='warning']:not([disabled])) {
    --uds-button-border-color: var(--uds-button-color);
  }

  :host([disabled]) {
    --uds-button-background: var(--uds-color-background-surface);
    --uds-button-color: var(--uds-color-text-muted);
    --uds-button-border-color: var(--uds-color-border-default);
    --uds-button-background-hover: var(--uds-button-background);
    --uds-button-background-active: var(--uds-button-background);
  }

  :host([full-width]) {
    display: flex;
    width: 100%;
  }

  button {
    appearance: none;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    margin: 0;
    gap: var(--uds-button-gap);
    min-block-size: max(var(--uds-button-size-xs-min-block), var(--uds-button-min-block-size));
    min-inline-size: max(var(--uds-button-size-xs-min-block), var(--uds-button-min-inline-size));
    padding-block: var(--uds-button-padding-block);
    padding-inline: var(--uds-button-padding-inline);
    border-color: var(--uds-button-border-color);
    border-style: solid;
    border-width: var(--uds-button-border-width);
    border-radius: var(--uds-button-radius);
    background: var(--uds-button-background);
    box-shadow: var(--uds-button-shadow);
    color: var(--uds-button-color);
    font-family: var(--uds-font-family-body);
    font-size: var(--uds-button-font-size);
    font-weight: var(--uds-button-font-weight);
    line-height: var(--uds-font-line-height-body);
    text-align: center;
    cursor: pointer;
    transition: background-color var(--uds-button-transition-duration);
  }

  :host([disabled]) button {
    cursor: not-allowed;
  }

  :host([loading]) button {
    cursor: progress;
  }

  button:hover {
    background: var(--uds-button-background-hover);
  }

  button:active {
    background: var(--uds-button-background-active);
  }

  :host([variant='text']) button:hover .content {
    text-decoration: underline;
  }

  button:focus {
    outline: none;
  }

  .content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--uds-button-gap);
    min-width: 0;
  }

  .content uds-icon {
    --uds-icon-size: var(--uds-button-icon-size);
    flex: none;
  }

  :host([icon-only]) .words {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  :host([loading]) .content {
    opacity: 0;
  }

  .spinner {
    position: absolute;
    box-sizing: border-box;
    width: var(--uds-button-icon-size);
    height: var(--uds-button-icon-size);
    border-color: currentcolor;
    border-style: solid;
    border-width: var(--uds-border-width-strong);
    border-inline-start-color: transparent;
    border-radius: var(--uds-button-radius);
    animation: uds-button-spin var(--uds-button-spinner-duration) linear infinite;
  }

  .live {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  @media (forced-colors: active) {
    button {
      border-color: ButtonText;
      background: ButtonFace;
      color: ButtonText;
    }

    .spinner {
      border-color: ButtonText;
      border-inline-start-color: transparent;
    }
  }

  @keyframes uds-button-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
