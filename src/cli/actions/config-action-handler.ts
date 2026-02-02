import consola from 'consola'
import type { ConfigOptions } from '../../types/cs-cli-options.js'
import { ConfigStorageManager } from '../../config/config-storage-manager.js'
import { isValidProvider, VALID_PROVIDERS } from '../../config/default-config.js'

export async function configAction(options: ConfigOptions): Promise<void> {
	if (!options.provider || !isValidProvider(options.provider)) {
		consola.error(`Invalid provider. Must be one of: ${VALID_PROVIDERS.join(', ')}`)
		process.exit(1)
	}

	const updates: Partial<Record<string, string>> = {}

	if (options.token !== undefined) updates.ANTHROPIC_AUTH_TOKEN = options.token
	if (options.url !== undefined) updates.ANTHROPIC_BASE_URL = options.url
	if (options.opus !== undefined) updates.ANTHROPIC_DEFAULT_OPUS_MODEL = options.opus
	if (options.sonnet !== undefined) updates.ANTHROPIC_DEFAULT_SONNET_MODEL = options.sonnet
	if (options.haiku !== undefined) updates.ANTHROPIC_DEFAULT_HAIKU_MODEL = options.haiku

	// Always ensure provider exists in settings, even if no updates
	ConfigStorageManager.updateProvider(options.provider, updates)

	if (Object.keys(updates).length > 0) {
		consola.success(`Updated provider "${options.provider}" config`)
	} else {
		consola.info(`Provider "${options.provider}" config loaded`)
	}

	const currentConfig = ConfigStorageManager.getProvider(options.provider)
	consola.success(`Base URL: ${currentConfig.ANTHROPIC_BASE_URL}`)
	consola.success(`Token: ${currentConfig.ANTHROPIC_AUTH_TOKEN ? '***' + currentConfig.ANTHROPIC_AUTH_TOKEN.slice(-4) : 'not set'}`)
}
