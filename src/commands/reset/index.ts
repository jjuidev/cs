import { defineCommand } from 'citty'

import { mergeClaudeSettings, readClaudeSettings, writeClaudeSettings } from '@/config/claude-settings'
import { getProfile, resetProfiles } from '@/config/cs-config'
import {
	generateOpenCodeSection,
	mergeOpenCodeConfig,
	readOpenCodeConfig,
	writeOpenCodeConfig
} from '@/config/opencode-config'
import { logger } from '@/utils/logger'

import { name as pkgName } from '@/../package.json'

export const resetCommand = defineCommand({
	meta: {
		name: 'reset',
		description: 'Reset to default profile'
	},
	run: async () => {
		const removed = resetProfiles()

		if (removed.length > 0) {
			logger.log(`Removed profiles: ${removed.join(', ')}`)
		}

		// Activate default profile
		const profile = getProfile('default')

		if (!profile) {
			logger.error('Default profile not found after reset.')
			return
		}

		const claudeSettings = readClaudeSettings()

		mergeClaudeSettings(claudeSettings, profile, pkgName)
		writeClaudeSettings(claudeSettings)

		const opencodeConfig = readOpenCodeConfig()
		const opencodeSection = generateOpenCodeSection(profile, pkgName)

		mergeOpenCodeConfig(opencodeConfig, opencodeSection)
		writeOpenCodeConfig(opencodeConfig)

		logger.success('Reset complete. Active profile: default')
	}
})
