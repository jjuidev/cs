import consola from 'consola'
import { ConfigStorageManager } from '../../config/config-storage-manager.js'
import { ShellIntegrationManager } from '../../shell/shell-integration-manager.js'
import { updateClaudeSettings } from '../claude-settings-updater.js'
import { isValidProvider, VALID_PROVIDERS } from '../../config/default-config.js'

export async function switchAction(provider: string): Promise<void> {
	if (!isValidProvider(provider)) {
		consola.error(`Invalid provider: ${provider}`)
		consola.info(`Valid providers: ${VALID_PROVIDERS.join(', ')}`)
		process.exit(1)
	}

	const config = ConfigStorageManager.getProvider(provider)

	if (!config.ANTHROPIC_AUTH_TOKEN) {
		consola.warn(`Warning: No auth token set for provider "${provider}"`)
		consola.info(`Set token with: cs config -p ${provider} -t <your-token>`)
	}

	updateClaudeSettings(config)
	consola.success(`Updated ~/.claude/settings.json`)

	ShellIntegrationManager.updateEnvExports(config.ANTHROPIC_BASE_URL, config.ANTHROPIC_AUTH_TOKEN)
	consola.success(`Updated shell environment exports`)

	ConfigStorageManager.setCurrentProvider(provider)
	consola.success(`Switched to provider: ${provider}`)
	consola.info(`Base URL: ${config.ANTHROPIC_BASE_URL}`)

	try {
		ShellIntegrationManager.sourceShell()
	} catch {
		consola.warn(`Please restart your shell or run: source ~/.zshrc`)
	}
}
