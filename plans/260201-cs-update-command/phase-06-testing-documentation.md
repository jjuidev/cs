# Phase 06: Testing and Documentation

## Context Links

- [Plan Overview](./plan.md)
- [Codebase Summary](../docs/codebase-summary.md)
- [Code Standards](../docs/code-standards.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-01 |
| Priority | P2 |
| Status | pending |
| Effort | 30m |

Test update command end-to-end and update documentation.

## Requirements

### Functional
- All three update modes work correctly
- Error cases handled properly
- Rollback works on failure

### Non-Functional
- Documentation updated
- README reflects new command

## Related Code Files

**Test:**
- All files created in Phase 01-05

**Update:**
- `/Users/tandm/Documents/jjuidev/npm/cs/README.md` (if exists)
- `/Users/tandm/Documents/jjuidev/npm/cs/docs/codebase-summary.md`

## Implementation Steps

### 1. Build and Compile Check

```bash
npm run build
```

Verify no TypeScript errors.

### 2. Manual Testing

**Test Mode 1: Auto-latest**
```bash
# Link local package for testing
npm link

# Test auto-latest (will show current vs latest)
cs update
```

**Test Mode 2: Interactive list**
```bash
cs update list
# or
cs update ls
```

Verify:
- Shows 10 versions
- Current version marked
- Latest version marked
- Selection works
- Cancel (Ctrl+C) exits cleanly

**Test Mode 3: Specific version**
```bash
# Valid version
cs update 0.0.1

# Invalid version format
cs update invalid

# Non-existent version
cs update 99.99.99
```

### 3. Error Case Testing

**Network failure simulation:**
- Disconnect network and run `cs update`
- Verify clear error message

**Permission issues:**
- If possible, test without global npm permissions
- Verify helpful error message

### 4. Update Documentation

**README.md changes:**

Add to commands section:
```markdown
### Update

Update cs CLI to a newer version.

```bash
# Update to latest version
cs update

# Interactive version selection
cs update list
cs update ls

# Update to specific version
cs update 0.0.1
```
```

**docs/codebase-summary.md changes:**

Add to Directory Structure:
```markdown
├── cli/
│   ├── actions/
│   │   ├── update-action-handler.ts  # Handle `cs update` command
│   ├── services/
│   │   ├── npm-version-fetcher.ts    # Fetch versions from npm registry
│   │   └── package-updater.ts        # Execute updates with rollback
```

Add to Key Components section:
```markdown
#### Update Action Handler (`update-action-handler.ts`)
- Supports three update modes: auto-latest, interactive list, specific version
- Uses @clack/prompts for interactive selection
- Coordinates with npm-version-fetcher and package-updater services
```

## Todo List

- [ ] Run build, verify no errors
- [ ] Test `cs update` (auto-latest mode)
- [ ] Test `cs update list` (interactive mode)
- [ ] Test `cs update <version>` (specific mode)
- [ ] Test error cases (invalid version, network failure)
- [ ] Test cancellation (Ctrl+C)
- [ ] Update README.md with update command
- [ ] Update codebase-summary.md with new files

## Success Criteria

- All tests pass
- No TypeScript errors
- Documentation updated
- All three modes work as expected
- Error handling works correctly

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Test environment issues | Medium | Use npm link for local testing |
| Documentation outdated | Low | Update immediately after testing |

## Security Considerations

- Document that update requires npm global permissions
- Note that only official npm registry is used

## Final Checklist

- [ ] All phases completed
- [ ] Build passes
- [ ] All manual tests pass
- [ ] Documentation updated
- [ ] Ready for code review

## Unresolved Questions from Research

1. **Changelog display**: Not implementing for MVP - consider for future
2. **Version caching**: Not implementing - network calls are fast enough
3. **Auto-update check on every command**: Not implementing - too intrusive
4. **Beta/next tags**: Not implementing for MVP - only stable versions
