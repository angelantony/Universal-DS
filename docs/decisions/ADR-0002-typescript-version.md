# ADR-0002 — TypeScript 6.0.x strict

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Contesto

L'ultima versione stabile è TypeScript 7.0.2 (compilatore nativo). Verifica delle peer dependency al 2026-11-11:

- `@angular/compiler-cli@22.2.5` → `typescript >=6.0 <6.1`
- `typescript-eslint@8.72.2` → `typescript >=4.8.4 <6.1.0`

## Alternative

| Opzione                                 | Pro                                                                               | Contro                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **TS 6.0.x ovunque**                    | Compatibile con Angular, typescript-eslint, tool basati sulle API del compilatore | Non sfrutta la velocità di TS 7                                                               |
| TS 7 nei package, TS 6 solo per Angular | Più veloce                                                                        | Due versioni del compilatore, tipi potenzialmente divergenti, typescript-eslint incompatibile |

## Decisione

TypeScript **6.0.3** (pin esatto) in tutto il workspace, `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `useDefineForClassFields: true`, `moduleResolution: "bundler"` per i package (`nodenext` per la CLI), `verbatimModuleSyntax`.
Decoratori standard di Lit (non `experimentalDecorators`) per restare compatibili con TS 7.

## Conseguenze

Rivalutazione a ogni major/minor di Angular e typescript-eslint. La migrazione a TS 7 è un'attività pianificata, non opportunistica.
