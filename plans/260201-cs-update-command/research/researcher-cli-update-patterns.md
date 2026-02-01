# CLI Update Patterns Research Report

**Date:** 2026-02-01
**Researcher:** researcher-aa1549d
**Topic:** Interactive CLI Selection & Update Safety Mechanisms

---

## 1. Interactive CLI Selection Libraries

### Top Recommendations (2026)

#### **@clack/prompts** ⭐ RECOMMENDED
**Pros:**
- Modern, minimalist design with beautiful UI
- Built-in themes matching consola output
- Lightweight (~50KB)
- TypeScript-first with excellent types
- Active maintenance (2024-2026)
- Better UX than traditional inquirer

**Cons:**
- Newer library (smaller ecosystem)
- Limited plugins vs inquirer

**Code Example:**
```typescript
import * as p from '@clack/prompts';

const version = await p.select({
  message: 'Select version to install:',
  options: [
    { value: '1.0.5', label: '1.0.5 (latest)' },
    { value: '1.0.4', label: '1.0.4' },
    { value: '1.0.3', label: '1.0.3' },
  ],
});

const confirm = await p.confirm({
  message: `Update to version ${version}?`,
});

if (p.isCancel(confirm)) {
  p.cancel('Update cancelled');
  process.exit(0);
}
```

#### **@inquirer/prompts** (Modern Inquirer)
**Pros:**
- Modular approach (install only what you need)
- Mature ecosystem
- Wide adoption
- Rich plugin system

**Cons:**
- More verbose API
- Heavier bundle size
- Less modern UX

**Code Example:**
```typescript
import { select, confirm } from '@inquirer/prompts';

const version = await select({
  message: 'Select version to install',
  choices: [
    { name: '1.0.5 (latest)', value: '1.0.5' },
    { name: '1.0.4', value: '1.0.4' },
  ],
});

const shouldUpdate = await confirm({
  message: `Update to ${version}?`,
  default: true,
});
```

#### **prompts**
Lightweight alternative, good for simple cases but less feature-rich.

---

## 2. Update Safety Mechanisms

### Pre-Update Backup Strategy

**Recommended Approach:**
```typescript
// Store current version before update
const currentVersion = require('../package.json').version;
const backupPath = path.join(os.homedir(), '.cs-backup', currentVersion);

// Option 1: npm pack current version (lightweight)
await exec(`npm pack --pack-destination ${backupPath}`);

// Option 2: Store version number only (minimal)
await fs.writeFile(
  path.join(os.homedir(), '.cs-last-version'),
  currentVersion
);
```

### Rollback Implementation

**Pattern 1: Reinstall Previous Version**
```typescript
async function rollback(previousVersion: string) {
  consola.warn('Update failed, rolling back...');

  try {
    await exec(`npm install -g cs@${previousVersion}`);
    consola.success(`Rolled back to version ${previousVersion}`);
  } catch (error) {
    consola.error('Rollback failed:', error);
    consola.info(`Manually reinstall: npm install -g cs@${previousVersion}`);
  }
}
```

**Pattern 2: Use npm cache**
```typescript
// npm keeps cache, no need to backup
// Just reinstall specific version on failure
```

### Verification After Update

**Multi-Check Approach:**
```typescript
async function verifyInstallation(expectedVersion: string) {
  // Check 1: Version matches
  const { stdout } = await exec('cs --version');
  const installedVersion = stdout.trim();

  if (installedVersion !== expectedVersion) {
    throw new Error(`Version mismatch: expected ${expectedVersion}, got ${installedVersion}`);
  }

  // Check 2: Binary is executable
  await exec('cs --help');

  // Check 3: Core commands work
  await exec('cs list');

  return true;
}
```

### Interruption Handling

```typescript
let updateInProgress = false;

process.on('SIGINT', async () => {
  if (updateInProgress) {
    consola.warn('Update interrupted! Rolling back...');
    await rollback(previousVersion);
  }
  process.exit(1);
});
```

---

## 3. Best Practices from Popular CLIs

### npm Self-Update Pattern
- npm uses: `npm install -g npm@latest`
- Simple, delegates to package manager
- No custom update logic
- **Lesson:** Leverage npm's built-in capabilities

