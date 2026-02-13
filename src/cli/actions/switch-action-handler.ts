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

	// Reset models if flag is set (returns updated config, avoiding double loadSettings)
	let config: ReturnType<typeof ConfigStorageManager.getProvider>
	if (options.reset) {
		config = ConfigStorageManager.resetProviderModels(targetProvider)
		consola.success(`Reset ${targetProvider} models to default`)
		consola.info(`  Opus:   ${config.ANTHROPIC_DEFAULT_OPUS_MODEL}`)
		consola.info(`  Sonnet: ${config.ANTHROPIC_DEFAULT_SONNET_MODEL}`)
		consola.info(`  Haiku:  ${config.ANTHROPIC_DEFAULT_HAIKU_MODEL}`)
	} else {
		config = ConfigStorageManager.getProvider(targetProvider)
	}

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
