# Dependency graph

## 1. Grafo dei package

Freccia `A --> B` = "A dipende da B". Linee tratteggiate = dipendenza solo di tipo o solo dati.

```mermaid
flowchart BT
  subgraph Runtime["Runtime (gruppo di versione fixed)"]
    tokens["@uds/tokens"]
    themes["@uds/themes"]
    core["@uds/core"]
    icons["@uds/icons"]
    metadata["@uds/metadata"]
    components["@uds/components"]
  end

  subgraph Adapters["Adapter (gruppo fixed)"]
    react["@uds/react"]
    angular["@uds/angular"]
    vue["@uds/vue"]
  end

  subgraph Tooling["Strumenti (versioni indipendenti)"]
    codegen["@uds/code-generator"]
    themetools["@uds/theme-tools"]
    builder["@uds/builder-engine"]
    cli["@uds/cli"]
  end

  subgraph Apps["Applicazioni (non pubblicate)"]
    portal["portal"]
    storybook["storybook"]
    demos["demos/*"]
  end

  themes --> tokens
  core --> tokens
  icons --> core
  components --> core
  components --> icons
  components -.type-only.-> metadata

  react --> components
  angular --> components
  vue --> components

  codegen --> metadata
  themetools --> themes
  builder --> metadata
  cli --> metadata
  cli --> codegen
  cli -.dati ./metadata.-> components

  portal --> components
  portal --> themes
  portal --> codegen
  portal --> themetools
  portal --> builder
  storybook --> components
  storybook --> themes
  demos --> react
  demos --> angular
  demos --> vue
  demos --> components
```

Dipendenze esterne principali:

| Package          | Dipendenze esterne                                 | Peer dependencies           |
| ---------------- | -------------------------------------------------- | --------------------------- |
| `tokens`         | — (Style Dictionary solo dev)                      | —                           |
| `themes`         | —                                                  | —                           |
| `core`           | `lit`                                              | —                           |
| `icons`          | `lit` (via core), `dompurify` (import dinamico)    | —                           |
| `metadata`       | `zod`                                              | —                           |
| `components`     | `lit`                                              | —                           |
| `react`          | `@lit/react`                                       | `react ^19`, `@types/react` |
| `angular`        | `tslib`                                            | `@angular/core ^22`         |
| `vue`            | —                                                  | `vue ^3.5`                  |
| `code-generator` | formattatore (Prettier standalone, valutato in M6) | —                           |
| `cli`            | parser argomenti (valutato in M9)                  | —                           |

`zod` non entra nel bundle runtime dei componenti: i `*.meta.ts` importano solo **tipi** da `@uds/metadata`; la validazione Zod avviene in test, build, portale e CLI.

## 2. Tag Nx

| Tag                                                       | Applicato a                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| `type:foundation`                                         | tokens, themes, metadata                                      |
| `type:runtime`                                            | core, icons, components                                       |
| `type:adapter`                                            | react, angular, vue                                           |
| `type:tooling`                                            | code-generator, theme-tools, builder-engine, cli, demo-verify |
| `type:generator`                                          | generators (legge `@uds/components/metadata`)                 |
| `type:app`                                                | portal, storybook, demos                                      |
| `type:test-util`                                          | testing                                                       |
| `framework:none`                                          | tutto tranne adapter e app                                    |
| `framework:react` / `framework:angular` / `framework:vue` | adapter e demo corrispondenti, portal (react)                 |

## 3. Regole (`@nx/enforce-module-boundaries`)

| Sorgente            | Può dipendere da                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `type:foundation`   | `type:foundation`                                                                            |
| `type:runtime`      | `type:runtime`, `type:foundation`                                                            |
| `type:adapter`      | `type:runtime`, `type:foundation`                                                            |
| `type:tooling`      | `type:tooling`, `type:foundation` (+ eccezione: `cli` legge i dati di `components/metadata`) |
| `type:generator`    | `type:tooling`, `type:foundation`, `type:runtime` (solo i metadata dei componenti)           |
| `type:app`          | tutto tranne `type:test-util` in codice di produzione                                        |
| `framework:none`    | solo `framework:none`                                                                        |
| `framework:react`   | `framework:react`, `framework:none`                                                          |
| `framework:angular` | `framework:angular`, `framework:none`                                                        |
| `framework:vue`     | `framework:vue`, `framework:none`                                                            |
| `type:test-util`    | `type:foundation`, `type:runtime`                                                            |

Altri controlli bloccanti in CI:

- Dipendenze circolari tra progetti (Nx) e tra moduli interni (`madge --circular` sui package runtime).
- Nessun import di `react`, `@angular/*`, `vue` nei progetti `framework:none`: `bannedExternalImports` di Nx rileva solo package già installati nel workspace (verificato in M1), quindi ogni progetto `framework:none` include anche la configurazione `frameworkAgnostic` (`no-restricted-imports`) esportata da `eslint.config.mjs`.
