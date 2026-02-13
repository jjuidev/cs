# Phase 04: Update Documentation

**Parent:** [plan.md](./plan.md)
**Status:** completed
**Priority:** P2
**Effort:** 10min

## Overview

Remove "cs update" section từ README.md.

## Related Code Files

### File to Edit
- `README.md`

## Implementation Steps

1. Remove lines 117-141 (cs update section):
   ```markdown
   ### `cs update` - Update CLI

   Update cs CLI to a newer version with three convenient modes.

   ```bash
   # Update to latest version
   cs update

   # Interactive version selection (shows 10 newest versions)
   cs update list
   cs update ls

   # Update to specific version
   cs update 0.0.3
   ```

   **Features:**

   - ✅ Auto-update to latest stable version
   - ✅ Interactive version selection with @clack/prompts
   - ✅ Specific version installation
   - ✅ Automatic rollback on failure
   - ✅ Installation verification
   ```

2. Verify no other references to "cs update" in README

## Todo List

- [x] Remove cs update section from README.md
- [x] Verify no orphaned references

## Success Criteria

- [x] README.md no longer contains "cs update" section
- [x] No broken markdown formatting
- [x] Table of contents still accurate (if exists)

## Next Steps

- Phase 05: Update dependencies
