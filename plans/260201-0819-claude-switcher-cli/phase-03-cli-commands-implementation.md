# Phase 3: CLI Commands Implementation

## Context Links
- Config module: [./phase-01-config-storage-module.md](./phase-01-config-storage-module.md)
- Shell module: [./phase-02-shell-integration-module.md](./phase-02-shell-integration-module.md)
- Plan overview: [./overview.md](./overview.md)

## Overview
**Priority**: High
**Status**: `pending`

Implement CLI commands sử dụng `commander` cho `cs` tool.

---

## Requirements

### Commands

#### 1. `cs config -p <provider>` [REQUIRED]
- `-p|--provider` bắt buộc, validate theo Providers type
- Optional: `-t|--token`, `-u|--url`, `-o|--opus`, `-s|--sonnet`, `-h|--haiku`
- Load default config → apply overrides → save
- Error khi provider missing/invalid

#### 2. `cs <provider>`
- Switch sang provider đã config
- Overwrite `~/.claude/settings.json` (env.ANTHROPIC_* fields)
- Update shell exports
- Source shell

#### 3. `cs list` [Bonus]
- List tất cả providers và config
- Hiển thị current provider

#### 4. `cs current` [Bonus]
- Hiển thị current provider info

### Non-functional
- Clear error messages
- Help text cho mỗi command
- Consola for colored output

---

## Architecture

```typescript
// src/cli/cs-cli.ts
import { program } from 'commander'
import consola from 'consola'
import { ConfigManager } from '../config/config-manager.js'
import { ShellManager } from '../shell/shell-manager.js'

program.name('cs').description('Claude provider switcher').version('1.0.0')

// Config command
program
  .command('config')
  .requiredOption('-p, --provider <provider>', 'Provider name')
  .option('-t, --token <token>', 'Auth token')
  .option('-u, --url <url>', 'Base URL')
  .option('-o, --opus <model>', 'Opus model')
  .option('-s, --sonnet <model>', 'Sonnet model')
  .option('-h, --haiku <model>', 'Haiku model')
  .action(configAction)

// Switch command (default)
program
  .argument('<provider>', 'Provider to switch to')
  .action(switchAction)

// List command
program.command('list').action(listAction)

// Current command
program.command('current').action(currentAction)
```

### Action Implementations

```typescript
// cs config -p <provider> [options]
async function configAction(options: ConfigOptions) {
  // Validate provider
  if (!options.provider || !isValidProvider(options.provider)) {
    consola.error(`Invalid provider. Must be one of: ${VALID_PROVIDERS.join(', ')}`)
    process.exit(1)
  }

  // Load default + merge with options
  ConfigManager.updateProvider(options.provider, {
    ANTHROPIC_AUTH_TOKEN: options.token,
    ANTHROPIC_BASE_URL: options.url,
    // ...
  })

  consola.success(`Configured provider: ${options.provider}`)
}

// cs <provider>
async function switchAction(provider: string) {
  // Validate provider
  if (!isValidProvider(provider)) {
    consola.error(`Invalid provider: ${provider}`)
    process.exit(1)
  }

  // Get provider config
  const config = ConfigManager.getProvider(provider as Providers)

  // Update ~/.claude/settings.json
  await updateClaudeSettings(config)

  // Update shell exports
  ShellManager.updateEnvExports(config.ANTHROPIC_BASE_URL, config.ANTHROPIC_AUTH_TOKEN)

  // Source shell
  ShellManager.sourceShell()

  // Update current
  ConfigManager.setCurrentProvider(provider as Providers)

  consola.success(`Switched to provider: ${provider}`)
}
```

---

## Related Code Files

### Create
- `src/cli/cs-cli.ts`
- `src/cli/config-action.ts`
- `src/cli/switch-action.ts`
- `src/cli/list-action.ts`
- `src/cli/current-action.ts`
- `src/types/cs-cli-options.ts`

### Modify
- `src/temp.ts` → remove after migration
- Update `package.json` bin entry

---

## Implementation Steps

1. Create `src/types/cs-cli-options.ts` với interface options
2. Create `src/cli/claude-settings.ts` với `updateClaudeSettings()` function
3. Create `src/cli/config-action.ts` với config action logic
4. Create `src/cli/switch-action.ts` với switch action logic
5. Create `src/cli/list-action.ts` với list action logic
6. Create `src/cli/current-action.ts` với current action logic
7. Create `src/cli/cs-cli.ts` với commander setup
8. Update `package.json` bin: `{ "cs": "./dist/cli/cs.cjs" }`

---

## Todo List
- [ ] Create src/types/cs-cli-options.ts
- [ ] Create src/cli/claude-settings.ts
- [ ] Create src/cli/config-action.ts
- [ ] Create src/cli/switch-action.ts
- [ ] Create src/cli/list-action.ts
- [ ] Create src/cli/current-action.ts
- [ ] Create src/cli/cs-cli.ts
- [ ] Update package.json bin entry
- [ ] Test all commands
- [ ] Add help text

---

## Success Criteria
- `cs config -p z -t xxx` hoạt động
- `cs z` switch provider thành công
- `cs list` hiển thị tất cả providers
- `cs current` hiển thị current provider
- Error messages rõ ràng
- Help text đầy đủ
