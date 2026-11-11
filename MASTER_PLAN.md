# Universal DS — Master Plan

> Documento operativo. Va letto all'inizio di ogni sessione insieme ad `ARCHITECTURE.md`.
> Riporta lo **stato reale** di avanzamento: nulla è marcato come completato senza verifica.
> Ultimo aggiornamento: 2026-11-11.

---

## 1. Stato attuale

| Milestone                        | Stato                                                      | Report                                                         |
| -------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| M0 — Discovery e Architecture    | **Completata e approvata (2026-11-11)**                    | [`docs/milestones/M0-report.md`](docs/milestones/M0-report.md) |
| M1 — Foundation                  | **Completata**: 10/10 criteri; CI verde sul primo push     | [`docs/milestones/M1-report.md`](docs/milestones/M1-report.md) |
| M2 — Core Design System          | **Completata in locale (2026-11-11); CI al prossimo push** | [`docs/milestones/M2-report.md`](docs/milestones/M2-report.md) |
| M3 — Button                      | **Implementata in locale (2026-11-11), stato beta**        | [`docs/milestones/M3-report.md`](docs/milestones/M3-report.md) |
| M4 — Cross-framework             | **Implementata in locale (2026-11-11)**                    | [`docs/milestones/M4-report.md`](docs/milestones/M4-report.md) |
| M5 — Portal Foundation           | Non iniziata                                               | —                                                              |
| M6 — Playground e Configurator   | Non iniziata                                               | —                                                              |
| M7 — Theme Builder               | Non iniziata                                               | —                                                              |
| M8 — Visual Component Builder    | Non iniziata                                               | —                                                              |
| M9 — CLI e Distribuzione         | Non iniziata                                               | —                                                              |
| M10 — PWA e Production Readiness | Non iniziata                                               | —                                                              |

---

## 2. Prerequisiti d'ambiente

Stato al 2026-11-11 (fine M1):

