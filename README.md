# Universal DS

Enterprise design system: one implementation in Web Components (Lit), consumed by Angular, React, Vue and plain HTML.

**ONE DESIGN SYSTEM. ONE SOURCE OF TRUTH. MULTIPLE FRAMEWORKS.**

> Status: Milestone 1 (Foundation). No UI component is available yet. See [`MASTER_PLAN.md`](MASTER_PLAN.md) for the real progress.

## Quick start

Requirements: Node.js 24 (see `.nvmrc`) and corepack.

```bash
corepack enable
pnpm install
pnpm exec playwright install chromium firefox webkit
pnpm check
```

Full setup guide: [`docs/development/setup.md`](docs/development/setup.md).

## Repository layout

| Path              | Content                                                                    |
| ----------------- | -------------------------------------------------------------------------- |
| `packages/`       | Published libraries (`@uds/*`) and internal test utilities                 |
| `apps/`           | Portal, Storybook and framework demos (from later milestones)              |
| `tools/`          | Workspace generators, lint rules, scripts and shared build configuration   |
| `docs/`           | Architecture, decisions (ADR), standards, accessibility, milestone reports |
| `ARCHITECTURE.md` | Architecture overview                                                      |
| `MASTER_PLAN.md`  | Roadmap, acceptance criteria, decisions, risks                             |
| `CONTRIBUTING.md` | How to contribute                                                          |

## Packages

| Package               | Purpose                                                 |
| --------------------- | ------------------------------------------------------- |
| `@uds/tokens`         | Design tokens (DTCG sources → CSS custom properties)    |
| `@uds/themes`         | Light, dark, high contrast, brand themes; theme manager |
| `@uds/metadata`       | Component Metadata Registry schema and validation       |
| `@uds/core`           | Base element, registration, shared controllers          |
| `@uds/icons`          | Icon Registry and `<uds-icon>`                          |
| `@uds/components`     | Web Components and their public contract metadata       |
| `@uds/code-generator` | Code generation for HTML, React, Angular, Vue           |
| `@uds/cli`            | `init`, `add`, `list`, `doctor`                         |
| `@uds/testing`        | Internal test utilities (never published)               |

All packages are currently `private` skeletons: they are not published until Milestone 9 and explicit authorization.

## Common commands

| Command          | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `pnpm check`     | Every quality gate (format, lint, typecheck, test, build, e2e) |
| `pnpm lint`      | ESLint on every project                                        |
| `pnpm typecheck` | TypeScript project references build (declarations)             |
| `pnpm test`      | Vitest (Node and real browsers)                                |
| `pnpm e2e`       | Playwright end-to-end tests                                    |
| `pnpm build`     | Build every package                                            |
| `pnpm graph`     | Interactive Nx project graph                                   |
| `pnpm changeset` | Describe a change for the next release                         |

## License

Proprietary. All rights reserved.
