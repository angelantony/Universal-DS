import type { ReactiveController, ReactiveElement } from 'lit';

/**
 * Shared form association for elements that must submit or reset a light-DOM form.
 * The host must set `static formAssociated = true` before this controller is constructed.
 */
export class FormAssociationController implements ReactiveController {
  readonly internals: ElementInternals;
  formDisabled = false;

  constructor(private readonly host: ReactiveElement & HTMLElement) {
    this.internals = host.attachInternals();
    host.addController(this);
  }

  hostConnected(): void {
    this.formDisabled = this.internals.form?.hasAttribute('disabled') ?? false;
  }

  /** Called from the host's `formDisabledCallback`. */
  setFormDisabled(disabled: boolean): void {
    this.formDisabled = disabled;
    this.host.requestUpdate();
  }

  submit(): void {
    this.internals.form?.requestSubmit();
  }

  reset(): void {
    this.internals.form?.reset();
  }
}
