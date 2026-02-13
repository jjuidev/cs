# Phase 02: Update CLI Entry Point

**Parent:** [plan.md](./plan.md)
**Status:** completed
**Priority:** P2
**Effort:** 10min

## Overview

Remove import statement và command registration cho update command trong cs-cli.ts.

## Related Code Files

### File to Edit
- `src/cli/cs-cli.ts`

## Implementation Steps

1. Remove import statement (line 7):
   ```typescript
   // DELETE THIS LINE:
   import { updateAction } from './actions/update-action-handler.js'
   ```

2. Remove command registration (lines 48-66):
   ```typescript
   // DELETE THIS BLOCK:
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

## Todo List

- [x] Remove updateAction import
- [x] Remove update command registration

## Success Criteria

- [x] No reference to updateAction in cs-cli.ts
- [x] No reference to 'update' command
- [x] File compiles without errors

## Risk Assessment

**Risk:** Other files may reference update-action-handler
**Mitigation:** Grep search before commit

## Next Steps

- Phase 03: Delete plans & reports
