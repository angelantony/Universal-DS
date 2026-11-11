# ADR-0004 — Metadata colocati come fonte di verità + contract test

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Contesto

§6 richiede un registry centralizzato e nessuna duplicazione. Lit però richiede la dichiarazione delle proprietà nella classe.

## Alternative

| Opzione                                                                            | Pro                                                      | Contro                                                                                        |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| A. Metadata generati dal sorgente (solo CEM + JSDoc)                               | Una sola dichiarazione                                   | JSDoc non esprime vincoli, esempi, a11y, controlli; dati poveri                               |
| B. Metadata scritti a mano, separati, senza verifica                               | Ricchi                                                   | Due fonti di verità che divergono                                                             |
| **C. Metadata colocati, enum/tipi importati dalla classe, verifica CEM bloccante** | Ricchi, tipi derivati, deriva impossibile senza CI rossa | Un passaggio di build in più                                                                  |
| D. Classe Lit generata dai metadata                                                | Una dichiarazione                                        | Generazione di codice di implementazione, contrario a §6 ("non sostituire la logica interna") |

## Decisione

Opzione **C**.

- Schema in `@uds/metadata` (Zod 4 + JSON Schema esportato).
- Definizioni `*.meta.ts` accanto al componente, `as const satisfies ComponentMetadata`.
- I tipi pubblici (`ButtonVariant`, `ButtonSize`…) sono derivati dai metadata.
- `tools/scripts/contract-check` confronta il CEM con i metadata e fallisce su ogni divergenza.

## Conseguenze

Ogni componente nuovo nasce dal generatore Nx con `*.meta.ts` già presente. Gli adapter, la documentazione e i controlli derivano da questo file.
