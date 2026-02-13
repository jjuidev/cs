# Phase 3: Update cs-cli.ts with --reset Option

## Context Links
- CLI entry: `src/cli/cs-cli.ts`
- Switch handler: `src/cli/actions/switch-action-handler.ts`

## Overview
- **Priority**: P2
- **Status**: completed
- **Description**: Add --reset flag to CLI and wire to switch action

## Requirements

### Functional
- `--reset` boolean flag (no value needed)
- Works with both `cs <provider> --reset` and `cs --reset`
- Update help text with examples

## Related Code Files

| File | Action |
|------|--------|
| `src/cli/cs-cli.ts` | Add --reset option |

## Implementation Steps

1. Make provider argument optional
2. Add --reset option
3. Pass options to switchAction
4. Update help text

```typescript
// Modified section in src/cli/cs-cli.ts

// Replace the existing top-level command (lines 47-59) with:

program
	.argument('[provider]', `Provider to switch to: ${VALID_PROVIDERS.join(', ')}`)
	.description('Switch to a provider')
	.option('--reset', 'Reset provider models to default values')
	.addHelpText(
		'after',
		`
Examples:
  $ cs claude     # Switch to claude
  $ cs z          # Switch to z
  $ cs claudible  # Switch to claudible
  $ cs --reset    # Reset current provider models and switch
  $ cs claude --reset  # Reset claude models and switch
  `
	)
	.action(switchAction)
```

**Note**: Provider argument becomes optional `[provider]` (brackets) to allow `cs --reset` without provider.

## Todo List

- [x] Change `<provider>` to `[provider]` (optional)
- [x] Add `.option('--reset', 'Reset provider models to default values')`
- [x] Update help text with reset examples
- [x] Verify CLI parsing works correctly

## Success Criteria
- `cs --reset` parses correctly (no provider arg)
- `cs claude --reset` parses correctly (with provider arg)
- Help text shows reset examples
- Options passed to switchAction

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Breaking `cs` without args | switchAction handles empty provider gracefully |

## Next Steps
- Proceed to Phase 4: Testing
