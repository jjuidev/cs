# Phase 2: Shell Integration Module

## Context Links
- Plan overview: [./overview.md](./overview.md)

## Overview
**Priority**: High
**Status**: `pending`

Module để detect shell và modify shell rc file (~/.zshrc, ~/.bashrc) cho environment variables.

---

## Requirements

### Functional
- Detect current shell (zsh, bash, fish, etc.)
- Tìm shell rc file path
- Update/append `export ANTHROPIC_BASE_URL="..."` và `export ANTHROPIC_AUTH_TOKEN="..."`
- Auto-source shell rc file sau khi modify
- Handle case: export đã tồn tại → replace; chưa tồn tại → append

### Non-functional
- Không phá hủy cấu trúc file rc
- Comment đoạn code do cs thêm để dễ identify
- Backup file rc trước khi modify (optional but safe)

---

## Architecture

```typescript
// src/shell/shell-manager.ts
type ShellType = 'zsh' | 'bash' | 'fish' | 'unknown'

interface ShellInfo {
  type: ShellType
  rcFile: string
  sourceCommand: string
}

const CS_MARKER = '# ===== CS CONFIG START ====='
const CS_END_MARKER = '# ===== CS CONFIG END ====='

class ShellManager {
  static detectShell(): ShellInfo
  static updateEnvExports(baseUrl: string, token: string): void
  static removeCsExports(): void
  static sourceShell(): void

  private static findExistingExports(content: string): { start: number; end: number } | null
  private static generateExportsBlock(baseUrl: string, token: string): string
}
```

### Shell Detection Logic
1. Check `$SHELL` env var
2. Fallback: check which shell đang chạy via `process.platform` + tests
3. Map shell → rc file:
   - `zsh` → `~/.zshrc`
   - `bash` → `~/.bashrc`
   - `fish` → `~/.config/fish/config.fish`

### File Modify Logic
```
# ===== CS CONFIG START =====
export ANTHROPIC_BASE_URL="https://api.anthropic.com"
export ANTHROPIC_AUTH_TOKEN="sk-xxx"
# ===== CS CONFIG END =====
```

Nếu block đã tồn tại → replace nội dung
Nếu chưa tồn tại → append vào cuối file

---

## Related Code Files

### Create
- `src/shell/shell-manager.ts`
- `src/shell/shell-types.ts`

---

## Implementation Steps

1. Create `src/shell/shell-types.ts` với ShellType, ShellInfo
2. Create `src/shell/shell-manager.ts` với ShellManager class
3. Implement `detectShell()`:
   - Read `process.env.SHELL`
   - Parse path để get shell name
   - Map to rc file path
   - Return ShellInfo with source command
4. Implement `findExistingExports()`:
   - Regex để tìm CS_MARKER block
   - Return start/end line numbers or null
5. Implement `generateExportsBlock()`:
   - Return string với proper format
6. Implement `updateEnvExports()`:
   - Read rc file content
   - Check existing block
   - Replace or append
   - Write back
7. Implement `removeCsExports()`:
   - Remove CS block nếu tồn tại
8. Implement `sourceShell()`:
   - Execute `source ~/.zshrc` hoặc tương ứng
   - Use `child_process.execSync`

---

## Todo List
- [ ] Create src/shell/shell-types.ts
- [ ] Create src/shell/shell-manager.ts
- [ ] Implement detectShell()
- [ ] Implement findExistingExports()
- [ ] Implement generateExportsBlock()
- [ ] Implement updateEnvExports()
- [ ] Implement removeCsExports()
- [ ] Implement sourceShell()
- [ ] Add error handling
- [ ] Test on zsh and bash

---

## Success Criteria
- Detect đúng shell đang dùng
- Update ~/.zshrc hoặc ~/.bashrc đúng format
- Replace existing exports (không duplicate)
- Auto-source hoạt động
- Không phá hủy file rc
