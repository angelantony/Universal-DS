# Report — Milestone 1: Foundation

- Data: 2026-11-11
- Stato: **completata; 10 criteri su 10. CI verde sul primo push** (run [`42989094121`](https://github.com/angelantony/Universal-DS/actions/runs/42989094121))

## Obiettivi

Creare un monorepo funzionante e verificato: pnpm, Nx, TypeScript strict, lint, formattazione, testing, Git, CI iniziale, Changesets, documentazione di base. Nessun componente UI.

## Funzionalità implementate

- Workspace pnpm 12.19.0 (fissato con `packageManager`, via corepack) con **catalog** per le versioni condivise e politiche supply-chain attive (`allowBuilds`, età minima delle release).
- Nx 24.0.6 con target inferiti: `typecheck` e `build` (`@nx/js/typescript`), `lint` (`@nx/eslint`), `test` (`@nx/vitest`), `e2e` (`@nx/playwright`). Project references TypeScript mantenuti da `nx sync`.
- TypeScript 6.0.3 strict (inclusi `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`), con condizione di export `@uds/source` per risolvere i sorgenti nel workspace.
- ESLint 10 (flat config) con typescript-eslint strict + stylistic type-checked, `@nx/enforce-module-boundaries` con i vincoli del dependency graph approvato, `@nx/dependency-checks` sui `package.json`, divieto di import di framework nei package `framework:none`, Prettier.
- 9 package scheletro con tag Nx: `tokens`, `themes`, `metadata` (foundation); `core`, `icons`, `components` (runtime); `code-generator`, `cli` (tooling); `testing` (test-util). Tutti `private` fino a M9.
- `@uds/testing`: viewport standard della strategia di test + test di fumo reali (vedi sotto).
- Changesets 3 con gruppo `fixed` per i package runtime e `@uds/testing` escluso.
- Workflow GitHub Actions `ci.yml`.
- Repository Git inizializzato (branch `main`), primo commit e primo push su `git@github.com:angelantony/Universal-DS.git` (repository privato).

## File creati

| Area                   | File                                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Root                   | `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `nx.json`, `tsconfig.base.json`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.editorconfig`, `.gitignore`, `.nvmrc`     |
| Documentazione         | `README.md`, `CONTRIBUTING.md`, `docs/development/setup.md`, `docs/milestones/M1-report.md`                                                                                                                        |
| Release                | `.changeset/config.json`, `.changeset/README.md`                                                                                                                                                                   |
| CI                     | `.github/workflows/ci.yml`                                                                                                                                                                                         |
| Package (×8 scheletri) | `package.json`, `tsconfig.json`, `tsconfig.lib.json`, `eslint.config.mjs`, `src/index.ts`                                                                                                                          |
| `packages/testing`     | `src/viewports.ts`, `src/index.ts`, `src/viewports.test.ts`, `src/platform.browser.test.ts`, `e2e/accessibility-pipeline.e2e.ts`, `vitest.config.ts`, `playwright.config.ts`, `tsconfig.spec.json` + file standard |

## File modificati

- `docs/architecture/testing-strategy.md`: comportamento di Safari/WebKit con il tasto Tab.
- `docs/architecture/dependency-graph.md`: secondo livello del divieto di import dei framework.
- `MASTER_PLAN.md`: stato reale.
- Documenti di M0: solo riformattazione Prettier (allineamento delle tabelle), nessun cambiamento di contenuto.

## Decisioni tecniche (minori, prese in autonomia)

1. **Decisioni aperte D-08 e D-09** applicate secondo raccomandazione: repository privato, licenza proprietaria (`UNLICENSED`), GitHub + GitHub Actions. Modificabili senza impatto sul codice.
2. **pnpm catalog** per le versioni condivise tra package (nessuna duplicazione di numeri di versione).
3. **Eccezioni all'età minima delle release** (`minimumReleaseAgeExclude`) per Nx 24.0.6 e Vite 8.3.8, aggiunte da pnpm perché fissate in modo esplicito. Da rimuovere quando le versioni superano la soglia.
4. **Divieto di import dei framework su due livelli**: il test negativo ha mostrato che `bannedExternalImports` di Nx non rileva package non ancora installati (es. `react`). Aggiunta la configurazione esportata `frameworkAgnostic` (`no-restricted-imports`), inclusa dai package `framework:none`.
5. **Package scheletro senza dipendenze dichiarate**: `@nx/dependency-checks` vieta dipendenze dichiarate ma non usate; gli archi del grafo compariranno con gli import reali in M2.
6. **Adapter (`react`, `angular`, `vue`), app e `tools/*`** non creati ora: richiedono tooling specifico (ng-packagr, Storybook, generatori Nx) e verranno creati nelle milestone che li usano (M2, M4, M5). Il gruppo `fixed` di Changesets verrà esteso quando esisteranno.
7. **Lingua della documentazione**: architettura, ADR, piani e report in italiano (destinati al proprietario); codice, commenti, README, CONTRIBUTING e guide di sviluppo in inglese (convenzione per sviluppatori e pacchetti npm).
8. **Versioni delle GitHub Actions** fissate per major (`@v4`); il pin per SHA è pianificato nell'audit di sicurezza di M10.

## Test eseguiti

| Verifica                                   | Comando                                                                                                                                                    | Esito                                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Installazione pulita con lockfile          | `rm -rf node_modules … && pnpm install --frozen-lockfile`                                                                                                  | ✅                                                                                     |
| Formattazione                              | `pnpm format:check`                                                                                                                                        | ✅                                                                                     |
| Lint (9 progetti)                          | `nx run-many -t lint`                                                                                                                                      | ✅                                                                                     |
| Typecheck (9 progetti)                     | `nx run-many -t typecheck`                                                                                                                                 | ✅                                                                                     |
| Build (9 progetti)                         | `nx run-many -t build`                                                                                                                                     | ✅                                                                                     |
| Vitest unit (Node)                         | `viewports.test.ts`                                                                                                                                        | ✅ 2/2                                                                                 |
| Vitest browser (Chromium, Firefox, WebKit) | `platform.browser.test.ts`: Custom Elements, Shadow DOM + adoptedStyleSheets, `ElementInternals` con form association, `:focus-visible`, container queries | ✅ 12/12 (4 × 3 browser)                                                               |
| Playwright + axe-core (3 browser)          | Form accessibile senza violazioni; violazione nota (`button-name`) rilevata; focus da tastiera                                                             | ✅ 9/9                                                                                 |
| Confini: runtime → tooling                 | probe `core` importa `@uds/cli`                                                                                                                            | ✅ bloccato, poi rimosso                                                               |
| Confini: framework in package agnostico    | probe `tokens` importa `react`                                                                                                                             | ❌ non rilevato al primo tentativo → corretto (decisione 4) → ✅ bloccato, poi rimosso |
| `nx sync:check`                            |                                                                                                                                                            | ✅                                                                                     |
| `pnpm audit --audit-level=high`            |                                                                                                                                                            | ✅ (1 moderata, vedi problemi aperti)                                                  |
| Changesets config                          | `changeset status`                                                                                                                                         | ⚠️ configurazione letta correttamente; il confronto git richiede almeno un commit      |

Totale: 14/14 test Vitest, 9/9 test Playwright superati. Nessun test disabilitato.

## Test falliti e correzioni

- **WebKit, test di focus da tastiera**: su macOS, Safari (e WebKit) non sposta il focus sui pulsanti con `Tab` ma con `Option+Tab`. Non è un difetto: è il comportamento reale della piattaforma. Il test ora usa il tasto che userebbe un utente Safari; il comportamento è documentato nella strategia di test perché vale per tutti i futuri test da tastiera dei componenti.

## Problemi aperti

1. **Warning di deprecazione in CI (non bloccanti)**: `actions/checkout@v4` e `actions/setup-node@v4` girano su Node.js 24 invece che su Node.js 20 (deprecazione di Node 20 sui runner GitHub). Il runner `ubuntu-latest` migrerà a Ubuntu 26 dal 19 ottobre 2026. Da aggiornare alle action più recenti in M10, insieme al pin per SHA.
2. **`pnpm` non nel PATH di sistema risolto**: `corepack enable` standard fallisce con `EACCES` su `/usr/local/bin` (directory di root, senza `sudo`). `pnpm` 12.19.0 è installato con `corepack enable --install-directory ~/.local/bin`, e `~/.bash_profile` aggiunge `~/.local/bin` al PATH. Node non è stato modificato. La CLI `gh` è installata come binario ufficiale in `~/.local/bin`, perché Homebrew richiede `sudo`.
3. **Vulnerabilità moderata** `minimatch` (GHSA-g3hv-75wg-m249), transitiva di Nx, solo in sviluppo. La correzione richiede `minimatch@11`, non supportato da Nx 24. Nessun input non attendibile passa da glob. Da ricontrollare a ogni aggiornamento di Nx.

## Debito tecnico

- Le directory `tools/{generators,lint,scripts,build}` sono previste ma non create: nascono in M2 con il primo contenuto reale (generatore di componenti, regole Stylelint, contract check).
- Configurazione Vitest browser locale a `@uds/testing`: verrà estratta in un preset condiviso (`tools/build`) quando il secondo package avrà test in browser (M2).

## Criteri di accettazione

| #   | Criterio                                                    | Esito                                   |
| --- | ----------------------------------------------------------- | --------------------------------------- |
| 1   | `pnpm install` con lockfile pulito                          | ✅ localmente e in CI (run 42989094121) |
| 2   | Nx configurato, progetti con i tag previsti                 | ✅                                      |
| 3   | `enforce-module-boundaries` con test negativo dimostrato    | ✅ (con correzione di una lacuna)       |
| 4   | TypeScript 6.0 strict, typecheck verde                      | ✅                                      |
| 5   | ESLint 10 + Prettier verdi                                  | ✅                                      |
| 6   | Vitest (Node + browser) e Playwright con test di fumo verdi | ✅                                      |
| 7   | CI iniziale verde sul primo push                            | ✅ run 42989094121 (2026-11-11)         |
| 8   | Changesets inizializzato, nessuna pubblicazione             | ✅                                      |
| 9   | README, CONTRIBUTING, setup                                 | ✅                                      |
| 10  | Report M1                                                   | ✅                                      |

## Prossima milestone

M2 — Core Design System (token DTCG e Style Dictionary, temi e ThemeManager, `@uds/core`, Icon Registry, schema dei metadata con contract check, Storybook interno, regole lint sui valori grafici), dopo la tua autorizzazione.
