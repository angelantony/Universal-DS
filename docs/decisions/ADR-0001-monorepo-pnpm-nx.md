# ADR-0001 — Monorepo con pnpm e Nx

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Contesto

Servono molti package con dipendenze vincolate, build incrementali, test "affected" e app demo per più framework.

## Alternative

| Opzione              | Pro                                                                                                                 | Contro                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **pnpm + Nx**        | Richiesto dalla specifica; grafo, cache, affected, `enforce-module-boundaries`, plugin Angular/React/Vite/Storybook | Curva di apprendimento, configurazione iniziale           |
| pnpm + Turborepo     | Semplice                                                                                                            | Nessuna regola di boundary nativa, plugin Angular assenti |
| Solo pnpm workspaces | Minimo                                                                                                              | Nessuna cache, nessun affected, regole da scrivere a mano |

## Decisione

pnpm (versione fissata con `packageManager`, installato via corepack) + Nx 24 con plugin inferiti (`@nx/vite`, `@nx/js`, `@nx/angular`, `@nx/storybook`, `@nx/playwright`, `@nx/eslint`). TypeScript Project References gestiti da Nx (`@nx/js/typescript` sync) per i package TS.
`pnpm` con `strict-peer-dependencies`, `link-workspace-packages`, `onlyBuiltDependencies` esplicito.

## Conseguenze

- Le dipendenze tra package sono `workspace:*`.
- Nx Cloud **non** viene attivato senza autorizzazione (cache solo locale/CI).
