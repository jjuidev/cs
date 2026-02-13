# Phase 05: Update Dependencies

**Parent:** [plan.md](./plan.md)
**Status:** completed
**Priority:** P2
**Effort:** 10min

## Overview

Remove `semver` dependency từ package.json vì chỉ dùng cho update command.

## Related Code Files

### File to Edit
- `package.json`

## Implementation Steps

1. Open `package.json`
2. Find and remove `semver` from dependencies:
   ```json
   "semver": "^7.x.x"
   ```
3. Run `yarn install` hoặc `npm install` để update lockfile

## Todo List

- [x] Remove semver from package.json dependencies
- [x] Run yarn/npm install to update lockfile

## Success Criteria

- [x] semver removed from package.json
- [x] Lockfile updated
- [x] No other code references semver

## Risk Assessment

**Risk:** Other files may use semver
**Mitigation:** Grep search for "semver" before removal

## Next Steps

- Phase 06: Build & verify
