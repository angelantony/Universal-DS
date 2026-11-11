# Changesets

Every pull request that changes the public contract or the behavior of a package under `packages/` must include a changeset:

```bash
pnpm changeset
```

Rules (see `docs/architecture/versioning-governance.md`):

- Runtime packages (`tokens`, `themes`, `core`, `icons`, `metadata`, `components`, and later the framework adapters) share a single version (`fixed` group).
- Tooling packages (`code-generator`, `cli`, later `theme-tools` and `builder-engine`) are versioned independently.
- Breaking changes must be declared as `major`, also during the `0.x` series, and described with a migration note.
- Publishing is never performed from a local machine.
