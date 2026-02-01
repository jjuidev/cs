# Phase 05: Integrate CLI Command

## Context Links

- [Plan Overview](./plan.md)
- [CLI Entry Point](../src/cli/cs-cli.ts)
- [Codebase Summary](../docs/codebase-summary.md)
- [Code Standards](../docs/code-standards.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-01 |
| Priority | P1 |
| Status | pending |
| Effort | 15m |

Add `update` command to cs-cli.ts with proper subcommand handling.

## Key Insights

- Commander.js supports arguments for subcommands
- Follow existing pattern from config/list commands
- Add help text with examples
- Handle both `cs update` and `cs update <arg>` patterns

## Requirements

### Functional
- `cs update` - auto update to latest
- `cs update list` / `cs update ls` - show version list
- `cs update <version>` - update to specific version
- Display help with examples

### Non-Functional
- Consistent with existing CLI patterns
- Clear help text

## Related Code Files

**Modify:**
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/cs-cli.ts`

**Reference:**
- `/Users/tandm/Documents/jjuidev/npm/cs/src/cli/actions/update-action-handler.ts` (from Phase 03)

## Implementation Steps

1. Add import for updateAction in cs-cli.ts:
   ```typescript
   import { updateAction } from './actions/update-action-handler.js'
   ```

2. Add update command before the main argument handler:
   ```typescript
   program
     .command('update [version]')
     .description('Update cs CLI to a newer version')
     .addHelpText(
       'after',
       `
   Modes:
     cs update           Update to latest version
     cs update list      Show 10 newest versions (interactive)
     cs update ls        Alias for 'list'
     cs update <version> Update to specific version (e.g., 0.0.1)

   Examples:
     $ cs update              # Update to latest
     $ cs update list         # Interactive version selection
     $ cs update 0.0.3        # Update to version 0.0.3
     `
     )
     .action(updateAction)
   ```

3. Ensure proper command order (update before default argument handler)

## Full cs-cli.ts After Changes

```typescript
import { program } from 'commander'
import consola from 'consola'
import { configAction } from './actions/config-action-handler.js'
import { switchAction } from './actions/switch-action-handler.js'
import { listAction } from './actions/list-action-handler.js'
import { currentAction } from './actions/current-action-handler.js'
import { updateAction } from './actions/update-action-handler.js'
import { VALID_PROVIDERS } from '../config/default-config.js'
import packageJson from '../../package.json' with { type: 'json' }

program
  .name('cs')
  .description('Claude provider switcher - Switch between different Claude API providers')
  .version(packageJson.version)

program
  .command('config')
  .description('Configure a provider (requires -p|--provider)')
  .requiredOption('-p, --provider <provider>', `Provider name: ${VALID_PROVIDERS.join(', ')}`)
  .option('-t, --token <token>', 'Auth token')
  .option('-u, --url <url>', 'Base URL')
  .option('-o, --opus <model>', 'Opus model')
  .option('-s, --sonnet <model>', 'Sonnet model')
  .option('-h, --haiku <model>', 'Haiku model')
  .addHelpText(
    'after',
    `
Examples:
  $ cs config -p claude                                    # Load default config
  $ cs config -p claude -t sk-xxx                          # Set token
  $ cs config -p z -t sk-xxx -u https://api.z.ai          # Set token and URL
  $ cs config -p claude -o claude-opus-4.5 -s claude-sonnet-4.5  # Set models
  `
  )
  .action(configAction)

program
  .command('list')
  .alias('ls')
  .description('List all providers and their configurations')
  .action(listAction)

program
  .command('current')
  .description('Show current provider')
  .action(currentAction)

program
  .command('update [version]')
  .description('Update cs CLI to a newer version')
  .addHelpText(
    'after',
    `
Modes:
  cs update           Update to latest version
  cs update list      Show 10 newest versions (interactive)
  cs update ls        Alias for 'list'
  cs update <version> Update to specific version (e.g., 0.0.1)

Examples:
  $ cs update              # Update to latest
  $ cs update list         # Interactive version selection
  $ cs update 0.0.3        # Update to version 0.0.3
  `
  )
  .action(updateAction)

program
  .argument('<provider>', `Provider to switch to: ${VALID_PROVIDERS.join(', ')}`)
  .description('Switch to a provider')
  .addHelpText(
    'after',
    `
Examples:
  $ cs claude     # Switch to claude
  $ cs z          # Switch to z
  $ cs claudible  # Switch to claudible
  `
  )
  .action(switchAction)

program.parse()
```

## Todo List

- [ ] Add updateAction import
- [ ] Add update command with [version] argument
- [ ] Add help text with modes and examples
- [ ] Place before default argument handler
- [ ] Verify build passes
- [ ] Test all three modes work

## Success Criteria

- `cs update --help` shows correct help text
- `cs update` triggers auto-latest mode
- `cs update list` triggers list mode
- `cs update 0.0.1` triggers specific version mode
- Other commands still work

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Command order conflict | Low | Place update before default arg handler |
| Help text formatting | Low | Test with --help flag |

## Security Considerations

- No new security concerns at CLI layer
- All security handled in action handler and updater

## Next Steps

Proceed to Phase 06: Testing and Documentation
