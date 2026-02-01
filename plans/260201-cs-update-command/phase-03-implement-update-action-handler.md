# Phase 03: Implement Update Action Handler

## Context Links

- [Plan Overview](./plan.md)
- [CLI Update Patterns Research](./research/researcher-cli-update-patterns.md)
- [npm Registry API Research](./research/researcher-npm-registry-api.md)
- [Codebase Summary](../docs/codebase-summary.md)
- [Existing Action Handler Example](../src/cli/actions/config-action-handler.ts)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-01 |
| Priority | P1 |
| Status | pending |
| Effort | 1.5h |

Implement main update action handler supporting 3 modes.

## Key Insights

From research:
- Use @clack/prompts for consistent UX with modern CLI
- Store current version before update for rollback
- Confirm before updating (except auto-latest can skip with flag)
- Use `npm install -g @jjuidev/cs@<version>` for precise control

## Requirements

### Functional

**Mode 1: List (interactive)**
- Command: `cs update ls` or `cs update list`
- Show 10 newest versions
- Interactive selection with @clack/prompts
- Confirmation before update

**Mode 2: Auto-latest**
- Command: `cs update`
- Fetch latest version
- Show current vs latest comparison
- Confirm and update

**Mode 3: Specific version**
- Command: `cs update <version>`
- Validate version exists
- Validate semver format
- Confirm and update

### Non-Functional
- Clear progress indication (spinner)
- Graceful cancellation handling
- Rollback on failure

## Architecture

```typescript
// update-action-handler.ts
export async function updateAction(versionOrSubcommand?: string): Promise<void>

// Internal functions
function handleListMode(): Promise<void>
function handleAutoLatestMode(): Promise<void>
function handleSpecificVersionMode(version: string): Promise<void>
```

## Related Code Files

**Create:**
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/actions/update-action-handler.ts`

**Reference:**
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/actions/config-action-handler.ts` (pattern)
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/services/npm-version-fetcher.ts` (from Phase 02)

## Implementation Steps

1. Create update-action-handler.ts:

```typescript
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

async function handleListMode(): Promise<void> {
  const spinner = p.spinner()
  spinner.start('Fetching available versions...')

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
}

async function handleAutoLatestMode(): Promise<void> {
  const spinner = p.spinner()
  spinner.start('Checking for updates...')

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
}

async function handleSpecificVersionMode(version: string): Promise<void> {
  // Validate semver format
  if (!semver.valid(version)) {
    consola.error(`Invalid version format: ${version}`)
    consola.info('Version must be valid semver (e.g., 1.0.0)')
    process.exit(1)
  }

  const spinner = p.spinner()
  spinner.start('Validating version...')

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
}

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
```

2. Export from actions if needed

## Todo List

- [ ] Create update-action-handler.ts
- [ ] Implement updateAction main entry
- [ ] Implement handleListMode
- [ ] Implement handleAutoLatestMode
- [ ] Implement handleSpecificVersionMode
- [ ] Implement confirmAndUpdate
- [ ] Verify build passes

## Success Criteria

- `cs update` detects latest and prompts update
- `cs update list` shows 10 versions interactively
- `cs update 0.0.1` updates to specific version
- Cancellation handled gracefully
- Invalid versions rejected with clear message

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| User cancels mid-update | Medium | Phase 04 handles rollback |
| Invalid version input | Medium | semver validation before update |
| Network failure during fetch | Medium | Clear error message, retry in fetcher |

## Security Considerations

- Only accept versions from npm registry
- Validate semver format
- No arbitrary command execution

## Next Steps

Proceed to Phase 04: Implement Rollback and Verification
