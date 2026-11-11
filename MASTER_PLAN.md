# Universal DS — Master Plan

> Documento operativo. Va letto all'inizio di ogni sessione insieme ad `ARCHITECTURE.md`.
> Riporta lo **stato reale** di avanzamento: nulla è marcato come completato senza verifica.
> Ultimo aggiornamento: 2026-11-11.

---

## 1. Stato attuale

| Milestone                        | Stato                                                                           | Report                                                         |
| -------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| M0 — Discovery e Architecture    | **Completata e approvata (2026-11-11)**                                         | [`docs/milestones/M0-report.md`](docs/milestones/M0-report.md) |
| M1 — Foundation                  | **Verificata localmente**: 9/10 criteri; CI sul primo push in attesa del remote | [`docs/milestones/M1-report.md`](docs/milestones/M1-report.md) |
| M2 — Core Design System          | Non iniziata                                                                    | —                                                              |
| M3 — Button                      | Non iniziata                                                                    | —                                                              |
| M4 — Cross-framework             | Non iniziata                                                                    | —                                                              |
| M5 — Portal Foundation           | Non iniziata                                                                    | —                                                              |
| M6 — Playground e Configurator   | Non iniziata                                                                    | —                                                              |
| M7 — Theme Builder               | Non iniziata                                                                    | —                                                              |
| M8 — Visual Component Builder    | Non iniziata                                                                    | —                                                              |
| M9 — CLI e Distribuzione         | Non iniziata                                                                    | —                                                              |
| M10 — PWA e Production Readiness | Non iniziata                                                                    | —                                                              |

---

## 2. Prerequisiti d'ambiente

Stato al 2026-11-11 (fine M1):

| Strumento       | Stato                        | Azione richiesta                                                                        |
| --------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| Node.js         | 24.15.0 ✅                   | Nessuna                                                                                 |
| pnpm            | 12.19.0 via corepack ⚠️      | Eseguire `corepack enable` per avere `pnpm` nel PATH (vedi `docs/development/setup.md`) |
| git             | 2.54.0 ✅, repository creato | Configurare `user.name` / `user.email` ed effettuare il primo commit                    |
| Remote Git / CI | ❌ assente                   | Creare il repository GitHub e fare il primo push: chiude il criterio 7 di M1            |

---

## 3. Decisioni del proprietario

| ID   | Decisione                                                                  | Esito                                                       | Data       |
| ---- | -------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- |
| D-01 | Scope npm e prefisso dei tag                                               | ✅ `@uds/*`, tag `uds-*`                                    | 2026-11-11 |
| D-02 | Portale unico, Storybook interno (ADR-0007)                                | ✅ Approvata                                                | 2026-11-11 |
| D-03 | Runtime fixed, strumenti indipendenti (ADR-0009)                           | ✅ Approvata                                                | 2026-11-11 |
| D-04 | TypeScript 6.0.x (ADR-0002)                                                | ✅ Approvata                                                | 2026-11-11 |
| D-06 | Stili del Button via CSS custom properties + `variant="custom"` (ADR-0011) | ✅ Approvata                                                | 2026-11-11 |
| D-07 | Button con assi `variant` + `tone` (ADR-0011)                              | ✅ Approvata                                                | 2026-11-11 |
| D-08 | Repository privato, licenza proprietaria (`UNLICENSED`)                    | ✅ Applicata la raccomandazione all'avvio di M1 ("procedi") | 2026-11-11 |
| D-09 | GitHub + GitHub Actions                                                    | ✅ Applicata la raccomandazione all'avvio di M1 ("procedi") | 2026-11-11 |

Decisioni ancora aperte:

| ID   | Decisione                                                                         | Raccomandazione                                             | Necessaria prima di    |
| ---- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------- |
| D-05 | Registry privato di destinazione (GitHub Packages, Artifactory, Azure Artifacts…) | In assenza: Verdaccio locale solo per test di installazione | M9 (test locali da M4) |

---

## 4. Roadmap con criteri di accettazione

