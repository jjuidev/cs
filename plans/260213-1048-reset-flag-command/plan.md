---
title: "Implement --reset Flag Command"
description: "Add --reset flag to reset provider models to defaults with auto-switch"
status: completed
priority: P2
effort: 1.5h
branch: main
tags: [cli, feature, config]
created: 2026-02-13
completed: 2026-02-13
---

# Implementation Plan: `--reset` Flag Command

## Overview

Add `--reset` flag to CS CLI for resetting provider models to default values while preserving token and base URL.

## Commands

```bash
cs --reset              # Reset current provider models → auto switch
cs claude --reset       # Reset claude models → auto switch
```

## Behavior

| Aspect | Decision |
|--------|----------|
| Token | Preserve `ANTHROPIC_AUTH_TOKEN` |
| Base URL | Preserve `ANTHROPIC_BASE_URL` |
| Models | Reset to `DEFAULT_CONFIG[provider]` values |
| Auto-switch | YES - after reset, switch to provider |
| Scope | Only 3 model fields (OPUS, SONNET, HAIKU) |
| Confirm | No confirmation required |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [Phase 1](./phase-01-add-reset-method.md) | Add `resetProviderModels()` to ConfigStorageManager | completed |
| [Phase 2](./phase-02-modify-switch-action.md) | Modify switch-action-handler for reset support | completed |
| [Phase 3](./phase-03-update-cli.md) | Update cs-cli.ts with --reset option | completed |
| [Phase 4](./phase-04-testing.md) | Testing & verification | skipped |

## Files to Modify

1. `src/config/config-storage-manager.ts` - Add reset method
2. `src/cli/actions/switch-action-handler.ts` - Accept reset option
3. `src/cli/cs-cli.ts` - Add --reset flag

## Dependencies

- None (standalone feature)

## Success Criteria

- [x] `cs --reset` resets current provider models
- [x] `cs <provider> --reset` resets specified provider models
- [x] Auto-switch works after reset
- [x] Token and base URL preserved
- [x] Clear output showing reset values
