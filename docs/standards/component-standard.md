# Standard del componente

> Stato: vigente da M2 (2026-11-11). Vale per ogni componente in `@uds/components`, a partire da `uds-button` (M3).
> Un componente è un custom element Lit. Gli adapter React, Angular e Vue non reimplementano il comportamento.

## 1. Collocazione

```
packages/components/src/<nome>/
  <nome>.ts            classe
  <nome>.meta.ts       contratto pubblico (tipi da @uds/metadata)
  <nome>.test.ts       test Node, se non serve il DOM
  <nome>.browser.test.ts
  define.ts            side effect: defineElement('uds-<nome>', …)
```

Il tag è `uds-<nome>`. Il package resta `framework:none`: nessun import di React, Angular o Vue.

## 2. Classe

- Estende `UdsElement` (`@uds/core`): shadow root aperto e `delegatesFocus`.
- `static override styles` è un `CSSResultGroup` e include `baseStyles` come primo foglio.
- Le proprietà pubbliche usano i decoratori standard di Lit (`accessor`, non `experimentalDecorators`).
- La registrazione passa da `defineElement`. È idempotente: se il tag esiste già con la stessa classe non fa nulla; se la classe è diversa, in sviluppo avvisa e mantiene la registrazione esistente. In assenza di `customElements` (SSR, Node) non fa nulla.
- L'entry `define` è l'unico side effect del package. L'import della classe non registra l'elemento.

## 3. Token e stili

Gli stili usano solo custom property semantiche o di componente (`--uds-color-text-default`, `--uds-button-background`, `--uds-icon-size`). Non usano le custom property primitive (`--uds-color-blue-700` e simili), né valori `hex`, `rgb`, `rgba`, `hsl`, `hsla`.

`pnpm lint:styles` estrae i blocchi `css\`…\``e applica queste regole. L'eccezione documentata è`CanvasText`in`baseStyles`, dentro `@media (forced-colors: active)`: è un colore di sistema, non un token.

`prefers-reduced-motion` non si duplica nel componente. Il foglio dei token azzera i token di durata.

I temi si applicano con `data-uds-theme` (`light`, `dark`, `high-contrast`) e, se serve, `data-uds-brand`. Il runtime è `applyTheme` / `themeInitScript` in `@uds/themes`. Un componente non sceglie il tema e non ricostruisce i token.

## 4. Form

Se l'elemento partecipa a un form del light DOM:

1. `static formAssociated = true` prima di costruire il controller.
2. `new FormAssociationController(this)` nel costruttore.
3. `formDisabledCallback` inoltra a `setFormDisabled`.
4. Submit e reset passano da `ElementInternals`, non da un `<form>` interno.

## 5. Icone

`<uds-icon>` è decorativo di default (`role="presentation"`, `aria-hidden="true"`). L'attributo `label` lo rende `role="img"` con quel nome accessibile.

Le icone built-in sono fidate e non passano dal sanitizer. Un SVG fornito dall'applicazione passa da `sanitizeSvg` (DOMPurify, poi allowlist). Il registro applica prima i resolver dell'applicazione, poi le icone built-in. `registerBuiltInIcons()` va chiamato prima del primo render; l'entry `@uds/icons/define` lo fa.

## 6. Accessibilità

Obiettivo WCAG 2.2 AA. Il focus visibile arriva da `baseStyles` (`:focus-visible`, anello `--uds-color-focus-ring`). Il contrasto delle coppie semantiche è verificato sui temi light, dark, high-contrast e sul brand di esempio (testo ≥ 4.5:1, focus e controlli ≥ 3:1).

Un componente `stable` nei metadata dichiara i requisiti di accessibilità. Senza requisiti lo schema rifiuta lo stato `stable`.

## 7. Metadata e contract check

`*.meta.ts` soddisfa `ComponentMetadata` (`schemaVersion: 1`). Nomi di tag `uds-*`, eventi `uds-*`, custom property `--uds-*`. Il default di un enum è uno dei valori ammessi. Una proprietà `object` non ha attributo.

Il contract check (`@uds/contract-check`) confronta il metadata con il sorgente della classe:

- proprietà: `@property(...) accessor nome`;
- attributi riflessi o con `attribute` esplicito;
- eventi `@fires`, slot `@slot`, parti `@csspart`, proprietà `@cssprop --uds-…`.

Uno scostamento è un errore. Il Custom Elements Manifest analyzer non è il gate: la versione pubblicata include TypeScript 5.4 e non è compatibile con questo repository (rischio R-05). Il controllo su decoratori e JSDoc è il controllo bloccante.

## 8. Test

- Vitest in Node per logica pura; Vitest browser (Chromium, Firefox, WebKit) per il DOM. Niente jsdom sui componenti.
- Il target `test` dipende dalla build del package: i test browser delle classi con decoratori importano il JavaScript compilato.
- Su macOS, WebKit non focalizza un pulsante con `Tab`. I test da tastiera usano `Alt+Tab` quando il browser è WebKit e la piattaforma è `darwin` (vedi la strategia di test).
- I payload SVG malevoli (script, handler, riferimenti esterni) hanno un test dedicato sull'icona. Lo stesso criterio vale per ogni componente che accetta markup.

## 9. Lingua dell'interfaccia

Storybook e le altre app mostrano l'italiano per primo e l'inglese dal controllo Lingua. Le stringhe visibili stanno in una mappa `it` / `en` (`apps/storybook/stories/copy.ts`). I titoli della sidebar sono in italiano. Il nome accessibile di una storia segue la lingua selezionata.

## 10. Fuori da questo standard

Il portale, il playground, il generatore di codice e il theme builder non sono il modo in cui si scrive un componente. Storybook (`apps/storybook`) è interno e serve a guardare il runtime; non è la documentazione pubblica.
