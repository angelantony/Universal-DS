# Strategia di testing e quality gates

## 1. Livelli di test

| Livello                  | Strumenti                                                                                           | Ambiente                                                      | Cosa verifica                                                                             | Da milestone             |
| ------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------ |
| Unit (logica pura)       | Vitest                                                                                              | Node                                                          | Token build, metadata schema, code generator, theme tools, builder engine, CLI            | M1                       |
| Component                | Vitest browser mode + Playwright provider, Testing Library (query shadow-aware)                     | Chromium, Firefox, WebKit                                     | Rendering, proprietà, attributi, stati, eventi, slot, form association, personalizzazione | M2                       |
| Accessibilità automatica | axe-core (in Vitest browser e `@axe-core/playwright`)                                               | Browser reale                                                 | Regole WCAG 2.2 A/AA automatizzabili, per ogni variante × stato × tema                    | M2                       |
| Contrasto                | Script su token risolti                                                                             | Node                                                          | Coppie testo/sfondo e indicatori di focus di ogni tema                                    | M2                       |
| Contratto                | Script CEM ↔ metadata                                                                               | Node                                                          | Assenza di deriva del contratto pubblico                                                  | M2                       |
| Visual regression        | Playwright `toHaveScreenshot` su Storybook statico                                                  | Immagine Docker Playwright                                    | Regressioni grafiche; 6 viewport; temi                                                    | M3                       |
| Responsive               | Playwright                                                                                          | 320, 375, 768, 1024, 1440, 1920 px; zoom 200% e 400% (reflow) | Layout, overflow, reflow                                                                  | M3                       |
| Integrazione framework   | Playwright e2e sulle demo; `tsc`, `ngc`, `vue-tsc`                                                  | Demo installate da tarball                                    | Binding, eventi, slot, tipizzazioni, form                                                 | M4                       |
| Snippet generati         | Compilazione in progetti fixture                                                                    | Node                                                          | Il codice generato compila ed è idiomatico                                                | M6                       |
| Build / package          | `publint`, `attw`, `size-limit`, `madge`, `pnpm pack` + install                                     | Node                                                          | Export, tipi, tree shaking, budget, cicli                                                 | M1 (base), M3 (completo) |
| SSR                      | `@lit-labs/ssr` + Playwright                                                                        | Node + browser                                                | Render server, Declarative Shadow DOM, hydration                                          | M10                      |
| Manuale a11y             | NVDA + Firefox/Chrome (Windows), VoiceOver + Safari (macOS/iOS), sola tastiera, zoom, forced colors | Dispositivi reali                                             | Ciò che non è automatizzabile                                                             | M3                       |

## 2. Regole

- Niente jsdom/happy-dom per i componenti: Shadow DOM, `ElementInternals` e gestione del focus richiedono browser reali.
- Le baseline di regressione visiva si generano e aggiornano **solo** nel container Docker; l'aggiornamento richiede approvazione in review.
- Un test fallito non si disabilita per ottenere una pipeline verde. Eventuali `skip` richiedono un issue collegato e una motivazione nel codice e nel report di milestone.
- I test automatici di accessibilità non sono sufficienti a dichiarare conformità: ogni componente `stable` ha una checklist manuale compilata (`docs/accessibility/components/<nome>.md`) con data, tester, browser e screen reader.

## 3. Matrice browser

| Browser                                 | Copertura | Modalità                                              |
| --------------------------------------- | --------- | ----------------------------------------------------- |
| Chrome (ultime 2 versioni)              | Completa  | Automatica (Chromium)                                 |
| Edge (ultime 2 versioni)                | Completa  | Automatica (canale `msedge`) su runner Windows, smoke |
| Firefox (ultime 2 + ESR)                | Completa  | Automatica                                            |
| Safari (ultime 2 versioni, macOS e iOS) | Completa  | WebKit automatico + verifica manuale su Safari reale  |

Comportamenti di piattaforma da considerare nei test da tastiera:

- **Safari / WebKit su macOS**: per default `Tab` non sposta il focus su pulsanti e link (serve `Option+Tab`, o l'impostazione "Premi Tab per evidenziare ogni elemento"). WebKit di Playwright su macOS riproduce questo comportamento; su Linux no. I test da tastiera usano il tasto che userebbe un utente reale della piattaforma, non forzano il comportamento di Chrome. Verificato in M1 (`packages/testing/e2e/accessibility-pipeline.e2e.ts`).

Requisiti minimi di piattaforma: supporto a Custom Elements v1, Shadow DOM, `ElementInternals`, `:focus-visible`, container queries. Nessun polyfill per browser legacy.

## 4. Quality gates

| Gate                                 | PR                                    | Release                      |
| ------------------------------------ | ------------------------------------- | ---------------------------- |
| Lint + format                        | ✅ bloccante                          | ✅                           |
| Typecheck                            | ✅                                    | ✅                           |
| Unit + component (progetti affected) | ✅                                    | ✅ tutti                     |
| axe-core                             | ✅                                    | ✅                           |
| Contract check metadata              | ✅                                    | ✅                           |
| Build                                | ✅                                    | ✅                           |
| Package validation (publint, attw)   | ✅                                    | ✅                           |
| Bundle budget                        | ✅                                    | ✅                           |
| Visual regression                    | ✅ (affected)                         | ✅ tutti                     |
| Integrazione framework               | Su modifiche a componenti/adapter     | ✅                           |
| Checklist a11y manuale               | —                                     | ✅ per componenti modificati |
| Changeset presente                   | ✅ per modifiche a package pubblicati | —                            |
