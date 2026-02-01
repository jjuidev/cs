import * as p from '@clack/prompts'
import semver from 'semver'
import consola from 'consola'
import { execSync } from 'node:child_process'
import packageJson from '../../../package.json' with { type: 'json' }
import {
  fetchAvailableVersions,
  getLatestVersion,
  versionExists
} from '../services/npm-version-fetcher.js'

const PACKAGE_NAME = '@jjuidev/cs'

/**
 * Main update action handler
 * Supports three modes:
 * 1. Auto-latest: cs update
 * 2. Interactive list: cs update list|ls
 * 3. Specific version: cs update <version>
 */
export async function updateAction(versionOrSubcommand?: string): Promise<void> {
  // Determine mode
  if (!versionOrSubcommand) {
    await handleAutoLatestMode()
  } else if (versionOrSubcommand === 'ls' || versionOrSubcommand === 'list') {
    await handleListMode()
  } else {
    await handleSpecificVersionMode(versionOrSubcommand)
  }
}

/**
 * Mode 1: Interactive list - show 10 versions and let user select
 */
async function handleListMode(): Promise<void> {
  const spinner = p.spinner()
  spinner.start('Fetching available versions...')

  try {
    const versions = await fetchAvailableVersions(10)
    const currentVersion = packageJson.version

    spinner.stop('Versions fetched')

    const options = versions.map(v => ({
      value: v.version,
      label: v.isLatest
        ? `${v.version} (latest)`
        : v.version === currentVersion
          ? `${v.version} (current)`
          : v.version
    }))

    const selectedVersion = await p.select({
      message: 'Select version to install:',
      options
    })

    if (p.isCancel(selectedVersion)) {
      p.cancel('Update cancelled')
      process.exit(0)
    }

    await confirmAndUpdate(selectedVersion as string, currentVersion)
  } catch (error) {
    spinner.stop('Failed to fetch versions')
    consola.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    process.exit(1)
  }
}

/**
 * Mode 2: Auto-latest - update to latest version
 */
async function handleAutoLatestMode(): Promise<void> {
  const spinner = p.spinner()
  spinner.start('Checking for updates...')

  try {
    const latestVersion = await getLatestVersion()
    const currentVersion = packageJson.version

    spinner.stop('Check complete')

    if (semver.eq(currentVersion, latestVersion)) {
      consola.success(`Already on latest version (${currentVersion})`)
      return
    }

    if (semver.gt(currentVersion, latestVersion)) {
      consola.info(`Current version (${currentVersion}) is newer than latest (${latestVersion})`)
      return
    }

    consola.info(`Current: ${currentVersion} → Latest: ${latestVersion}`)

    await confirmAndUpdate(latestVersion, currentVersion)
  } catch (error) {
    spinner.stop('Check failed')
    consola.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    process.exit(1)
  }
}

/**
 * Mode 3: Specific version - update to specified version
 */
async function handleSpecificVersionMode(version: string): Promise<void> {
  // Validate semver format
  if (!semver.valid(version)) {
    consola.error(`Invalid version format: ${version}`)
    consola.info('Version must be valid semver (e.g., 1.0.0)')
    process.exit(1)
  }

  const spinner = p.spinner()
  spinner.start('Validating version...')

  try {
    const exists = await versionExists(version)

    if (!exists) {
      spinner.stop('Version not found')
      consola.error(`Version ${version} not found in registry`)
      process.exit(1)
    }

    spinner.stop('Version validated')

    const currentVersion = packageJson.version

    if (semver.eq(currentVersion, version)) {
      consola.success(`Already on version ${version}`)
      return
    }

    await confirmAndUpdate(version, currentVersion)
  } catch (error) {
    spinner.stop('Validation failed')
    consola.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    process.exit(1)
  }
}

/**
 * Confirm with user and execute update
 */
async function confirmAndUpdate(targetVersion: string, currentVersion: string): Promise<void> {
  const direction = semver.gt(targetVersion, currentVersion) ? 'upgrade' : 'downgrade'

  const confirmed = await p.confirm({
    message: `${direction === 'upgrade' ? 'Upgrade' : 'Downgrade'} from ${currentVersion} to ${targetVersion}?`
  })

  if (!confirmed || p.isCancel(confirmed)) {
    p.cancel('Update cancelled')
    process.exit(0)
  }

  // Import and call package updater (from Phase 04)
  const { executeUpdate } = await import('../services/package-updater.js')
  await executeUpdate(targetVersion, currentVersion)
}
