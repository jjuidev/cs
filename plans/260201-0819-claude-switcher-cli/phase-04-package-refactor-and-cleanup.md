# Phase 4: Package Refactor and Cleanup

## Context Links
- Plan overview: [./overview.md](./overview.md)

## Overview
**Priority**: Medium
**Status**: `pending`

Refactor package từ `node-devtools` → `cs`, cleanup old code, update metadata.

---

## Requirements

### Package Metadata
- Rename package: `@jjuidev/node-devtools` → `@jjuidev/cs`
- Update description
- Update bin entry
- Update keywords
- Update exports (chỉ export cs CLI)

### Code Cleanup
- Remove old `node-devtools` CLI code
- Remove unused dependencies
- Clean up `src/` structure
- Update `src/index.ts` cho entry point mới

### Build Config
- Update tsup config cho CLI build
- Ensure ESM/CJS output

---

## Architecture Changes

### Before
```
src/
├── packages/commitlint/
├── packages/eslint/
├── scripts/cli.ts (old node-devtools)
├── scripts/interactive-setup.ts
├── scripts/setup-*.ts
├── utils/
├── types/
└── temp.ts
```

### After
```
src/
├── cli/
│   ├── cs-cli.ts          # Main CLI entry
│   ├── config-action.ts
│   ├── switch-action.ts
│   ├── list-action.ts
│   ├── current-action.ts
│   └── claude-settings.ts
├── config/
│   ├── default-config.ts  # From temp.ts
│   └── config-manager.ts
├── shell/
│   ├── shell-types.ts
│   └── shell-manager.ts
├── types/
│   └── cs-cli-options.ts
└── index.ts               # Re-export CLI
```

---

## Related Code Files

### Delete
- `src/packages/` (entire directory)
- `src/scripts/` (old CLI files)
- `src/utils/` (unused)

### Modify
- `package.json`
- `src/index.ts`
- `tsup.config.ts` (if exists)

---

## Implementation Steps

1. **Update package.json**
   - Name: `@jjuidev/node-devtools` → `@jjuidev/cs`
   - Description: "cs (claude switch) is helper CLI to switch claude code provider"
   - Bin: `{ "cs": "./dist/cli/cs.cjs" }`
   - Keywords: cs, claude, claude-code, claude-switch
   - Remove unused dependencies: prompts

2. **Clean up src/index.ts**
   - Remove old exports
   - Export CLI entry only

3. **Delete old code**
   - Remove `src/packages/`
   - Remove `src/scripts/` (old setup files)
   - Remove `src/utils/`

4. **Update tsup config**
   - Entry: `src/cli/cs-cli.ts`
   - Format: cjs for CLI

5. **Build and test**
   - Run `yarn build`
   - Test `cs --help`
   - Test `cs config -p claude`
   - Test `cs z`

---

## Todo List
- [ ] Update package.json metadata
- [ ] Clean up src/index.ts
- [ ] Delete src/packages/
- [ ] Delete src/scripts/ old files
- [ ] Delete src/utils/
- [ ] Update tsup config
- [ ] Run build
- [ ] Test CLI locally
- [ ] Link globally test: `npm link`
- [ ] Verify all commands work

---

## Success Criteria
- `yarn build` thành công
- `cs --help` hiển thị đúng help text
- `cs config -p claude -t xxx` hoạt động
- `cs z` switch provider thành công
- Package name là `@jjuidev/cs`
- No unused code/dependencies
