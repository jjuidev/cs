---
title: "Remove cs update command"
description: "Remove toàn bộ logic liên quan đến cs update command và dependency semver"
status: completed
priority: P2
effort: 1h
branch: main
tags: [refactor, cleanup, breaking-change]
created: 2026-02-13
---

# Remove cs update command

## Overview

Remove `cs update` command vì:
- Feature không cần thiết - users có thể dùng `npm update -g @jjuidev/cs` trực tiếp
- Giảm complexity, maintenance burden
- Remove `semver` dependency chỉ dùng cho update feature

## Impact

**Breaking Change:** Users đang dùng `cs update` sẽ cần chuyển sang `npm update -g @jjuidev/cs`

## Files Summary

### Delete (5 items)
| File | LOC | Description |
|------|-----|-------------|
| `src/cli/actions/update-action-handler.ts` | 164 | Update action handler |
| `src/cli/services/package-updater.ts` | 150 | Package update execution |
| `src/cli/services/npm-version-fetcher.ts` | 87 | NPM registry fetcher |
| `plans/260201-cs-update-command/` | - | Plan directory |
| `plans/reports/code-reviewer-260201-1201-cs-update-command.md` | - | Report |

### Edit (3 items)
| File | Changes |
|------|---------|
| `src/cli/cs-cli.ts` | Remove import + command registration |
| `README.md` | Remove update section |
| `package.json` | Remove semver dependency |

## Phases

| Phase | Description | Status | Progress |
|-------|-------------|--------|----------|
| [01](./phase-01-delete-source-files.md) | Delete source files | completed | 100% |
| [02](./phase-02-update-cli-entry.md) | Update CLI entry point | completed | 100% |
| [03](./phase-03-delete-plans-reports.md) | Delete plans & reports | completed | 100% |
| [04](./phase-04-update-documentation.md) | Update documentation | completed | 100% |
| [05](./phase-05-update-dependencies.md) | Update dependencies | completed | 100% |
| [06](./phase-06-build-verify.md) | Build & verify | completed | 100% |

## Success Criteria

- [x] All source files deleted
- [x] cs-cli.ts compiles without errors
- [x] No orphaned imports
- [x] README updated
- [x] semver removed from package.json
- [x] Build passes
- [x] `cs --help` does not show update command
