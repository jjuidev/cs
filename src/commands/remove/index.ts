import { defineCommand } from 'citty'

import { removeProfile } from '@/config/cs-config'
import { logger } from '@/utils/logger'
import { validateProfileName } from '@/utils/validation'

export const removeCommand = defineCommand({
	meta: {
		name: 'remove',
		description: 'Remove a profile'
	},
	args: {
		name: {
			type: 'positional',
			name: 'name',
			required: true,
			description: 'Profile name to remove'
		}
	},
	run: async (ctx) => {
		const profileName = (ctx.args.name as string).trim()

		const nameError = validateProfileName(profileName)

		if (nameError) {
			logger.error(nameError)
			return
		}

		if (profileName === 'default') {
			logger.error('Cannot remove the "default" profile.')
			return
		}

		const removed = removeProfile(profileName)

		if (!removed) {
			logger.error(`Profile "${profileName}" not found.`)
			return
		}

		logger.success(`Profile "${profileName}" removed.`)
	}
})
