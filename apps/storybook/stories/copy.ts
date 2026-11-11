export const locales = ['it', 'en'] as const;

export type AppLocale = (typeof locales)[number];

export function appLocale(value: unknown): AppLocale {
  return value === 'en' ? 'en' : 'it';
}

export const copy = {
  it: {
    icons: {
      confirm: 'Conferma',
      close: 'Chiudi',
      information: 'Informazione',
      warning: 'Avviso',
      error: 'Errore',
      next: 'Avanti',
      decorative: 'Decorativa, senza nome accessibile',
    },
    button: {
      save: 'Salva',
      close: 'Chiudi',
      loading: 'Salvataggio in corso',
      disabled: 'Disabilitato',
    },
  },
  en: {
    icons: {
      confirm: 'Confirm',
      close: 'Close',
      information: 'Information',
      warning: 'Warning',
      error: 'Error',
      next: 'Next',
      decorative: 'Decorative, no accessible name',
    },
    button: {
      save: 'Save',
      close: 'Close',
      loading: 'Saving',
      disabled: 'Disabled',
    },
  },
} as const;
