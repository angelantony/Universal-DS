import { css, type CSSResult } from 'lit';

/**
 * Shared styles for every component: text color, focus ring and forced-colors fallback.
 * Component styles must include this result. `prefers-reduced-motion` is handled by the
 * duration tokens, which the token stylesheet sets to `0s`.
 */
export const baseStyles: CSSResult = css`
  :host {
    color: var(--uds-color-text-default);
  }

  :host(:focus-visible) {
    outline-color: var(--uds-color-focus-ring);
    outline-offset: var(--uds-focus-offset);
    outline-style: solid;
    outline-width: var(--uds-border-width-strong);
  }

  @media (forced-colors: active) {
    :host(:focus-visible) {
      /* System color required by forced-colors; not a design token. */
      outline-color: CanvasText;
    }
  }
`;