| Strumento       | Stato                         | Azione richiesta                                                                           |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| Node.js         | 24.15.0 ✅                    | Nessuna                                                                                    |
| pnpm            | 12.19.0 ✅ (`~/.local/bin`)   | Nessuna: installazione utente via corepack, senza sudo; `~/.bash_profile` aggiorna il PATH |
| git             | 2.54.0 ✅, primo commit       | Nessuna                                                                                    |
| Remote Git / CI | ✅ `angelantony/Universal-DS` | Nessuna: CI verde sul primo push (run `42989094121`)                                       |

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
- [x] 7. CI iniziale verde sul primo push (run [`42989094121`](https://github.com/angelantony/Universal-DS/actions/runs/42989094121), 2026-11-11).
- [x] 8. Changesets inizializzato con la configurazione di ADR-0009 (nessuna pubblicazione).
- [x] 9. `README.md`, `CONTRIBUTING.md`, `docs/development/setup.md`.
- [x] 10. Report M1.

Nessun componente UI in questa milestone.

### M2 — Core Design System ✅ (locale, 2026-11-11)

- [x] 1. `@uds/tokens`: sorgenti DTCG (tutte le categorie di §7.1), build Style Dictionary verso CSS/JSON/TS; test di snapshot dell'output; validazione DTCG.
- [x] 2. `@uds/themes`: light, dark, high-contrast, un brand di esempio; `ThemeManager` con test di cambio a runtime e persistenza opzionale.
- [x] 3. Test di contrasto automatici su tutte le coppie testo/sfondo semantiche di ogni tema (≥ 4.5:1 testo, ≥ 3:1 componenti non testuali e focus).
- [x] 4. `@uds/core`: `UdsElement`, `defineElement` idempotente, controller form association, stili base (focus ring, reduced motion, forced colors), test "import-safe in Node".
- [x] 5. `@uds/icons`: registry, `<uds-icon>`, sanitizzazione con test di payload malevoli.
- [x] 6. `@uds/metadata`: schema Zod, JSON Schema esportato, validatore, registry, contract check su un fixture di test (non UI). CEM non adottato: l'analyzer pubblica TypeScript 5.4 (R-05); il controllo confronta decoratori Lit e tag JSDoc.
- [x] 7. Regole lint contro valori grafici hard-coded, con test.
- [x] 8. Storybook interno avviato e verificato nel browser (storie dell'icona).
- [x] 9. Standard del componente documentato in `docs/standards/component-standard.md`.

La CI di M2 non include ancora questo codice: i file non sono in un commit.

### M3 — Button (beta, 2026-11-11)

- [x] `uds-button` con `variant` + `tone`, custom property, form association, icone, loading e target minimo 24px.
- [x] Metadata allineati al sorgente (contract check su decoratori e JSDoc; CEM non adottato, R-05).
- [x] axe, tastiera, 6 viewport, zoom 200% e 400%.
- [x] Baseline visive Chromium nell'immagine Docker Playwright: 6 viewport × 3 temi. Firefox e WebKit visivi aperti. Il test non gira nella suite ordinaria.
- [x] Bundle del modulo Button: 3570 byte gzip, sotto 8 kB, escluse le dipendenze.
- [ ] Checklist manuale NVDA, VoiceOver e Safari reale. Il file c'è; le righe manuali non sono eseguite. Per questo lo stato è `beta`.
- [ ] `publint`, `attw`, `madge`.

Dettaglio in [`docs/milestones/M3-report.md`](docs/milestones/M3-report.md).

### M4 — Cross-framework (2026-11-11)

- [x] `@uds/react`, `@uds/angular`, `@uds/vue` generati da `tools/generators` a partire da `componentCatalog`. Il test del generatore fallisce se i file committati divergono.
- [x] Demo vanilla, React 19, Angular 22 e Vue 3 installate da tarball (`pnpm pack`, dipendenze `@uds/*` riscritte in `file:`).
- [x] Playwright: proprietà, click, slot, submit e reset su Chromium, per ogni demo.
- [x] `tsc` / `vue-tsc` / `ngc` accettano le demo e rifiutano `variant="nope"`.
- [ ] `ControlValueAccessor` e `v-model` sono generati solo per i componenti di form. Il Button non lo è; il ramo è coperto da un fixture del generatore, non da una demo.

Dettaglio in [`docs/milestones/M4-report.md`](docs/milestones/M4-report.md). M5 non è iniziata.

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
| R-01 | Deriva tra metadata e implementazione                                                                                    | Media      | Alto         | Enum importati dai metadata + contract check su decoratori e JSDoc (ADR-0004, R-05)                                       |
| R-02 | Angular e typescript-eslint non supportano TypeScript 7                                                                  | Certa oggi | Alto         | Pin su 6.0.x; rivalutazione a ogni minor di Angular (ADR-0002)                                                            |
| R-03 | Form association e ARIA attraverso lo Shadow DOM (riferimenti `aria-describedby`/`labelledby` cross-root non supportati) | Alta       | Alto         | `ElementInternals`; nome accessibile propagato all'elemento nativo interno; limiti documentati per componente             |
| R-04 | Regressione visiva instabile tra sistemi operativi                                                                       | Alta       | Medio        | Baseline generate solo nell'immagine Docker Playwright                                                                    |
| R-05 | Custom Elements Manifest analyzer (TS 5.4 interno) e decoratori standard con `accessor`                                  | Media      | Medio        | Mitigato in M2: contract check su decoratori e JSDoc. CEM da rivalutare se l'analyzer supporta TypeScript 6               |
| R-06 | WebKit di Playwright ≠ Safari reale; Edge ≈ Chromium                                                                     | Certa      | Medio        | Matrice documentata; Safari reale verificato manualmente o via servizio cloud (da autorizzare)                            |
| R-07 | Personalizzazione libera dei colori del Button che viola il contrasto                                                    | Alta       | Alto         | ADR-0011: `variant="custom"` documentato come responsabilità del consumatore + validazione di contrasto nel Theme Builder |
| R-08 | Due versioni della libreria nella stessa pagina (conflitto `customElements.define`)                                      | Media      | Alto         | `defineElement` idempotente + warning; valutare Scoped Custom Element Registries in M10                                   |
| R-09 | Peso di Monaco sulla PWA e sull'offline                                                                                  | Media      | Medio        | Lazy loading, precache opzionale dei worker solo del Playground                                                           |
| R-10 | Scope eccessivo della piattaforma                                                                                        | Alta       | Alto         | Milestone indipendenti con criteri di uscita; Builder (M8) rinviabile senza impatti sul core                              |
| R-11 | (Risolto in M1) Ambiente locale senza git/pnpm                                                                           | Certa      | Bloccante M1 | Vedi §2                                                                                                                   |
| R-12 | Versioni "latest" molto recenti (Nx 24, Vite 8, Vitest 5, Storybook 10, pnpm 12) con incompatibilità reciproche non note | Media      | Medio        | Verifica della matrice in M1 con smoke test; pin esatti nel lockfile                                                      |
