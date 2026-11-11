import { Component } from '@angular/core';
import { UdsButton } from '@uds/angular';

@Component({
  selector: 'invalid-demo',
  imports: [UdsButton],
  template: '<uds-button variant="nope">Save</uds-button>',
})
export class InvalidComponent {}
