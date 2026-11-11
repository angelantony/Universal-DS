# ADR-0008 — Strategia di testing

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Decisione

Dettaglio in `docs/architecture/testing-strategy.md`. Punti vincolanti:

1. Test dei componenti in browser reali (Vitest browser mode con provider Playwright), non jsdom.
2. Testing Library con query capaci di attraversare lo Shadow DOM.
3. axe-core su ogni combinazione variante × stato × tema dichiarata nei metadata.
4. Regressione visiva con Playwright sulle storie Storybook, baseline generate solo nell'immagine Docker ufficiale di Playwright.
5. Integrazione framework sulle demo installate da tarball.
6. Validazione dei package con `publint`, `@arethetypeswrong/cli`, `size-limit`.
7. Checklist manuale di accessibilità obbligatoria per lo stato `stable`.

## Alternative scartate

- jsdom/happy-dom: supporto incompleto a Shadow DOM, `ElementInternals`, focus.
- Servizi SaaS di visual testing (Chromatic, Percy): introducono un servizio esterno e costi; rivalutabili su richiesta.
