import { Component, signal } from '@angular/core';
import { UdsButton } from '@uds/angular';

@Component({
  selector: 'demo-root',
  imports: [UdsButton],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly count = signal(0);
  readonly submitted = signal('no');
  readonly disabledCount = signal(0);

  onSave(): void {
    this.count.update((value) => value + 1);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set('yes');
  }

  onDisabled(): void {
    this.disabledCount.update((value) => value + 1);
  }
}
