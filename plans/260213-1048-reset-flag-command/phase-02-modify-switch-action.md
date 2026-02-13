# Phase 2: Modify switch-action-handler for Reset Support

## Context Links
- Switch handler: `src/cli/actions/switch-action-handler.ts`
- Config manager: `src/config/config-storage-manager.ts`

## Overview
- **Priority**: P2
- **Status**: completed
- **Description**: Modify switchAction to accept reset option and show reset output

## Requirements

### Functional
- Accept optional `reset` boolean parameter
- Call `resetProviderModels()` if reset=true
- Display reset values in output
- Handle edge case: no provider specified (for `cs --reset`)

### Edge Cases
| Scenario | Behavior |
|----------|----------|
| `cs --reset` (no provider) | Get current provider, error if none |
| Invalid provider | Error message with valid providers |

## Related Code Files

| File | Action |
|------|--------|
| `src/cli/actions/switch-action-handler.ts` | Modify signature and logic |

## Implementation Steps

1. Modify switchAction to accept options object with reset flag
2. Add reset logic before switch
3. Add helper for current provider reset (when no provider arg)
4. Update output messages

```typescript
// Modified src/cli/actions/switch-action-handler.ts

import consola from 'consola'
import { ConfigStorageManager } from '../../config/config-storage-manager.js'
import { ShellIntegrationManager } from '../../shell/shell-integration-manager.js'
import { updateClaudeSettings } from '../claude-settings-updater.js'
import { isValidProvider, VALID_PROVIDERS, type Providers } from '../../config/default-config.js'

export interface SwitchOptions {
	reset?: boolean
}

export async function switchAction(provider: string, options: SwitchOptions = {}): Promise<void> {
	let targetProvider: Providers

	// Handle reset with no provider argument (cs --reset)
	if (!provider && options.reset) {
		targetProvider = ConfigStorageManager.getCurrentProvider()
	} else if (!provider) {
		consola.error('Provider is required')
		consola.info(`Usage: cs <provider> or cs --reset`)
		process.exit(1)
	} else {
		if (!isValidProvider(provider)) {
			consola.error(`Invalid provider: ${provider}`)
			consola.info(`Valid providers: ${VALID_PROVIDERS.join(', ')}`)
			process.exit(1)
		}
		targetProvider = provider as Providers
	}

	// Reset models if flag is set
	if (options.reset) {
		const resetConfig = ConfigStorageManager.resetProviderModels(targetProvider)
		consola.success(`Reset ${targetProvider} models to default`)
		consola.info(`  Opus:   ${resetConfig.ANTHROPIC_DEFAULT_OPUS_MODEL}`)
		consola.info(`  Sonnet: ${resetConfig.ANTHROPIC_DEFAULT_SONNET_MODEL}`)
		consola.info(`  Haiku:  ${resetConfig.ANTHROPIC_DEFAULT_HAIKU_MODEL}`)
	}

	// Get config (will have reset values if reset was called)
	const config = ConfigStorageManager.getProvider(targetProvider)

	if (!config.ANTHROPIC_AUTH_TOKEN) {
		consola.warn(`Warning: No auth token set for provider "${targetProvider}"`)
		consola.info(`Set token with: cs config -p ${targetProvider} -t <your-token>`)
	}

	updateClaudeSettings(config)
	consola.success(`Updated ~/.claude/settings.json`)

	ShellIntegrationManager.updateEnvExports(config.ANTHROPIC_BASE_URL, config.ANTHROPIC_AUTH_TOKEN)
	consola.success(`Updated shell environment exports`)

	ConfigStorageManager.setCurrentProvider(targetProvider)
	consola.success(`Switched to provider: ${targetProvider}`)
	consola.info(`Base URL: ${config.ANTHROPIC_BASE_URL}`)
}
```

## Todo List

- [x] Add SwitchOptions interface
- [x] Import Providers type
- [x] Modify switchAction signature to accept options
- [x] Add reset logic with output
- [x] Handle no-provider edge case for `cs --reset`

## Success Criteria
- Reset flag triggers model reset before switch
- Clear output showing reset model values
- Edge cases handled with proper errors
- Existing switch behavior unchanged when reset=false

## Next Steps
- Proceed to Phase 3: Update CLI with --reset option
