# M4 — Cross-framework

Data: 2026-11-11. Stato: implementata in locale. Nessun commit, nessuna pubblicazione.

## Obiettivi

Rendere `uds-button` usabile da HTML, React 19, Angular 22 e Vue 3 con adapter generati dai metadata, e dimostrare che le demo funzionano installando i package da tarball.

## Funzionalità implementate

- `tools/generators` legge `componentCatalog` da `@uds/components/metadata` e scrive gli adapter. Il test confronta l'output con i file committati.
- `@uds/react`: `createComponent` di `@lit/react`, tipi JSX per `<uds-button>`. Gli eventi `uds-*` diventano `onUdsX` quando i metadata li dichiarano. Il Button non ne ha.
- `@uds/angular`: direttiva standalone sull'elemento, `input()` tipizzati inoltrati alle proprietà. Nessun template. `ControlValueAccessor` viene emesso solo se la categoria è `forms` e esiste la proprietà `value`.
- `@uds/vue`: componente che inoltra proprietà e slot, plugin, `udsVueTemplateOptions()` per `isCustomElement`, tipi `GlobalComponents`. `v-model` solo per i componenti di form.
- Demo in `apps/demos/{vanilla,react,angular,vue}`. Il target Nx installa i tarball in `dist/demo-install` e lì esegue il typecheck e Playwright. Le dipendenze `workspace:*` del monorepo servono a lint e IDE; la verifica non le usa.

## File creati

- `tools/generators`, `packages/react`, `packages/angular`, `packages/vue`, `tools/demo-verify`, `apps/demos/*`.

## File modificati

- `packages/components/src/metadata.ts`: export `componentCatalog`.
- `eslint.config.mjs` e `docs/architecture/dependency-graph.md`: tag `type:generator` e vincoli per framework.
- `pnpm-workspace.yaml`, `.changeset/config.json`, `.changeset/core-design-system.md`: React, Angular, Vue nel gruppo fixed.
- `tsconfig.json`: riferimenti aggiunti da `nx sync`.

## Decisioni tecniche

- L'adapter non contiene stili. Angular non ha markup: è una direttiva sull'elemento. Vue e React creano solo il custom element e inoltrano binding e slot.
- Il Button resta `beta`. Non è un controllo di valore, quindi non ha `ControlValueAccessor` né `v-model`. Il generatore copre quel ramo con un fixture `uds-field`.
- L'evento verificato nelle demo è il click nativo che esce dallo shadow tree. Submit e reset passano da `ElementInternals`.
- Gli id `submit` e `reset` coprirebbero i metodi omonimi del form. Le demo usano `submit-button` e `reset-button`.
- `@uds/angular` è compilato con ng-packagr. Gli export del package puntano a `dist/types` e `dist/fesm2022`. ng-packagr avvisa che riscriverebbe quegli export nel `package.json` di `dist`; il tarball usa il `package.json` di root.
- L'e2e dei framework gira su Chromium. Firefox e WebKit restano nella suite del componente.

## Test

| Suite                                                      | Esito                                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `@uds/generators` test                                     | 3/3                                                                                     |
| Lint, typecheck e build di react, vue, angular, generators | superati                                                                                |
| Typecheck demo da tarball                                  | superato. `variant="nope"` rifiutato da tsc, vue-tsc e ngc                              |
| Playwright vanilla, React, Vue, Angular                    | 1/1 ciascuno: proprietà `outline`/`danger`, slot «Save», click, submit, reset, disabled |
| Browser sulla demo vanilla installata da tarball           | click → conteggio 1, submit → «yes», reset → campo vuoto                                |

## Problemi aperti

- La CI non ha ancora eseguito questo codice: non c'è un commit.
- Checklist manuale NVDA/VoiceOver e baseline Firefox/WebKit del Button, ancora aperte da M3.
- `publint`, `attw`, `madge` non eseguiti.
- Nessun componente di form: CVA e `v-model` non hanno una demo.

## Debito tecnico

- `dangerouslyAllowAllBuilds` nel workspace temporaneo della demo, così gli script di esbuild e del watcher Angular possono girare fuori dal monorepo.
- L'e2e di integrazione è solo Chromium.

## Criteri di accettazione

1. Demo vanilla, React, Angular e Vue installate da tarball. ✅
2. e2e su proprietà, eventi, slot, submit e reset. ✅ Il Button non ha eventi `uds-*`; il click nativo è l'evento coperto.
3. Typecheck con errore atteso su un valore non ammesso. ✅ `variant="nope"`.

## Prossima milestone

M5 — Portal Foundation. Non è iniziata.
