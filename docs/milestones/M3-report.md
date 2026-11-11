# Report — Milestone 3: Button

- Data: 2026-11-11
- Stato: **implementata e verificata in automatico**. La checklist manuale con NVDA, VoiceOver e Safari reale è aperta. Il componente è `beta`.

## Obiettivi

Primo componente di prodotto: `uds-button`, un solo custom element, con metadata, temi, icone, form association e i controlli di qualità già decisi. Nessun adapter, portale o pubblicazione.

## Funzionalità implementate

- `uds-button` in `@uds/components`. Lo shadow root contiene un `<button>` nativo. `type="submit"` e `type="reset"` agiscono sul form del light DOM tramite `ElementInternals`.
- Assi `variant` (`primary`, `secondary`, `tertiary`, `outline`, `ghost`, `text`, `custom`) e `tone` (`neutral`, `danger`, `success`, `warning`). `size` da `xs` a `xl`, più `custom`.
- Proprietà: `disabled`, `loading`, `fullWidth`, `iconStart`, `iconEnd`, `iconOnly`, `ariaLabel`, `loadingLabel`.
- Gli stili sono custom property `--uds-button-*`. `variant="custom"` non applica una ricetta di colore: il contrasto resta di chi le sovrascrive.
- Il target non scende sotto 24 CSS px (`max` con il token della size `xs`).
- `disabled` è nativo e non è nel tab order. `loading` resta focalizzabile, imposta `aria-busy` e `aria-disabled`, blocca il click e può annunciare `loadingLabel`.
- Icona senza nome: in sviluppo compare un warning. Con `ariaLabel` il bottone interno ha quel nome.
- Token nuovi: `onCanvas` per danger, success e warning (light, dark, high-contrast) e le misure `button.size.*`. Il contrasto di queste coppie è nel test dei temi.
- Storybook: storie Varianti, Dimensioni e Stati, in italiano e in inglese.
- Il contract check accetta `override accessor`, necessario perché `ariaLabel` esiste già sul DOM.

## File creati

| Area                                       | Contenuto                                             |
| ------------------------------------------ | ----------------------------------------------------- |
| `packages/components/src/button`           | Classe, stili, metadata, define, README, test         |
| `packages/components/e2e`                  | Viewport, axe sui tre temi, tastiera, baseline visive |
| `apps/storybook/stories/button.stories.ts` | Storie del Button                                     |
| `docs/accessibility/components/button.md`  | Checklist                                             |
| `docs/milestones/M3-report.md`             | Questo report                                         |

## File modificati

- Token e temi: colori `onCanvas`, misure del Button, coppie di contrasto.
- `tools/contract-check`: il decoratore può stare su `override accessor`.
- `apps/storybook`: dipendenza da `@uds/components` e testi it/en.
- Changeset del design system, non ancora pubblicato.

## Decisioni

1. **Stato `beta`.** I test automatici ci sono. NVDA, VoiceOver e Safari reale no. Un componente `stable` richiede la checklist manuale compilata.
2. **Niente `aria-disabled` focalizzabile.** `disabled` toglie il controllo dal tab order. Il loading resta focalizzabile ed è lo stato “occupato”.
3. **CEM resta fuori** (R-05). Il contract check del Button confronta metadata, decoratori e JSDoc, come in M2.
4. **Baseline visive solo nell'immagine Docker** `mcr.microsoft.com/playwright:v1.65.0-jammy`, progetto Chromium. Il test è `e2e/button.visual.e2e.ts` e parte con `UDS_VISUAL=1`. La suite ordinaria lo salta, così una macchina macOS non rigenera i PNG.

## Test eseguiti

| Verifica                                                                                             | Esito                                 |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Lint, typecheck, test Vitest del package                                                             | ✅                                    |
| Vitest browser ×3: nome, submit, reset, disabled, loading, focus, warning icona, fieldset, 24px, axe | ✅                                    |
| Playwright ×3: 6 viewport, zoom 200% e 400%, axe su light/dark/high-contrast, tastiera               | ✅ 9/9                                |
| Contrasto token, incluso `onCanvas`                                                                  | ✅                                    |
| Stylelint                                                                                            | ✅                                    |
| Bundle `define.js` minificato + gzip, dipendenze esterne                                             | ✅ 3570 byte, sotto 8 kB              |
| Baseline visive Chromium, 6 viewport × 3 temi, rieseguite nella stessa immagine Docker               | ✅ 18 PNG, secondo passaggio identico |
| Storybook nel browser: 24 bottoni “Salva”, stati, click, passaggio a inglese (“Save”)                | ✅                                    |

## Problemi aperti

1. Checklist manuale NVDA, VoiceOver, iOS, sola tastiera percepita, zoom percepito, forced colors percepiti.
2. Baseline visive di Firefox e WebKit non generate. Il confronto in CI non è ancora un job: va eseguito nella stessa immagine Docker, non sul runner Ubuntu generico.
3. `publint`, `attw` e `madge` non sono stati eseguiti.
4. La CI di GitHub non ha ancora questo codice: non c'è un commit.

## Debito tecnico

- Il bundle misurato esclude Lit, `@uds/core` e `@uds/icons`, che restano dipendenze separate. 3570 byte è solo il modulo del Button.
- `ghost` e `text` condividono la ricetta di colore. `text` aggiunge la sottolineatura al hover.

## Criteri di accettazione

1. `uds-button` secondo ADR-0011, con form association. ✅
2. Metadata validi e allineati al sorgente. ✅ CEM non usato (R-05).
3. axe, tastiera, 24px, contrasto. ✅
4. Sei viewport e reflow. ✅
5. Regressione visiva variant × size × state × tema. ✅ su Chromium nell'immagine Docker. Firefox e WebKit aperti.
6. Budget di bundle. ✅ 3570 byte gzip.
7. Checklist manuale compilata con esito. ❌ Le righe manuali sono nel file e risultano non eseguite.
8. Storybook verificato nel browser. ✅

## Prossima milestone

M4 — Cross-framework. Implementata dopo questa milestone: vedi [`M4-report.md`](M4-report.md).
