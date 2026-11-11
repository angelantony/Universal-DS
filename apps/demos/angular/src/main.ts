import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import '@uds/themes/css';
import '@uds/tokens/css';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((error: unknown) => {
  console.error(error);
});
