export type ShellType = 'zsh' | 'bash' | 'fish' | 'unknown'

export interface ShellInfo {
	type: ShellType
	rcFile: string
}

export const CS_MARKER = '# ===== CS CONFIG START ====='
export const CS_END_MARKER = '# ===== CS CONFIG END ====='
