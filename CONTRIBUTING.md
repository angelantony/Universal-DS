# Contributing to Universal DS

Read [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`MASTER_PLAN.md`](MASTER_PLAN.md) before starting. Binding decisions are the accepted ADRs in [`docs/decisions/`](docs/decisions/).

## Workflow

1. Create a branch from `main`.
2. Keep changes small and focused on one task.
3. Run `pnpm check` locally. Every gate must be green.
4. Add a changeset (`pnpm changeset`) when a package under `packages/` changes its behavior or public contract.
5. Open a pull request. CI runs the same gates.

## Rules

- **TypeScript strict.** No `any`, no `@ts-ignore`. `@ts-expect-error` only with an explanation.
- **Dependency boundaries.** Allowed dependencies are defined by Nx tags (`docs/architecture/dependency-graph.md`) and enforced by ESLint. Framework-agnostic packages must never import React, Angular or Vue.
- **No new dependencies without a reason.** Shared tool versions live in the pnpm `catalog` of `pnpm-workspace.yaml`; packages reference them with `catalog:`.
- **Install scripts are blocked by default** (pnpm `allowBuilds`). Allowing a new one requires a justification in the pull request.
- **Tests are not disabled to get a green run.** A skipped test needs a linked issue and a reason in the code and in the milestone report.
- **Accessibility is a requirement, not a polish phase.** Automated axe checks are necessary but not sufficient; see `docs/architecture/testing-strategy.md`.
- **No real publishing** from local machines. Releases happen only through the protected CI workflow.

## Architectural changes

Substantial changes (new package, new dependency category, change of a public contract convention, change of an accepted ADR) require a new ADR in `docs/decisions/` and the approval of the project owner before implementation.

## Commit messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) style, for example `feat(tokens): add motion tokens` or `fix(core): keep defineElement idempotent`.
