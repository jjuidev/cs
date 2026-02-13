# Brainstorm Report: `--reset` Flag Command

## Problem Statement
Cần command để reset provider config về default models một cách nhanh chóng, hữu ích khi:
- Test với models khác và muốn revert về default
- Config bị corrupt hoặc không mong muốn
- Quick reset mà không cần manual config

## Final Solution: `--reset` Flag Pattern

### Commands
```bash
cs --reset              # Reset current provider models → auto switch
cs claude --reset       # Reset claude models → auto switch to claude
```

### Behavior
| Aspect | Decision |
|--------|----------|
| Token | Giữ nguyên `ANTHROPIC_AUTH_TOKEN` |
| Base URL | Giữ nguyên `ANTHROPIC_BASE_URL` |
| Models | Reset về `DEFAULT_CONFIG[provider]` models |
| Confirm | Không cần confirm |
| Auto-switch | **CÓ** - Reset xong switch sang provider đó |
| Scope | **Chỉ models** (3 fields: OPUS, SONNET, HAIKU) |

### Fields to Reset
```typescript
// Only these 3 fields are reset:
ANTHROPIC_DEFAULT_OPUS_MODEL
ANTHROPIC_DEFAULT_SONNET_MODEL
ANTHROPIC_DEFAULT_HAIKU_MODEL

// These are PRESERVED:
ANTHROPIC_AUTH_TOKEN      // Keep token
ANTHROPIC_BASE_URL        // Keep base URL
```

### Edge Cases Handling
| Scenario | Behavior |
|----------|----------|
| No current provider (`cs --reset`) | Error: "No current provider. Run `cs <provider>` first." |
| Invalid provider | Error: "Invalid provider: xxx. Valid: ..." |
| Provider not yet configured | Use DEFAULT_CONFIG directly, save to settings |

### Output Example
```bash
$ cs jjuidev --reset
✓ Reset jjuidev models to default
  Opus:   gemini-claude-opus-4-5-thinking
  Sonnet: gemini-claude-sonnet-4-5-thinking
  Haiku:  gemini-claude-sonnet-4-5
✓ Switched to jjuidev
```

## Implementation Considerations

### Files to Modify
1. `src/cli/cs-cli.ts` - Add `--reset` option flag
2. `src/cli/actions/switch-action-handler.ts` - Add reset logic before switch
3. `src/config/config-storage-manager.ts` - Add `resetProviderModels()` method

### Implementation Steps
1. Add `--reset` boolean option to CLI
2. Create `resetProviderModels()` method in ConfigStorageManager
3. Modify switchAction to check reset flag and call reset before switch
4. Add success output with reset values

### Risk Assessment
| Risk | Mitigation |
|------|------------|
| User accidentally reset | Low risk - token preserved, models are safe to reset |
| Breaking existing behavior | Flag is additive, no breaking changes |

## Success Criteria
- [ ] `cs --reset` resets current provider models
- [ ] `cs <provider> --reset` resets specified provider models
- [ ] Auto-switch works after reset
- [ ] Token and base URL preserved
- [ ] Clear output showing what was reset

## Rejected Alternatives
1. **Subcommand pattern** (`cs <provider> default`) - Parsing complexity, potential name conflict
2. **Explicit reset subcommand** (`cs reset <provider>`) - More verbose, less intuitive with auto-switch
3. **Reset all fields including token** - Too destructive, bad UX

## Next Steps
If approved → Create detailed implementation plan via `/plan` command
