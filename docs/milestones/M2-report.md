# Report — Milestone 2: Core Design System

- Data: 2026-11-11
- Stato: **completata in locale, 9 criteri su 9**. Il codice non è ancora in un commit: la CI di M2 parte al prossimo push.

## Obiettivi

Produrre la sorgente unica del design system, senza componenti di prodotto: token DTCG, temi, base Lit, icone, metadata e il controllo di contratto. Nessun Button, portale, playground o pubblicazione.

## Funzionalità implementate

- `@uds/tokens`: sorgenti DTCG (colore, tipografia, spazio, forma, layout, motion, semantica e token di componente per il button). Style Dictionary 5.8 emette CSS a layer (`uds.tokens`), JSON risolto e i nomi TypeScript. Gli alias restano `var(--uds-…)`. `prefers-reduced-motion` azzera le durate. La versione del foglio è `--uds-tokens-version`.
- `@uds/themes`: light (`:root` e `data-uds-theme="light"`), dark, high-contrast e il brand `brand-a` (layer `uds.brand`). `applyTheme` cambia tema e brand senza rebuild, con persistenza opzionale. `themeInitScript()` evita il flash al primo paint. `tokensVersionMismatch` segnala un foglio di versione diversa; una versione vuota non è un disallineamento.
- Contrasto verificato sulle coppie testo/sfondo, focus e controlli di light, dark, high-contrast e del brand composto sopra light e sopra dark.
- `@uds/core`: `UdsElement`, `defineElement`, `FormAssociationController`, `baseStyles` (focus ring e `forced-colors`). L'import del package compilato in Node non tocca il DOM.
- `@uds/icons`: registry, sei icone built-in (rigenerate da SVGO e stabili rispetto a `scripts/optimize.mjs`), `<uds-icon>`, sanitizzazione dei SVG non fidati. Decorativo di default; `label` espone il nome.
- `@uds/metadata`: schema Zod, JSON Schema, validatore, registry. Il contract check su un fixture non UI (`uds-probe`) confronta decoratori e JSDoc. CEM non è stato adottato (vedi decisioni).
- Stylelint sulle regole grafiche, con test della regola custom. I fogli dei componenti sono estratti dai template `css` perché il parser di `postcss-lit` non accetta `accessor`.
- Storybook interno (`apps/storybook`) avviato su `http://127.0.0.1:6006`. Le storie Integrate e Decorativa (sidebar in italiano) renderizzano `<uds-icon>` con i token (`--uds-icon-size: 1.25rem`, testo `#0f172a`). Il controllo Lingua parte da italiano e passa all'inglese.

## File creati

| Area                   | Contenuto                                                                         |
| ---------------------- | --------------------------------------------------------------------------------- |
| `packages/tokens`      | Sorgenti DTCG, `scripts/build.mjs`, formati CSS/JSON, test e snapshot             |
| `packages/themes`      | Temi, `ThemeManager`, contrasto, build CSS                                        |
| `packages/core`        | Elemento base, registrazione, form association, stili, test browser e import Node |
| `packages/icons`       | Registry, sanitizer, `uds-icon`, SVG, build SVGO, test browser                    |
| `packages/metadata`    | Schema Zod, registry, test                                                        |
| `tools/build`          | Formati Style Dictionary e helper DTCG                                            |
| `tools/lint`           | Plugin Stylelint, estrazione CSS, test                                            |
| `tools/contract-check` | Estrattore, confronto, fixture `uds-probe`                                        |
| `apps/storybook`       | Storybook 10.6 per i Web Components, storia dell'icona                            |
| Documentazione         | `docs/standards/component-standard.md`, questo report                             |

## File modificati

