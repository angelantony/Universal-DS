# Development setup

## Requirements

| Tool    | Version                          | Notes                                                |
| ------- | -------------------------------- | ---------------------------------------------------- |
| Node.js | 24 LTS (`.nvmrc`)                | `engines.node` is `^24.11.0`                         |
| pnpm    | 12.19.0 (`packageManager` field) | Provided by corepack, do not install it globally     |
| Git     | any recent version               | On macOS the Xcode license must be accepted          |
| Docker  | optional until Milestone 3       | Needed for deterministic visual regression baselines |

## First install

```bash
corepack enable                 # exposes the pinned pnpm version
pnpm install                    # uses pnpm-lock.yaml
pnpm exec playwright install chromium firefox webkit
pnpm check                      # all quality gates
```

If `corepack enable` cannot write to the Node.js installation directory, either run it with a user-writable `--install-directory` that is on your `PATH`, or prefix every command with `corepack` (for example `corepack pnpm install`).

## Toolchain

| Concern                | Tool                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Workspace              | pnpm workspaces + catalog                                                            |
| Orchestration, cache   | Nx 24 with inferred targets (`@nx/js`, `@nx/eslint`, `@nx/vitest`, `@nx/playwright`) |
| Type checking          | TypeScript 6.0 project references, kept in sync by `nx sync`                         |
| Lint                   | ESLint 10 flat config, typescript-eslint strict type-checked, Nx module boundaries   |
| Format                 | Prettier                                                                             |
| Unit and browser tests | Vitest 5 (Node and browser mode with Playwright: Chromium, Firefox, WebKit)          |
| End-to-end and a11y    | Playwright + axe-core                                                                |
| Releases               | Changesets                                                                           |

## How a package is organized

```text
packages/<name>/
├── package.json        # name, exports (with the "@uds/source" condition), Nx tags
├── tsconfig.json       # solution file: references lib (and spec when tests exist)
├── tsconfig.lib.json   # production sources → dist/
├── tsconfig.spec.json  # tests and tool configs (only when tests exist)
├── eslint.config.mjs   # extends the root configuration
├── vitest.config.ts    # only when tests exist
└── src/
```

The `@uds/source` export condition lets workspace tools resolve TypeScript sources directly; published consumers resolve `dist/`.

## Supply-chain policies

- pnpm blocks dependency install scripts unless listed in `allowBuilds` (`pnpm-workspace.yaml`). Currently only `nx` is allowed (native binary).
- pnpm enforces a minimum release age for new versions. `minimumReleaseAgeExclude` lists the exact versions that were pinned deliberately before the age threshold; remove the entries once they are older than the threshold.

## Troubleshooting

| Symptom                                              | Cause and fix                                                                                                  |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `ERR_PNPM_IGNORED_BUILDS`                            | A new dependency has an install script. Evaluate it, then `pnpm approve-builds <name>`.                        |
| `nx sync:check` fails in CI                          | Project references are out of date. Run `pnpm exec nx sync` and commit.                                        |
| WebKit keyboard test behaves differently from Chrome | Expected on macOS: Safari moves focus to buttons with Option+Tab. See `docs/architecture/testing-strategy.md`. |
