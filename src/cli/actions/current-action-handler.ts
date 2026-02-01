import consola from 'consola'
import { ConfigStorageManager } from '../../config/config-storage-manager.js'

export async function currentAction(): Promise<void> {
	const current = ConfigStorageManager.getCurrentProvider()
	const config = ConfigStorageManager.getProvider(current)

	consola.success(`Current provider: ${current}`)
	consola.log(`Base URL: ${config.ANTHROPIC_BASE_URL}`)
	consola.log(`Token: ${config.ANTHROPIC_AUTH_TOKEN ? '***' + config.ANTHROPIC_AUTH_TOKEN.slice(-4) : 'not set'}`)
	consola.log(`Opus: ${config.ANTHROPIC_DEFAULT_OPUS_MODEL}`)
	consola.log(`Sonnet: ${config.ANTHROPIC_DEFAULT_SONNET_MODEL}`)
	consola.log(`Haiku: ${config.ANTHROPIC_DEFAULT_HAIKU_MODEL}`)
}
