import consola from 'consola'
import { ConfigStorageManager } from '../../config/config-storage-manager.js'
import type { Providers } from '../../config/default-config.js'

export async function listAction(): Promise<void> {
	const settings = ConfigStorageManager.loadSettings()
	const current = settings.current

	consola.info('Available providers:')

	for (const [name, config] of Object.entries(settings.providers)) {
		const isCurrent = name === current
		const prefix = isCurrent ? '→' : ' '
		const tokenStatus = config.ANTHROPIC_AUTH_TOKEN ? '***' + config.ANTHROPIC_AUTH_TOKEN.slice(-4) : 'not set'

		consola.log(`${prefix} ${name}:`)
		consola.log(`    URL: ${config.ANTHROPIC_BASE_URL}`)
		consola.log(`    Token: ${tokenStatus}`)
		consola.log(`    Opus: ${config.ANTHROPIC_DEFAULT_OPUS_MODEL}`)
		consola.log(`    Sonnet: ${config.ANTHROPIC_DEFAULT_SONNET_MODEL}`)
		consola.log(`    Haiku: ${config.ANTHROPIC_DEFAULT_HAIKU_MODEL}`)
	}

	consola.success(`\nCurrent provider: ${current}`)
}
