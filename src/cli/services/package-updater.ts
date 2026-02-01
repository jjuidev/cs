import * as p from '@clack/prompts'
import { execSync } from 'node:child_process'
import consola from 'consola'
import { ShellIntegrationManager } from '../../shell/shell-integration-manager.js'

const PACKAGE_NAME = '@jjuidev/cs'

let updateInProgress = false
let rollbackVersion: string | null = null

/**
 * Handle SIGINT during update - rollback if interrupted
 */
process.on('SIGINT', async () => {
  if (updateInProgress && rollbackVersion) {
    consola.warn('\nUpdate interrupted! Rolling back...')
    await rollback(rollbackVersion)
  }
  process.exit(1)
})

/**
 * Execute npm install and verify installation
 * @param targetVersion Version to install
 * @param currentVersion Current version (for rollback)
 */
export async function executeUpdate(
  targetVersion: string,
  currentVersion: string
): Promise<void> {
  const spinner = p.spinner()

  // Store for potential rollback
  rollbackVersion = currentVersion
  updateInProgress = true

  try {
    // Step 1: Execute npm install
    spinner.start(`Installing ${PACKAGE_NAME}@${targetVersion}...`)

    execSync(`npm install -g ${PACKAGE_NAME}@${targetVersion}`, {
      stdio: 'pipe', // Capture output, don't show npm noise
      timeout: 120000 // 2 minute timeout
    })

    spinner.stop('Package installed')

    // Step 2: Verify installation
    spinner.start('Verifying installation...')

    const verified = await verifyInstallation(targetVersion)

    if (!verified) {
      spinner.stop('Verification failed')
      throw new Error('Version mismatch after installation')
    }

    spinner.stop('Installation verified')

    // Success
    updateInProgress = false
    rollbackVersion = null

    consola.success(`Successfully updated to ${targetVersion}`)

    // Get user's shell for correct source command
    const shellInfo = ShellIntegrationManager.detectShell()
    if (shellInfo.type !== 'unknown') {
      consola.info(`Please restart your terminal or run: source ${shellInfo.rcFile}`)
    } else {
      consola.info('Please restart your terminal to apply changes')
    }

  } catch (error) {
    updateInProgress = false
    spinner.stop('Update failed')

    consola.error(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

    // Attempt rollback
    await rollback(currentVersion)
  }
}

/**
 * Verify that installed version matches expected version
 * @param expectedVersion Expected version string
 * @returns True if verification passed
 */
async function verifyInstallation(expectedVersion: string): Promise<boolean> {
  try {
    // Get installed version
    const result = execSync('cs --version', {
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 10000
    })

    const installedVersion = result.trim()

    // Compare versions
    return installedVersion === expectedVersion
  } catch {
    // If cs command fails, verification failed
    return false
  }
}

/**
 * Rollback to previous version on failure
 * @param previousVersion Version to rollback to
 */
async function rollback(previousVersion: string): Promise<void> {
  const spinner = p.spinner()

  try {
    spinner.start(`Rolling back to ${previousVersion}...`)

    execSync(`npm install -g ${PACKAGE_NAME}@${previousVersion}`, {
      stdio: 'pipe',
      timeout: 120000
    })

    const verified = await verifyInstallation(previousVersion)

    if (verified) {
      spinner.stop('Rollback successful')
      consola.success(`Rolled back to ${previousVersion}`)
    } else {
      spinner.stop('Rollback may have failed')
      consola.warn('Rollback completed but verification failed')
      showManualInstructions(previousVersion)
    }
  } catch (error) {
    spinner.stop('Rollback failed')
    consola.error('Automatic rollback failed')
    showManualInstructions(previousVersion)
  }
}

/**
 * Show manual recovery instructions
 */
function showManualInstructions(version: string): void {
  consola.info('')
  consola.info('Manual recovery:')
  consola.info(`  npm install -g ${PACKAGE_NAME}@${version}`)
  consola.info('')
}