- `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `nx.json`, `eslint.config.mjs`, `stylelint.config.mjs`
- `.github/workflows/ci.yml`: passo Stylelint; build di Storybook
- Package scheletro di M1 che ora hanno implementazione (tokens, themes, core, icons, metadata)

`@uds/components`, `@uds/code-generator` e `@uds/cli` restano scheletri.

## Decisioni tecniche

1. **CEM non adottato.** `@custom-elements-manifest/analyzer` 0.11.0 include TypeScript circa 5.4. Il gate di M2 è l'estrattore su `@property accessor` e sui tag `@fires`, `@slot`, `@csspart`, `@cssprop`. R-05 resta aperto per una rivalutazione dell'analyzer.
2. **I primitivi inclusi nel dizionario non finiscono nel CSS del tema.** I formati emettono solo i token `isSource`. Un filtro di piattaforma insieme a `outputReferences` fa fallire Style Dictionary.
3. **Il JSON risolto legge `token.value ?? token.$value`.** Con `usesDtcg`, `token.value` può essere assente.
4. **Focus del brand su teal 700 (`#0f766e`).** teal 800 non raggiunge 3:1 sulle superfici scure. Il fondo dell'azione primaria resta teal 800 con testo bianco.
5. **I comandi Nx `build` di tokens e themes usano `cwd: {projectRoot}`.** Senza, Nx esegue `node scripts/build.mjs` dalla radice del repository.
6. **I test browser delle classi con decoratori importano `dist/`.** Vite non traduce i decoratori standard; `tsc` sì. Il target `test` dipende da `build`.
7. **`@uds/core` non dipende da `@uds/tokens`.** Consuma le custom property. Il foglio CSS si importa dal consumatore (Storybook, e in seguito il portale).

## Test eseguiti

Comando unico, cache disattivata, il 2026-11-11:

`pnpm exec nx run-many -t lint typecheck test build e2e`

Esito: **verde su 12 progetti**. In più: `pnpm lint:styles` verde; `nx run @uds/storybook:build-storybook` verde; import di `@uds/core` compilato in Node (`defineElement` è una funzione e il processo non usa il DOM).

| Suite                                                                   | Casi       | Esito |
| ----------------------------------------------------------------------- | ---------- | ----- |
| Token: validazione DTCG, alias, snapshot CSS, reduced motion            | 2          | ✅    |
| Temi: parità dei path colore, contrasto, persistenza                    | 3          | ✅    |
| Metadata: schema, registry, JSON Schema                                 | 2          | ✅    |
| Contract check sul fixture                                              | 1          | ✅    |
| Stylelint: rifiuto di primitivi e hex, ammissione dei token semantici   | 2          | ✅    |
| Core, Node: import senza `customElements`                               | 1          | ✅    |
| Core, browser ×3: shadow, registrazione, form                           | 9          | ✅    |
| Icone, Node: SVG built-in senza contenuto attivo                        | 1          | ✅    |
| Icone, browser ×3: sanitizer e nome accessibile                         | 6          | ✅    |
| Testing (M1, rieseguito): viewport, piattaforma ×3, Playwright + axe ×3 | 2 + 12 + 9 | ✅    |

Nessun test disabilitato. Lo snapshot CSS è `packages/tokens/src/__snapshots__/tokens.test.ts.snap`, generato dall'esecuzione reale.

Verifica manuale di Storybook: storia Integrate con sei icone (`role="img"` e label nella lingua selezionata, italiano di default); storia Decorativa con `aria-hidden="true"`, `role="presentation"` e larghezza 20px da `--uds-icon-size: 1.25rem`.

## Problemi aperti

1. **CI di M2 non eseguita.** Il workflow include Stylelint e la build di Storybook, ma il risultato si conosce solo dopo il commit e il push. M1 risulta già verde sul primo push.
2. **CEM (R-05)** non integrato, per la ragione in decisioni.
3. **Vulnerabilità moderata `minimatch`** transitiva di Nx, già nota da M1, invariata.

## Debito tecnico

- L'estrattore del contratto è una lettura mirata del sorgente, non un parser TypeScript. Copre la forma standard del componente (`@property(...) accessor nome` e i tag JSDoc). Una forma diversa va allineata all'estrattore, non aggirata.
- `postcss-lit` non analizza `accessor`. Lo stylelint di progetto passa da `tools/lint/lint-styles.mjs`.
- I package sono ancora `0.0.0` e `private`. Nessuna pubblicazione.

## Criteri di accettazione

1. Token DTCG, build CSS/JSON/TS, snapshot, validazione DTCG. ✅
2. Temi light, dark, high-contrast, brand; cambio a runtime e persistenza opzionale. ✅
3. Contrasto ≥ 4.5:1 sul testo e ≥ 3:1 su focus e controlli, per ogni tema. ✅
4. `UdsElement`, `defineElement`, form association, stili base, import Node. ✅
5. Registry icone, `<uds-icon>`, sanitizzazione con payload malevoli. ✅
6. Metadata Zod, JSON Schema, registry, contract check sul fixture. CEM sostituito dal fallback documentato (R-05). ✅
7. Lint contro valori grafici hard-coded, con test. ✅
8. Storybook interno avviato e una storia esercitata nel browser. ✅
9. `docs/standards/component-standard.md`. ✅

## Prossima milestone

M3 — Button, solo dopo autorizzazione. Non è iniziata.
