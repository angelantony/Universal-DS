# ADR-0009 — Versionamento e release

- Stato: Accepted (approvato dal proprietario il 2026-11-11)
- Data: 2026-11-11

## Contesto

§3.4 chiede evoluzione indipendente; §22 chiede compatibilità chiara per i consumatori.

## Alternative

| Opzione                                    | Pro                                                                   | Contro                                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Tutti indipendenti                         | Massima autonomia                                                     | Matrice di compatibilità tokens × core × components × adapter difficile per i consumatori |
| Tutti fixed                                | Semplicissimo                                                         | Strumenti (CLI, code generator) rilasciati senza motivo                                   |
| **Runtime fixed + strumenti indipendenti** | Una versione = un design system coerente; strumenti con ciclo proprio | Bump di package runtime non modificati                                                    |

## Decisione

Changesets con gruppo `fixed` per i package runtime e adapter; strumenti indipendenti. Serie `0.x` fino a M10. Pubblicazione solo da CI con approvazione manuale su environment protetto, npm provenance, registry privato configurato via `.npmrc` per scope. Policy di deprecazione e rollback in `docs/architecture/versioning-governance.md`.

## Conseguenze

Il portale mostra una sola "versione del design system" più le versioni degli strumenti.
