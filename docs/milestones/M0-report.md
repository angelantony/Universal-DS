# Report — Milestone 0: Discovery e Architecture

- Data: 2026-11-11
- Stato: **completata e approvata dal proprietario (2026-11-11)**

## Obiettivi

Analizzare la specifica, individuare contraddizioni, valutare le tecnologie, definire architettura, package, dipendenze, metadata registry, strategie cross-framework, testing e versionamento. Nessuna implementazione.

## Funzionalità implementate

Nessuna (per scelta: la milestone è solo documentale).

## File creati

| File                                         | Contenuto                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| `ARCHITECTURE.md`                            | Architettura, struttura del monorepo, package, regole, indice ADR                   |
| `MASTER_PLAN.md`                             | Stato, prerequisiti, decisioni aperte, roadmap con criteri di accettazione, rischi  |
| `docs/architecture/requirements-analysis.md` | Verifica delle versioni, 15 contraddizioni/ambiguità con risoluzione, tracciabilità |
| `docs/architecture/dependency-graph.md`      | Grafo, tag Nx, regole di boundary                                                   |
| `docs/architecture/metadata-registry.md`     | Schema del contratto, validazione, flusso di verifica                               |
| `docs/architecture/testing-strategy.md`      | Livelli di test, matrice browser, quality gates                                     |
| `docs/architecture/versioning-governance.md` | SemVer applicato, deprecazione, release, rollback, governance                       |
| `docs/decisions/ADR-0001` … `ADR-0011`       | Decisioni architetturali                                                            |
| `docs/milestones/M0-report.md`               | Questo report                                                                       |

## File modificati

Nessuno (workspace inizialmente vuoto).

## Decisioni tecniche principali

1. TypeScript 6.0.3 invece di 7.x per compatibilità con Angular 22 e typescript-eslint (ADR-0002).
2. Metadata colocati con contract test sul Custom Elements Manifest (ADR-0004).
3. Form association tramite `ElementInternals` (ADR-0003).
4. Token DTCG a tre livelli, temi tramite attributi `data-uds-*` e `@layer` (ADR-0005).
5. Adapter generati dai metadata (ADR-0006).
6. Portale unico; Storybook solo interno; playground in iframe sandbox (ADR-0007).
7. Test dei componenti in browser reali; baseline visive in Docker (ADR-0008).
8. Changesets: runtime fixed, strumenti indipendenti (ADR-0009).

## Test eseguiti

| Verifica                                                               | Esito                                             |
| ---------------------------------------------------------------------- | ------------------------------------------------- |
| Versioni correnti dei package sul registry npm                         | ✅ eseguita                                       |
| Peer dependency TypeScript di Angular, typescript-eslint, CEM analyzer | ✅ eseguita — incompatibilità TS 7 rilevata       |
| Ambiente locale (Node, npm, pnpm, git)                                 | ⚠️ pnpm assente, git bloccato dalla licenza Xcode |

Nessun test di codice: non esiste ancora codice.

## Problemi aperti

- Decisioni ancora aperte D-05, D-08, D-09 (`MASTER_PLAN.md` §3).
- Prerequisiti d'ambiente per M1 (`MASTER_PLAN.md` §2).
- Il repository non è ancora sotto controllo di versione (git non utilizzabile).

## Debito tecnico

Nessuno. Da verificare in M1–M2: compatibilità reciproca di Nx 24 / pnpm 12 / Vite 8 / Vitest 5 / Storybook 10 (R-12) e del CEM analyzer con i decoratori standard (R-05).

## Criteri di accettazione

| Criterio                                                   | Esito                                              |
| ---------------------------------------------------------- | -------------------------------------------------- |
| Requisiti analizzati e contraddizioni documentate          | ✅                                                 |
| Scelte tecnologiche valutate con dati reali                | ✅                                                 |
| Architettura e struttura del monorepo definite             | ✅                                                 |
| Dependency graph e regole definite                         | ✅                                                 |
| Package e responsabilità definiti                          | ✅                                                 |
| Metadata registry definito                                 | ✅                                                 |
| Strategie cross-framework, testing, versionamento definite | ✅                                                 |
| Documenti architetturali e ADR creati                      | ✅                                                 |
| Approvazione del proprietario                              | ✅ 2026-11-11 (D-01, D-02, D-03, D-04, D-06, D-07) |

## Prossima milestone

M1 — Foundation, dopo approvazione e risoluzione dei prerequisiti d'ambiente.