### Vercel CLI Pattern
- Shows update notification on every command
- Uses `update-notifier` package
- Non-intrusive banner at end of output
- **Lesson:** Remind users proactively

### Firebase Tools Pattern
- Interactive selection of versions
- Shows changelog before update
- Confirmation prompt with preview
- **Lesson:** Give users context before updating

---

## 4. Recommended Implementation Pattern

```typescript
// commands/update.ts
import * as p from '@clack/prompts';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function updateCommand() {
  p.intro('CS Update');

  // Step 1: Fetch available versions
  const spinner = p.spinner();
  spinner.start('Fetching available versions...');

  const { stdout } = await execAsync('npm view cs versions --json');
  const versions = JSON.parse(stdout).slice(-5).reverse();

  spinner.stop('Versions fetched');

  // Step 2: Interactive selection
  const selectedVersion = await p.select({
    message: 'Select version to install:',
    options: versions.map((v: string, i: number) => ({
      value: v,
      label: i === 0 ? `${v} (latest)` : v,
    })),
  });

  if (p.isCancel(selectedVersion)) {
    p.cancel('Update cancelled');
    return;
  }

  // Step 3: Confirmation
  const confirm = await p.confirm({
    message: `Update to version ${selectedVersion}?`,
  });

  if (!confirm || p.isCancel(confirm)) {
    p.cancel('Update cancelled');
    return;
  }

  // Step 4: Perform update with safety
  const currentVersion = require('../package.json').version;

  spinner.start(`Updating to ${selectedVersion}...`);

  try {
    await execAsync(`npm install -g cs@${selectedVersion}`);

    // Verify installation
    const { stdout: newVersion } = await execAsync('cs --version');

    if (newVersion.trim() === selectedVersion) {
      spinner.stop(`Updated successfully to ${selectedVersion}`);
      p.outro('Update complete!');
    } else {
      throw new Error('Version mismatch after update');
    }
  } catch (error) {
    spinner.stop('Update failed');

    // Rollback
    p.log.error('Rolling back to previous version...');
    await execAsync(`npm install -g cs@${currentVersion}`);

    p.outro('Update failed and rolled back');
    process.exit(1);
  }
}
```

---

## 5. Security Considerations

1. **Package Integrity**
   - npm handles signature verification automatically
   - Use official npm registry only
   - Avoid custom registries without verification

2. **Permission Handling**
   - Global installs may require sudo
   - Detect and warn users upfront
   - Guide users to fix npm permissions if needed

3. **Network Security**
   - npm uses HTTPS by default
   - No additional security needed for basic case
   - Consider timeout handling for slow connections

4. **Input Validation**
   - Validate version format (semver)
   - Only allow versions from npm registry
   - Sanitize user inputs if accepting custom versions

---

## Library Recommendation Summary

**For `cs update` command:**

| Library | Size | UX | Maintenance | Verdict |
|---------|------|----|-----------  |---------|
| @clack/prompts | 50KB | ⭐⭐⭐⭐⭐ | Active | ✅ **USE THIS** |
| @inquirer/prompts | 150KB | ⭐⭐⭐⭐ | Active | Alternative |
| prompts | 30KB | ⭐⭐⭐ | Stable | Too basic |

**Recommendation:** Use `@clack/prompts` for best UX and integration with existing `consola` output.

---

## Implementation Checklist

- [ ] Install `@clack/prompts`
- [ ] Create `update.ts` command
- [ ] Fetch versions from npm registry
- [ ] Implement interactive selection
- [ ] Add confirmation dialog
- [ ] Store current version before update
- [ ] Execute npm install with selected version
- [ ] Verify installation success
- [ ] Implement rollback on failure
- [ ] Handle SIGINT gracefully
- [ ] Add update command to CLI
- [ ] Test update flow end-to-end

---

## Unresolved Questions

1. Should we show changelog between versions during selection?
2. Should we cache version list to avoid npm registry calls?
3. Should we implement auto-update check on every command run?
4. Should we support update from specific registry/tag (beta, next)?

---

**Report File:** `/Users/tandm/Documents/jjuidev/npm/cs/plans/260201-cs-update-command/research/researcher-cli-update-patterns.md`
