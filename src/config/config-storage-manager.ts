import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import type { Providers, ProviderConfig } from './default-config.js'
import { DEFAULT_CONFIG } from './default-config.js'

export interface CsSettings {
	providers: Record<Providers, ProviderConfig>
	current: Providers
}

export class ConfigStorageManager {
	private static CONFIG_DIR = path.join(os.homedir(), '.cs')
	private static SETTINGS_FILE = path.join(ConfigStorageManager.CONFIG_DIR, 'settings.json')

	static ensureConfigDir(): void {
		if (!fs.existsSync(this.CONFIG_DIR)) {
			fs.mkdirSync(this.CONFIG_DIR, { recursive: true })
		}
	}

	static initDefaultConfig(): void {
		this.ensureConfigDir()
		if (fs.existsSync(this.SETTINGS_FILE)) {
			return
		}

		const defaultSettings: CsSettings = {
			providers: { ...DEFAULT_CONFIG },
			current: 'claude'
		}
		this.saveSettings(defaultSettings)
	}

	static loadSettings(): CsSettings {
		this.initDefaultConfig()

		try {
			const content = fs.readFileSync(this.SETTINGS_FILE, 'utf-8')
			const settings = JSON.parse(content) as CsSettings
			return settings
		} catch (error) {
			return this.getDefaultSettings()
		}
	}

	static saveSettings(settings: CsSettings): void {
		this.ensureConfigDir()
		fs.writeFileSync(this.SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8')
	}

	static getProvider(provider: Providers): ProviderConfig {
		const settings = this.loadSettings()
		return settings.providers[provider] || DEFAULT_CONFIG[provider]
	}

	static updateProvider(provider: Providers, updates: Partial<ProviderConfig>): void {
		const settings = this.loadSettings()
		const currentConfig = settings.providers[provider] || DEFAULT_CONFIG[provider]
		settings.providers[provider] = {
			...currentConfig,
			...updates
		}
		this.saveSettings(settings)
	}

	static setCurrentProvider(provider: Providers): void {
		const settings = this.loadSettings()
		settings.current = provider
		this.saveSettings(settings)
	}

	static getCurrentProvider(): Providers {
		const settings = this.loadSettings()
		return settings.current
	}

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

	static getAllProviders(): Record<Providers, ProviderConfig> {
		const settings = this.loadSettings()
		return settings.providers
	}

	private static getDefaultSettings(): CsSettings {
		return {
			providers: { ...DEFAULT_CONFIG },
			current: 'claude'
		}
	}
}
