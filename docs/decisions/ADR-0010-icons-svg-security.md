# ADR-0010 — Icon Registry e sicurezza SVG

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Decisione

1. `IconRegistry` con resolver ordinati: icone registrate dall'applicazione → set proprietario → resolver esterni opzionali (adapter per librerie terze). Nessun provider obbligatorio.
2. Caricamento per singola icona (import dinamico per nome), con cache in memoria.
3. Set proprietario: SVGO in build con allowlist di elementi (`svg`, `g`, `path`, `circle`, `rect`, `line`, `polyline`, `polygon`, `ellipse`, `defs`, `clipPath`, `title`) e attributi; `fill`/`stroke` normalizzati a `currentColor`.
4. SVG forniti a runtime come stringa: sanitizzati con DOMPurify (profilo SVG, `foreignObject`, `script`, `on*`, `href`/`xlink:href` esterni vietati), caricato con import dinamico solo da questo percorso.
5. Icone registrate come template Lit già sicuri non passano dal sanitizzatore.
6. Accessibilità: decorativa per default (`aria-hidden="true"`); con `label` → `role="img"` e nome accessibile. Il Button icon-only richiede `aria-label` (vincolo nei metadata, verificato in test e warning in sviluppo).
7. Dimensione via `--uds-icon-size` (token), colore via `currentColor`.

## Conseguenze

Il sanitizzatore ha una suite di test con payload XSS noti (M2).
