---
title: "cs update CLI Command"
description: "Add self-update command with 3 modes: list/select, auto-latest, specific version"
status: pending
priority: P1
effort: 4h
branch: main
tags: [cli, update, npm, self-update]
created: 2026-02-01
---

# cs update Command Implementation Plan

## Overview

Add `cs update` command enabling users to update the CLI to newer versions with three modes:
1. **Interactive**: `cs update ls|list` - show 10 newest versions, interactive selection
2. **Auto-latest**: `cs update` - auto update to latest version
3. **Specific**: `cs update <version>` - update to specified version

## Phases

| Phase | File | Description | Effort | Status |
|-------|------|-------------|--------|--------|
| 1 | [phase-01-setup-dependencies.md](./phase-01-setup-dependencies.md) | Install @clack/prompts, semver | 15m | pending |
| 2 | [phase-02-implement-version-fetcher.md](./phase-02-implement-version-fetcher.md) | npm registry API integration | 45m | pending |
| 3 | [phase-03-implement-update-action-handler.md](./phase-03-implement-update-action-handler.md) | Main update logic (3 modes) | 1.5h | pending |
| 4 | [phase-04-implement-rollback-verification.md](./phase-04-implement-rollback-verification.md) | Safety: rollback + verification | 45m | pending |
| 5 | [phase-05-integrate-cli-command.md](./phase-05-integrate-cli-command.md) | Add to cs-cli.ts | 15m | pending |
| 6 | [phase-06-testing-documentation.md](./phase-06-testing-documentation.md) | Test + update docs | 30m | pending |

## Key Dependencies

- **@clack/prompts**: Interactive CLI selection (recommended by research)
- **semver**: Version comparison and validation
- Node.js built-in `fetch` for npm registry API
- Node.js `child_process.execSync` for npm install

## Architecture Decision

```
src/cli/
  actions/
    update-action-handler.ts      # Main update orchestration
  services/
    npm-version-fetcher.ts        # Fetch versions from registry
    package-updater.ts            # Execute npm install + verification
```

## Related Research

- [npm Registry API Research](./research/researcher-npm-registry-api.md)
- [CLI Update Patterns Research](./research/researcher-cli-update-patterns.md)

## Success Criteria

- [ ] `cs update` updates to latest version
- [ ] `cs update list` shows 10 versions with interactive select
- [ ] `cs update 0.0.1` updates to specific version
- [ ] Rollback works on failure
- [ ] Installation verified post-update
