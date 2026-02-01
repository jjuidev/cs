import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import type { ShellInfo, ShellType } from './shell-types.js'
import { CS_MARKER, CS_END_MARKER } from './shell-types.js'

export class ShellIntegrationManager {
	static detectShell(): ShellInfo {
		const shellPath = process.env.SHELL || ''
		const shellName = path.basename(shellPath)
		const homeDir = os.homedir()

		let type: ShellType = 'unknown'
		let rcFile = ''
		let sourceCommand = ''

		switch (shellName) {
			case 'zsh':
				type = 'zsh'
				rcFile = path.join(homeDir, '.zshrc')
				sourceCommand = `source "${rcFile}"`
				break
			case 'bash':
				type = 'bash'
				rcFile = path.join(homeDir, '.bashrc')
				sourceCommand = `source "${rcFile}"`
				break
			case 'fish':
				type = 'fish'
				rcFile = path.join(homeDir, '.config/fish/config.fish')
				sourceCommand = `source "${rcFile}"`
				break
			default:
				type = 'unknown'
				rcFile = path.join(homeDir, '.zshrc')
				sourceCommand = `source "${rcFile}"`
		}

		return { type, rcFile, sourceCommand }
	}

	static updateEnvExports(baseUrl: string, token: string): void {
		const shellInfo = this.detectShell()
		const rcFile = shellInfo.rcFile

		if (!fs.existsSync(rcFile)) {
			fs.writeFileSync(rcFile, '', 'utf-8')
		}

		let content = fs.readFileSync(rcFile, 'utf-8')
		const exportsBlock = this.generateExportsBlock(baseUrl, token)
		const existingBlock = this.findExistingExports(content)

		if (existingBlock) {
			content = content.replace(existingBlock.fullMatch, exportsBlock)
		} else {
			content = content.trimEnd() + '\n\n' + exportsBlock + '\n'
		}

		fs.writeFileSync(rcFile, content, 'utf-8')
	}

	static removeCsExports(): void {
		const shellInfo = this.detectShell()
		const rcFile = shellInfo.rcFile

		if (!fs.existsSync(rcFile)) {
			return
		}

		let content = fs.readFileSync(rcFile, 'utf-8')
		const existingBlock = this.findExistingExports(content)

		if (existingBlock) {
			content = content.replace(existingBlock.fullMatch, '')
			fs.writeFileSync(rcFile, content, 'utf-8')
		}
	}

	static sourceShell(): void {
		const shellInfo = this.detectShell()
		try {
			execSync(shellInfo.sourceCommand, { stdio: 'inherit' })
		} catch {
		}
	}

	private static findExistingExports(content: string): { fullMatch: string; start: number; end: number } | null {
		const startMarker = content.indexOf(CS_MARKER)
		if (startMarker === -1) {
			return null
		}

		const endMarker = content.indexOf(CS_END_MARKER, startMarker)
		if (endMarker === -1) {
			return null
		}

		const fullMatch = content.substring(startMarker, endMarker + CS_END_MARKER.length)
		return {
			fullMatch,
			start: startMarker,
			end: endMarker + CS_END_MARKER.length
		}
	}

	private static generateExportsBlock(baseUrl: string, token: string): string {
		return `${CS_MARKER}
export ANTHROPIC_BASE_URL="${baseUrl}"
export ANTHROPIC_AUTH_TOKEN="${token}"
${CS_END_MARKER}`
	}
}
