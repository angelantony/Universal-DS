import { LitElement, type CSSResultGroup } from 'lit';
import { baseStyles } from './styles.js';

/** Base class for Universal DS elements. Shadow DOM is open and delegates focus. */
export class UdsElement extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  static override styles: CSSResultGroup = baseStyles;
}
