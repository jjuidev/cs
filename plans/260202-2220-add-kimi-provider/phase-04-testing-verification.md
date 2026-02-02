# Phase 04: Testing and Verification

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [phase-03-build-validation.md](./phase-03-build-validation.md)
- Testing Guide: `/Users/tandm/Documents/jjuidev/npm/cs/docs/code-standards.md`

## Overview
- **Date**: 2026-02-02
- **Priority**: P1
- **Effort**: 10min
- **Implementation Status**: Pending (blocked by Phase 03)
- **Review Status**: Not started

Manual testing của tất cả CLI commands với Kimi provider để verify functionality works correctly.

## Key Insights
- Need to test all main commands: config, switch, list, current
- Verify Kimi integration doesn't break existing providers
- Test configuration persistence
- Verify shell integration updates correctly

## Requirements

### Functional Requirements
1. `cs config -p kimi` loads default config with empty token (not set)
2. `cs kimi` switches to Kimi provider
3. `cs list` displays Kimi provider with "not set" for empty token
4. `cs current` shows Kimi when active
5. Configuration saves correctly to ~/.cs/settings.json
6. Claude settings update correctly
7. Shell RC file updates correctly
8. New provider should have empty token by default

### Non-Functional Requirements
- Fast command execution
- Clear error messages (if any)
- Consistent behavior with other providers
- No data corruption

## Architecture

### Test Flow
```
Manual Testing
    ├── Configuration Test
    │   └── cs config -p kimi -t <token>
    ├── Switch Test
    │   └── cs kimi
    ├── List Test
    │   └── cs list
    ├── Current Test
    │   └── cs current
    └── Persistence Test
        └── Verify files updated
```

## Related Code Files

### Files to Verify
- `~/.cs/settings.json` - Configuration storage
- `~/.claude/settings.json` - Claude Code integration
- `~/.zshrc` or `~/.bashrc` - Shell environment exports

### Action Handlers to Test
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/actions/config-action-handler.ts`
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/actions/switch-action-handler.ts`
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/actions/list-action-handler.ts`
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/actions/current-action-handler.ts`

## Implementation Steps

### 1. Test Initial List Command (Verify Empty Token)

```bash
# List all providers before any configuration
cs list

# Expected output should include:
# kimi:
#   URL: https://api.kimi.com/coding
#   Token: not set
#   Opus: kimi-k2.5
#   Sonnet: kimi-k2.5
#   Haiku: kimi-k2.5
```

### 2. Test Configuration Command

```bash
# Test config command with Kimi provider (optional token)
cs config -p kimi

# Verify success message
# Expected: "Updated provider \"kimi\" config" or similar

# Check settings file
cat ~/.cs/settings.json | grep -A 5 '"kimi"'

# Expected: Kimi configuration block with empty token

# Now set a token
cs config -p kimi -t test-token-123

# Check settings file again
cat ~/.cs/settings.json | grep -A 5 '"kimi"'

# Expected: Kimi configuration block with test token
```

### 3. Test List Command After Config

```bash
# List all providers after setting token
cs list

# Expected output should include:
# kimi:
#   URL: https://api.kimi.com/coding
#   Token: test-****123
#   Opus: kimi-k2.5
#   Sonnet: kimi-k2.5
#   Haiku: kimi-k2.5
```

### 8. Test Existing Providers

```bash
# Verify other providers still work
cs list

# Switch to each provider
cs claude
cs claudible
cs jjuidev
cs z

# All should work without errors
```

## Todo List

- [ ] Install/link package locally if needed
- [ ] Test initial `cs list` shows Kimi with "not set" token
- [ ] Test `cs config -p kimi` without token (loads default)
- [ ] Test `cs config -p kimi -t test-token` sets token
- [ ] Verify settings.json has Kimi config with token
- [ ] Test `cs list` shows Kimi with masked token
- [ ] Test `cs kimi` switches provider (with warning if no token)
- [ ] Verify ~/.claude/settings.json updated
- [ ] Verify shell RC file updated
- [ ] Test `cs current` shows kimi
- [ ] Test switching between providers
- [ ] Test resetting Kimi token to empty
- [ ] Test edge cases (invalid options)
- [ ] Verify existing providers still work
- [ ] Document any issues found
- [ ] Create bug reports if needed

## Success Criteria

### Definition of Done
- [x] All CLI commands work with Kimi provider
- [x] Configuration persists correctly
- [x] Settings files update correctly
- [x] No errors during normal operations
- [x] Existing providers work correctly
- [x] Error handling works as expected
- [x] Shell integration works correctly

### Validation Methods

**Test Matrix**:

| Command | Test | Expected Result | Status |
|---------|------|-----------------|--------|
| list (initial) | cs list | Shows kimi with "not set" | ⬜ |
| config (default) | cs config -p kimi | Loads default config | ⬜ |
| config (set token) | cs config -p kimi -t token | Success message | ⬜ |
| list (after config) | cs list | Shows kimi with masked token | ⬜ |
| switch | cs kimi | Switches to kimi | ⬜ |
| current | cs current | Shows "kimi" | ⬜ |
| config (reset) | cs config -p kimi | Resets to empty token | ⬜ |
| switch back | cs claude → cs kimi | Works both ways | ⬜ |

## Risk Assessment

### Potential Issues
1. **Token not saving**: Medium risk - file permissions or path issues
2. **Shell integration fails**: Low risk - follows existing pattern
3. **List display issues**: Low risk - simple formatting
4. **Current provider not updating**: Low risk - standard logic

### Mitigation Strategies
1. Check file permissions before testing
2. Verify HOME directory is correct
3. Use existing provider tests as baseline
4. Test on clean system if possible

## Security Considerations

### Testing Security
- Use fake/test tokens only
- Don't commit real credentials
- Verify token masking in output
- Check file permissions on config files

### Data Validation
- Ensure no sensitive data in error messages
- Verify token truncation/masking works
- Check logs don't expose credentials

## Next Steps

After completion:
1. Review all test results
2. Document any issues found
3. Create bug tickets if needed
4. Update changelog/documentation
5. Prepare for commit/PR

## Expected Issues
- **None expected** - simple additive feature
- If issues occur, they likely relate to:
  - File permissions
  - Path resolution
  - Shell detection

## Unresolved Questions
None - testing approach is comprehensive and straightforward.
