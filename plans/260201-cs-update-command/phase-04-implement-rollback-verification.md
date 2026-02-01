# Phase 04: Implement Rollback and Verification

## Context Links

- [Plan Overview](./plan.md)
- [CLI Update Patterns Research](./research/researcher-cli-update-patterns.md)
- [Code Standards](../docs/code-standards.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-01 |
| Priority | P1 |
| Status | pending |
| Effort | 45m |

Implement package updater with rollback on failure and installation verification.

## Key Insights

From research:
- Store current version before update for rollback
- Use `npm install -g @jjuidev/cs@<version>` for updates
- Verify installation by checking `cs --version` output
- Handle SIGINT for graceful interruption
- npm keeps cache, so rollback is fast

## Requirements

### Functional
- Execute npm install globally
- Verify installed version matches expected
- Rollback to previous version on failure
- Handle interruption (SIGINT)

### Non-Functional
- Show progress with spinner
- Clear error messages
- Provide manual rollback instructions if auto-rollback fails

## Architecture

```typescript
// package-updater.ts
export async function executeUpdate(targetVersion: string, currentVersion: string): Promise<void>
async function verifyInstallation(expectedVersion: string): Promise<boolean>
async function rollback(previousVersion: string): Promise<void>
```

## Related Code Files

**Create:**
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/services/package-updater.ts`

## Implementation Steps

1. Create package-updater.ts:

```typescript
import * as p from '@clack/prompts'
import { execSync } from 'node:child_process'
import consola from 'consola'

const PACKAGE_NAME = '@jjuidev/cs'

let updateInProgress = false
let rollbackVersion: string | null = null

// Handle SIGINT during update
process.on('SIGINT', async () => {
  if (updateInProgress && rollbackVersion) {
    consola.warn('\nUpdate interrupted! Rolling back...')
    await rollback(rollbackVersion)
  }
  process.exit(1)
})

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
    consola.info('Please restart your terminal or run: source ~/.zshrc')

  } catch (error) {
    updateInProgress = false
    spinner.stop('Update failed')

    consola.error(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

    // Attempt rollback
    await rollback(currentVersion)
  }
}

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

function showManualInstructions(version: string): void {
  consola.info('')
  consola.info('Manual recovery:')
  consola.info(`  npm install -g ${PACKAGE_NAME}@${version}`)
  consola.info('')
}
```

2. Ensure proper export for import in update-action-handler.ts

## Todo List

- [ ] Create package-updater.ts
- [ ] Implement executeUpdate
- [ ] Implement verifyInstallation
- [ ] Implement rollback
- [ ] Implement SIGINT handler
- [ ] Add manual recovery instructions
- [ ] Verify build passes

## Success Criteria

- Update executes npm install correctly
- Version verified after install
- Rollback triggers on failure
- SIGINT during update triggers rollback
- Manual instructions shown if auto-rollback fails

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| npm install fails | Medium | Rollback to previous version |
| Verification fails | Low | Rollback + manual instructions |
| Rollback fails | Very Low | Show manual recovery steps |
| Permission denied | Medium | Clear error message |

## Security Considerations

- Only install from npm registry
- No arbitrary command execution
- Capture npm output to prevent injection

## Next Steps

Proceed to Phase 05: Integrate CLI Command
