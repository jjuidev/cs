export type Providers = 'claude' | 'claudible' | 'jjuidev' | 'z'

export interface ProviderConfig {
	ANTHROPIC_BASE_URL: string
	ANTHROPIC_AUTH_TOKEN: string
	ANTHROPIC_DEFAULT_OPUS_MODEL: string
	ANTHROPIC_DEFAULT_SONNET_MODEL: string
	ANTHROPIC_DEFAULT_HAIKU_MODEL: string
}

export const DEFAULT_CONFIG: Record<Providers, ProviderConfig> = {
	claude: {
		ANTHROPIC_BASE_URL: 'https://api.anthropic.com',
		ANTHROPIC_AUTH_TOKEN: '',
		ANTHROPIC_DEFAULT_OPUS_MODEL: 'claude-opus-4.5',
		ANTHROPIC_DEFAULT_SONNET_MODEL: 'claude-sonnet-4.5',
		ANTHROPIC_DEFAULT_HAIKU_MODEL: 'claude-haiku-4.5'
	},
	claudible: {
		ANTHROPIC_BASE_URL: 'https://claudible.io',
		ANTHROPIC_AUTH_TOKEN: '',
		ANTHROPIC_DEFAULT_OPUS_MODEL: 'claude-opus-4.5',
		ANTHROPIC_DEFAULT_SONNET_MODEL: 'claude-sonnet-4.5',
		ANTHROPIC_DEFAULT_HAIKU_MODEL: 'claude-haiku-4.5'
	},
	jjuidev: {
		ANTHROPIC_BASE_URL: 'https://ai.jjuidev.com',
		ANTHROPIC_AUTH_TOKEN: '',
		ANTHROPIC_DEFAULT_OPUS_MODEL: 'gemini-claude-opus-4-5-thinking',
		ANTHROPIC_DEFAULT_SONNET_MODEL: 'gemini-claude-sonnet-4-5-thinking',
		ANTHROPIC_DEFAULT_HAIKU_MODEL: 'gemini-claude-sonnet-4-5'
	},
	z: {
		ANTHROPIC_BASE_URL: 'https://api.z.ai/api/anthropic',
		ANTHROPIC_AUTH_TOKEN: '',
		ANTHROPIC_DEFAULT_OPUS_MODEL: 'GLM-4.7',
		ANTHROPIC_DEFAULT_SONNET_MODEL: 'GLM-4.7',
		ANTHROPIC_DEFAULT_HAIKU_MODEL: 'GLM-4.5-Air'
	}
}

export const VALID_PROVIDERS: Providers[] = ['claude', 'claudible', 'jjuidev', 'z']

export function isValidProvider(value: string): value is Providers {
	return VALID_PROVIDERS.includes(value as Providers)
}
