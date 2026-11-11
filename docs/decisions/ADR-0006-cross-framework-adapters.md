# ADR-0006 — Adapter generati per React, Angular e Vue

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Contesto

Gli stessi Web Components devono essere utilizzabili con una DX idiomatica in ogni framework, senza implementazioni grafiche separate.

## Decisione

| Framework  | Uso diretto                                                  | Adapter (generato da metadata)                                                                                                                                  |
| ---------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTML/JS    | `import '@uds/components/button'`                            | —                                                                                                                                                               |
| React 19   | Possibile (supporto nativo a proprietà ed eventi custom)     | `@uds/react`: `createComponent` di `@lit/react`, eventi `onUdsX`, `ref` tipizzato, tipizzazioni JSX per l'uso diretto                                           |
| Angular 22 | Possibile con `CUSTOM_ELEMENTS_SCHEMA` (senza type checking) | `@uds/angular`: componenti standalone sottili con `input()`/`output()` tipizzati che inoltrano al custom element; `ControlValueAccessor` per componenti di form |
| Vue 3      | `isCustomElement` nel compiler                               | `@uds/vue`: plugin, helper di configurazione Vite, tipizzazioni `GlobalComponents`, supporto `v-model` per componenti di form                                   |

Regole:

- Gli adapter non contengono markup né stili propri: solo binding, tipi, registrazione.
- Gli adapter sono generati da `tools/generators` e committati; la CI verifica che la rigenerazione non produca diff.
- Ogni adapter è verificato nella demo corrispondente installata da tarball (M4).

## Alternative scartate

- Wrapper scritti a mano: duplicazione e deriva.
- Nessun adapter: in Angular si perde il type checking, in React gli eventi custom non hanno nomi camelCase.

## Conseguenze

`@uds/angular` richiede ng-packagr e il formato APF; la sua versione minima di Angular è dichiarata in peer dependency e documentata.