Ogni milestone è completata solo se tutti i criteri sono verificati e il report è prodotto (vedi §5). I controlli obbligatori falliti bloccano la chiusura.

### M0 — Discovery e Architecture ✅

- [x] Analisi dei requisiti e delle contraddizioni → `docs/architecture/requirements-analysis.md`
- [x] Valutazione delle tecnologie con verifica delle versioni reali sul registry npm
- [x] Architettura, struttura del monorepo, package e responsabilità → `ARCHITECTURE.md`
- [x] Dependency graph e regole → `docs/architecture/dependency-graph.md`
- [x] Component Metadata Registry → `docs/architecture/metadata-registry.md`
- [x] Strategia cross-framework, testing, versionamento → ADR-0006, 0008, 0009
- [x] ADR 0001–0011
- [x] Approvazione del proprietario (2026-11-11)

### M1 — Foundation

Criteri di accettazione:

- [x] 1. `pnpm install` con lockfile pulito su macchina nuova (in CI: vedi 7).
- [x] 2. Nx configurato; i progetti scheletro hanno i tag previsti.
- [x] 3. `enforce-module-boundaries` attivo con test negativo dimostrato.
- [x] 4. TypeScript 6.0 strict con config base condivise; `typecheck` verde.
- [x] 5. ESLint 10 (flat config) + Prettier; `lint` e `format:check` verdi.
- [x] 6. Vitest (Node + browser mode) e Playwright con test di fumo verdi.
- [ ] 7. CI iniziale verde sul primo push — **in attesa del repository remoto**.
- [x] 8. Changesets inizializzato con la configurazione di ADR-0009 (nessuna pubblicazione).
- [x] 9. `README.md`, `CONTRIBUTING.md`, `docs/development/setup.md`.
- [x] 10. Report M1.

Nessun componente UI in questa milestone.

### M2 — Core Design System

1. `@uds/tokens`: sorgenti DTCG (tutte le categorie di §7.1), build Style Dictionary verso CSS/JSON/TS; test di snapshot dell'output; validazione DTCG.
2. `@uds/themes`: light, dark, high-contrast, un brand di esempio; `ThemeManager` con test di cambio a runtime e persistenza opzionale.
3. Test di contrasto automatici su tutte le coppie testo/sfondo semantiche di ogni tema (≥ 4.5:1 testo, ≥ 3:1 componenti non testuali e focus).
4. `@uds/core`: `UdsElement`, `defineElement` idempotente, controller form association, stili base (focus ring, reduced motion, forced colors), test "import-safe in Node".
5. `@uds/icons`: registry, `<uds-icon>`, sanitizzazione con test di payload malevoli.
6. `@uds/metadata`: schema Zod, JSON Schema esportato, validatore, registry, contract check con CEM su un componente fixture di test (non UI).
7. Regole lint contro valori grafici hard-coded, con test.
8. Storybook interno avviabile.
9. Standard del componente documentato in `docs/standards/component-standard.md`.

### M3 — Button

Definition of Done di §29 della specifica, applicata a `uds-button`; inoltre: metadata validi e coerenti col CEM, checklist a11y manuale (NVDA + VoiceOver + sola tastiera) compilata, regressione visiva su tutte le varianti × dimensioni × stati × temi, test alle 6 viewport, budget di bundle misurato.

### M4 — Cross-framework

Demo vanilla, React, Angular, Vue che installano i package **da tarball** (non dal workspace); test e2e Playwright per proprietà, eventi, slot, form submit/reset, tipizzazioni (type check delle demo con errori attesi su valori non ammessi).

### M5 — Portal Foundation

Dashboard, navigazione, catalogo con ricerca e filtri, dettaglio componente generato dai metadata, viewer dei token, preview. Test a11y (axe) e responsive del portale.

### M6 — Playground e Configurator

Controlli generati dai metadata, preview in iframe sandbox, selettore di framework, Monaco (lazy), `@uds/code-generator` con test di compilazione degli snippet (tsc, ngc, vue-tsc, validazione HTML).

