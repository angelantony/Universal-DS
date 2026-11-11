# ADR-0011 — API di personalizzazione del Button

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Problema

§12.4 elenca proprietà di stile (`width`, `height`, `padding`, `borderRadius`, `background`, `color`, `fontSize`, `fontWeight`, `border`, `shadow`) accanto all'indicazione di evitare configurazioni semanticamente scorrette e personalizzazioni che compromettano l'accessibilità. §12.1 mescola varianti di enfasi e di semantica.

## Alternative per gli stili

| Opzione                                                                     | Esempio                                                            | Pro                                                                                    | Contro                                                                                                                                                          |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Proprietà/attributi per ogni valore CSS                                  | `<uds-button background="#f00" padding="4px">`                     | Immediato nel playground                                                               | Seconda API di stile parallela ai token; bypassa i temi; nessuna garanzia di contrasto; attributi non tipizzabili in modo utile; superficie di contratto enorme |
| **B. CSS custom properties pubbliche + `variant="custom"`/`size="custom"`** | `<uds-button variant="custom" style="--uds-button-background: …">` | Standard, compatibile con temi e cascade, tipizzate nei metadata, nessuna duplicazione | Meno "visibile" come API; da spiegare bene nella documentazione                                                                                                 |
| C. Ibrido: proprietà che scrivono custom properties                         | `background` → `--uds-button-background`                           | DX da playground                                                                       | Due modi di fare la stessa cosa; conflitti di precedenza da documentare                                                                                         |

## Alternative per varianti

| Opzione                            | Esempio                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Elenco unico (specifica letterale) | `variant="danger"` — non permette "outline danger"                                                                  |
| **Due assi**                       | `variant="primary\|secondary\|tertiary\|outline\|ghost\|text\|custom"` + `tone="neutral\|danger\|success\|warning"` |

## Raccomandazione

- Stili: **Opzione B**. Il playground genera comunque controlli per ogni custom property (dai metadata), quindi la DX resta visuale.
- Proprietà del componente: `variant`, `tone`, `size` (`xs|sm|md|lg|xl|custom`), `type` (`button|submit|reset`, default `button`), `disabled`, `loading`, `fullWidth`, `iconStart`, `iconEnd`, `iconOnly`, `ariaLabel` (resa come `label` accessibile).
- Custom properties pubbliche: larghezza/altezza minime, padding, radius, background, colore, font size/weight, bordo, ombra, dimensione e spaziatura delle icone, per ogni stato rilevante.
- `variant="custom"`: le coppie colore/sfondo diventano responsabilità del consumatore; documentato, con validazione del contrasto disponibile nel Theme Builder.
- Area interattiva minima di 24×24 CSS px (WCAG 2.2 SC 2.5.8) garantita anche con override, salvo dichiarazione esplicita documentata.
- Loading: `aria-busy="true"`, attivazione bloccata, focus mantenuto, larghezza stabile, annuncio tramite live region opzionale.
- Disabled: default `disabled` nativo (non focusable). L'eventuale modalità `aria-disabled` focusable (utile per mostrare un tooltip esplicativo) sarà valutata in M3 con test su screen reader.

## Decisione

Approvate dal proprietario il 2026-11-11: stili tramite **Opzione B** (CSS custom properties pubbliche + `variant="custom"`/`size="custom"`) e varianti su **due assi** (`variant` + `tone`). I dettagli dell'elenco proprietà vengono finalizzati nei metadata in M3.
