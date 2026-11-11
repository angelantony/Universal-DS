# ADR-0007 — Consolidamento delle app: portale unico + Storybook interno

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Contesto

La struttura di riferimento prevede `apps/portal`, `apps/documentation`, `apps/playground`; le sezioni del portale (§13) includono già documentazione e playground. Storybook è richiesto ma "non deve duplicare" il portale.

## Alternative

| Opzione                                   | Pro                                                             | Contro                                                            |
| ----------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| **A. Un solo portale + package headless** | Una navigazione, un tema, una PWA; logica testabile nei package | Il portale cresce: richiede code splitting per sezione            |
| B. Tre app separate                       | Deploy indipendenti                                             | Duplicazione di shell, routing, temi, PWA; esperienza frammentata |

## Decisione

Opzione **A**.

- `apps/portal`: unica applicazione per i consumatori. Sezioni caricate in lazy loading.
- `apps/storybook`: uso interno (sviluppo isolato, test di interazione, sorgente della regressione visiva). Non pubblicato come documentazione.
- Playground: preview in iframe `sandbox="allow-scripts"` senza `allow-same-origin`, `postMessage` validato; nella v1 Monaco visualizza codice generato in sola lettura e permette la modifica della configurazione JSON validata. Nessuna esecuzione di codice arbitrario.

## Conseguenze

Se in futuro serve un deploy separato del Playground, si estrae come route-bundle senza modificare i package.