### M7 — Theme Builder

`@uds/theme-tools` + UI: palette, tipografia, preview, confronto, validazione di contrasto, export CSS/JSON, applicazione a runtime. Persistenza locale; interfacce pronte per backend futuro.

### M8 — Visual Component Builder

`@uds/builder-engine` headless (albero, comandi, undo/redo, serializzazione) testato in isolamento; UI con drag and drop accessibile da tastiera; export tramite code generator.

### M9 — CLI e Distribuzione

`init`, `add`, `list`, `doctor` con test; packaging verificato (`publint`, `attw`); test su registry privato o Verdaccio; workflow di release con approvazione manuale. Nessuna pubblicazione reale senza autorizzazione.

### M10 — PWA e Production Readiness

PWA (manifest, service worker, offline, aggiornamenti), audit di performance, sicurezza e accessibilità, matrice browser completa, SSR con test di hydration, documentazione finale, release `1.0.0` (con autorizzazione).

---

## 5. Template del report di milestone

Ogni report in `docs/milestones/Mx-report.md` contiene: obiettivi, funzionalità implementate, file creati, file modificati, decisioni tecniche, test eseguiti / superati / falliti, problemi aperti, debito tecnico, criteri di accettazione (con esito per ciascuno), prossima milestone.

---

## 6. Registro dei rischi

| ID   | Rischio                                                                                                                  | Prob.      | Impatto      | Mitigazione                                                                                                               |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| R-01 | Deriva tra metadata e implementazione                                                                                    | Media      | Alto         | Enum importati dai metadata + contract check CEM bloccante (ADR-0004)                                                     |
| R-02 | Angular e typescript-eslint non supportano TypeScript 7                                                                  | Certa oggi | Alto         | Pin su 6.0.x; rivalutazione a ogni minor di Angular (ADR-0002)                                                            |
| R-03 | Form association e ARIA attraverso lo Shadow DOM (riferimenti `aria-describedby`/`labelledby` cross-root non supportati) | Alta       | Alto         | `ElementInternals`; nome accessibile propagato all'elemento nativo interno; limiti documentati per componente             |
| R-04 | Regressione visiva instabile tra sistemi operativi                                                                       | Alta       | Medio        | Baseline generate solo nell'immagine Docker Playwright                                                                    |
| R-05 | Custom Elements Manifest analyzer (TS 5.4 interno) e decoratori standard con `accessor`                                  | Media      | Medio        | Spike in M2; fallback: plugin CEM custom o JSDoc espliciti                                                                |
| R-06 | WebKit di Playwright ≠ Safari reale; Edge ≈ Chromium                                                                     | Certa      | Medio        | Matrice documentata; Safari reale verificato manualmente o via servizio cloud (da autorizzare)                            |
| R-07 | Personalizzazione libera dei colori del Button che viola il contrasto                                                    | Alta       | Alto         | ADR-0011: `variant="custom"` documentato come responsabilità del consumatore + validazione di contrasto nel Theme Builder |
| R-08 | Due versioni della libreria nella stessa pagina (conflitto `customElements.define`)                                      | Media      | Alto         | `defineElement` idempotente + warning; valutare Scoped Custom Element Registries in M10                                   |
| R-09 | Peso di Monaco sulla PWA e sull'offline                                                                                  | Media      | Medio        | Lazy loading, precache opzionale dei worker solo del Playground                                                           |
| R-10 | Scope eccessivo della piattaforma                                                                                        | Alta       | Alto         | Milestone indipendenti con criteri di uscita; Builder (M8) rinviabile senza impatti sul core                              |
| R-11 | (Risolto in M1) Ambiente locale senza git/pnpm                                                                           | Certa      | Bloccante M1 | Vedi §2                                                                                                                   |
| R-12 | Versioni "latest" molto recenti (Nx 24, Vite 8, Vitest 5, Storybook 10, pnpm 12) con incompatibilità reciproche non note | Media      | Medio        | Verifica della matrice in M1 con smoke test; pin esatti nel lockfile                                                      |
