# Phase 1: Add `resetProviderModels()` to ConfigStorageManager

## Context Links
- Config manager: `src/config/config-storage-manager.ts`
- Default config: `src/config/default-config.ts`
- Brainstorm: `/Users/tandm/Documents/jjuidev/npm/cs/plans/reports/brainstorm-260213-1048-reset-flag-command.md`

## Overview
- **Priority**: P2
- **Status**: completed
- **Description**: Add method to reset only model fields to defaults while preserving token and base URL

## Requirements

### Functional
- Reset 3 model fields: `OPUS`, `SONNET`, `HAIKU`
- Preserve `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_BASE_URL`
- Return the reset config for display

### Non-functional
- Follow existing code patterns in ConfigStorageManager
- Type-safe with TypeScript

## Related Code Files

| File | Action |
|------|--------|
| `src/config/config-storage-manager.ts` | Add new method |

## Implementation Steps

1. Add `resetProviderModels()` static method to ConfigStorageManager class

```typescript
// Add to ConfigStorageManager class in src/config/config-storage-manager.ts

/**
 * Reset provider models to default values while preserving token and base URL
 * @param provider - Provider to reset
 * @returns The updated config with reset models
 */
static resetProviderModels(provider: Providers): ProviderConfig {
	const settings = this.loadSettings()
	const currentConfig = settings.providers[provider] || DEFAULT_CONFIG[provider]
	const defaultConfig = DEFAULT_CONFIG[provider]

	// Reset only model fields, preserve token and base URL
	const updatedConfig: ProviderConfig = {
		...currentConfig,
		ANTHROPIC_DEFAULT_OPUS_MODEL: defaultConfig.ANTHROPIC_DEFAULT_OPUS_MODEL,
		ANTHROPIC_DEFAULT_SONNET_MODEL: defaultConfig.ANTHROPIC_DEFAULT_SONNET_MODEL,
		ANTHROPIC_DEFAULT_HAIKU_MODEL: defaultConfig.ANTHROPIC_DEFAULT_HAIKU_MODEL
	}

	settings.providers[provider] = updatedConfig
	this.saveSettings(settings)

	return updatedConfig
}
```

## Todo List

- [x] Add `resetProviderModels()` method to ConfigStorageManager
- [x] Verify TypeScript compilation passes

## Success Criteria
- Method resets only 3 model fields
- Token and base URL preserved
- Returns updated config for display
- Follows existing class patterns

## Next Steps
- Proceed to Phase 2: Modify switch-action-handler
