# ADR-0003 — Lit, Shadow DOM e form association

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Contesto

I componenti sono implementati una sola volta (Lit 3, Web Components) e devono integrarsi con i form e con le tecnologie assistive.

## Decisioni

1. **Shadow DOM** aperto per tutti i componenti (`mode: 'open'`), con `delegatesFocus: true` per i componenti interattivi che incapsulano un controllo nativo.
2. **Elementi nativi interni**: il Button renderizza un `<button>` nativo nello shadow root; il nome accessibile (testo dello slot o `aria-label` dichiarato come proprietà del componente) è applicato al controllo interno.
3. **Form association** tramite `ElementInternals` (`static formAssociated = true`) e un controller condiviso in `@uds/core` che gestisce submit, reset, stato disabled ereditato da `<fieldset disabled>` (`formDisabledCallback`) e `formResetCallback`.
4. **CSS**: stili in `*.styles.ts` con `css` di Lit (adoptedStyleSheets); valori solo da custom properties di token; personalizzazione via custom properties pubbliche e `::part()`.
5. **Registrazione** con `defineElement` idempotente; entry point di side effect separati dalle classi.
6. **SSR-safety**: nessun accesso a globali del browser all'import; verificato da un test che importa ogni entry point in Node.

## Alternative scartate

- Light DOM: perde l'incapsulamento degli stili, rende fragile la coerenza grafica tra applicazioni.
- `<button>` come host con `is="..."` (customized built-ins): non supportato da Safari.

## Conseguenze

- Riferimenti ARIA via ID tra shadow root diversi non funzionano: limite documentato per componente (R-03).
- Browser minimi: supporto a `ElementInternals` (Safari ≥ 16.4).
