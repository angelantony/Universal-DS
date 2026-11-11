# Checklist di accessibilità — Button

- Componente: `uds-button`
- Stato del componente: beta
- Data: 2026-11-11
- Ambiente automatico: Chromium, Firefox e WebKit (Playwright 1.65), axe-core 4.14, tag WCAG 2.2 AA

La checklist manuale non è compilata. NVDA, VoiceOver e Safari reale non sono stati usati in questa sessione. Il componente resta `beta` finché quelle righe non hanno un esito.

## Automatico

| Requisito                                                                                        | WCAG          | Esito                                                                      |
| ------------------------------------------------------------------------------------------------ | ------------- | -------------------------------------------------------------------------- |
| Nome accessibile dallo slot o da `ariaLabel`                                                     | 4.1.2         | Superato (Vitest browser e axe)                                            |
| Icona senza nome: warning in sviluppo e violazione axe se manca `ariaLabel`                      | 4.1.2         | Superato                                                                   |
| Target minimo 24×24 CSS px, anche con custom property da 1px                                     | 2.5.8         | Superato                                                                   |
| Contrasto dei token usati da variant e tone                                                      | 1.4.3, 1.4.11 | Superato sui temi light, dark, high-contrast e sul brand                   |
| Enter e Space sul bottone nativo; `disabled` fuori dal tab order                                 | 2.1.1         | Superato. Su WebKit macOS il test usa Alt+Tab                              |
| `loading`: `aria-busy`, focus conservato, attivazione bloccata, `loadingLabel` nella live region | 4.1.3         | Superato                                                                   |
| Matrice variant × tone × disabled × loading × icon-only, temi light, dark, high-contrast         | 2.2 AA        | axe senza violazioni                                                       |
| Reflow alle 6 viewport e con zoom 200% e 400%                                                    | 1.4.10        | Nessun overflow orizzontale                                                |
| Forced colors                                                                                    | 1.4.11        | Stili `ButtonFace` / `ButtonText` presenti. Verifica visiva manuale aperta |

## Manuale

| Verifica                                                                            | Strumento                         | Esito                                                     |
| ----------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------- |
| Nome, ruolo e stato letti correttamente                                             | NVDA + Firefox o Chrome (Windows) | Non eseguita                                              |
| Nome, ruolo e stato letti correttamente                                             | VoiceOver + Safari (macOS)        | Non eseguita                                              |
| Nome, ruolo e stato letti correttamente                                             | VoiceOver (iOS)                   | Non eseguita                                              |
| Sola tastiera, incluso il bottone disabilitato e quello in loading                  | Tastiera, senza mouse             | Non eseguita fuori dai test automatici                    |
| Zoom 200% e 400% percepito da una persona                                           | Browser reale                     | Non eseguita                                              |
| Forced colors percepiti                                                             | Windows contrast themes           | Non eseguita                                              |
| `variant="custom"` con contrasto insufficiente è responsabilità di chi personalizza | Revisione della documentazione    | Documentato in `packages/components/src/button/README.md` |

`disabled` non è focalizzabile. Non esiste una modalità `aria-disabled` focalizzabile: è una scelta di M3, annotata anche tra le limitazioni dei metadata.
