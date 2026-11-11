# ADR-0005 — Design token DTCG + Style Dictionary, tre livelli

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Contesto

§7 richiede token completi, temi multipli, multi-brand, override a più livelli e cambio tema a runtime senza rebuild.

## Decisione

1. **Formato**: DTCG (specifica stabile 2025.10) — `$value`, `$type`, `$description`, `$extensions`, alias `{…}`.
2. **Trasformazione**: Style Dictionary 5 con output CSS custom properties (formato di consumo principale), JSON risolto (portale, theme tools), TS con i **nomi** delle variabili (non i valori) per l'autocompletamento.
3. **Livelli**: primitive → semantic → component. I componenti usano solo token di componente o semantici; i token primitivi sono vietati negli stili (regola lint).
4. **Temi**: file DTCG che ridefiniscono i token semantici; output `light.css`, `dark.css`, `high-contrast.css`, `brand-*.css` con selettori `[data-uds-theme]`/`[data-uds-brand]` (applicabili anche a sottoalberi).
5. **Cascade** con `@layer uds.tokens, uds.theme, uds.brand`; le applicazioni sovrascrivono fuori dai layer o in layer successivi.
6. **Versioning**: ogni CSS distribuito include `--uds-tokens-version`; il `ThemeManager` verifica la compatibilità con la versione dei componenti.
7. **Motion**: `prefers-reduced-motion: reduce` riduce le durate a 0 a livello di token.
8. **Controlli**: test di contrasto WCAG per tema; Stylelint con regole che vietano colori, dimensioni, ombre e durate letterali negli stili dei componenti.

## Conseguenze

Il Theme Builder (M7) lavora su JSON DTCG e produce gli stessi artefatti della build: nessun formato parallelo.
