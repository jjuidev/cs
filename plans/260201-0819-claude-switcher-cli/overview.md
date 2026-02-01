# Claude Switcher CLI Tool - Implementation Plan

## Overview
Build `cs` CLI tool to switch between Claude API providers. Replace existing `node-devtools` with `cs` functionality.

**Status**: Planning
**Created**: 2026-02-01

---

## Phase 1: Config Module
[./phase-01-config-module.md](./phase-01-config-module.md)
Status: `pending`

---

## Phase 2: Shell Integration
[./phase-02-shell-integration.md](./phase-02-shell-integration.md)
Status: `pending`

---

## Phase 3: CLI Commands
[./phase-03-cli-commands.md](./phase-03-cli-commands.md)
Status: `pending`

---

## Phase 4: Package Refactor
[./phase-04-package-refactor.md](./phase-04-package-refactor.md)
Status: `pending`

---

## Key Architecture Decisions

### Config Structure
```typescript
// ~/.cs/settings.json
{
  "providers": {
    "claude": {
      "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
      "ANTHROPIC_AUTH_TOKEN": "",
      "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4.5",
      "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4.5",
      "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4.5"
    },
    // ... other providers
  },
  "current": "claude"
}
```

### CLI Commands
```
cs config -p <provider> [-t <token>] [-u <url>] [-o <opus>] [-s <sonnet>] [-h <haiku>]
cs <provider>
cs list
```

### Dependencies
- `commander` (already installed)
- `consola` (already installed)
- No additional deps needed

---

## Success Criteria
- [ ] `cs config -p claude -t xxx` saves to ~/.cs/settings.json
- [ ] `cs z` switches provider, updates ~/.claude/settings.json
- [ ] Shell exports added/updated in ~/.zshrc or ~/.bashrc
- [ ] Auto-sources shell after switch
- [ ] Validates provider names
- [ ] Error messages clear
