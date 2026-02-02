# Plan: Add MiniMax Provider

**Status:** Pending
**Created:** 2026-02-02
**Priority:** Simple

## Overview

Add `minimax` provider to cs CLI tool with the following configuration:
- Base URL: `https://api.minimax.io/anthropic`
- Default Models (all): `MiniMax-M2.1`

## Changes Required

### 1. Update `src/config/default-config.ts`
- Add `'minimax'` to `Providers` type
- Add minimax config to `DEFAULT_CONFIG`
- Add to `VALID_PROVIDERS` array

### 2. Update `README.md`
- Add minimax row to "Supported Providers" table

## Files to Modify

| File | Change |
|------|--------|
| `src/config/default-config.ts` | Add minimax provider |
| `README.md` | Update providers table |

## Implementation Steps

### Phase 1: Add Provider Configuration

**File:** `src/config/default-config.ts`

1. Update `Providers` type:
```typescript
export type Providers = 'claude' | 'claudible' | 'jjuidev' | 'kimi' | 'z' | 'minimax'
```

2. Add to `DEFAULT_CONFIG`:
```typescript
minimax: {
	ANTHROPIC_BASE_URL: 'https://api.minimax.io/anthropic',
	ANTHROPIC_AUTH_TOKEN: '',
	ANTHROPIC_DEFAULT_OPUS_MODEL: 'MiniMax-M2.1',
	ANTHROPIC_DEFAULT_SONNET_MODEL: 'MiniMax-M2.1',
	ANTHROPIC_DEFAULT_HAIKU_MODEL: 'MiniMax-M2.1'
}
```

3. Update `VALID_PROVIDERS`:
```typescript
export const VALID_PROVIDERS: Providers[] = ['claude', 'claudible', 'jjuidev', 'kimi', 'z', 'minimax']
```

### Phase 2: Update Documentation

**File:** `README.md`

Add row to Supported Providers table:
```markdown
| minimax  | https://api.minimax.io/anthropic | MiniMax-M2.1, MiniMax-M2.1, MiniMax-M2.1 |
```

Add to usage example:
```markdown
# Switch to MiniMax
cs minimax
```

## Success Criteria

- [ ] TypeScript compiles without errors
- [ ] `cs list` shows minimax in available providers
- [ ] `cs config -p minimax` works
- [ ] `cs minimax` switches to minimax provider
- [ ] README.md updated with minimax in providers table

## Notes

- No validation logic changes needed - system automatically handles new providers added to type
- Shell integration and settings manager work automatically with new provider
- User will need to configure auth token: `cs config -p minimax -t <token>`
