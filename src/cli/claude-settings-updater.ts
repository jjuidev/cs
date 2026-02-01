import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import type { ProviderConfig } from '../config/default-config.js'

const CLAUDE_SETTINGS_FILE = path.join(os.homedir(), '.claude', 'settings.json')

export interface ClaudeSettings {
	env?: {
		ANTHROPIC_AUTH_TOKEN?: string
		ANTHROPIC_BASE_URL?: string
		ANTHROPIC_DEFAULT_OPUS_MODEL?: string
		ANTHROPIC_DEFAULT_SONNET_MODEL?: string
		ANTHROPIC_DEFAULT_HAIKU_MODEL?: string
	}
}

export function updateClaudeSettings(config: ProviderConfig): void {
	const settingsDir = path.dirname(CLAUDE_SETTINGS_FILE)

	if (!fs.existsSync(settingsDir)) {
		fs.mkdirSync(settingsDir, { recursive: true })
	}

	let settings: ClaudeSettings = {}

	if (fs.existsSync(CLAUDE_SETTINGS_FILE)) {
		try {
			const content = fs.readFileSync(CLAUDE_SETTINGS_FILE, 'utf-8')
			settings = JSON.parse(content)
		} catch {
		}
	}

	if (!settings.env) {
		settings.env = {}
	}

	settings.env.ANTHROPIC_AUTH_TOKEN = config.ANTHROPIC_AUTH_TOKEN
	settings.env.ANTHROPIC_BASE_URL = config.ANTHROPIC_BASE_URL
	settings.env.ANTHROPIC_DEFAULT_OPUS_MODEL = config.ANTHROPIC_DEFAULT_OPUS_MODEL
	settings.env.ANTHROPIC_DEFAULT_SONNET_MODEL = config.ANTHROPIC_DEFAULT_SONNET_MODEL
	settings.env.ANTHROPIC_DEFAULT_HAIKU_MODEL = config.ANTHROPIC_DEFAULT_HAIKU_MODEL

	fs.writeFileSync(CLAUDE_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8')
}
