# Phase 1: Config Storage Module

## Context Links
- Default config template: `src/temp.ts`
- Plan overview: [./overview.md](./overview.md)

## Overview
**Priority**: High
**Status**: `pending`

Module để quản lý lưu trữ và đọc cấu hình provider tại `~/.cs/settings.json`.

---

## Requirements

### Functional
- Tạo `~/.cs` directory nếu chưa tồn tại
- Khởi tạo `settings.json` với default config từ `src/temp.ts` (token rỗng)
- Đọc/saved config theo provider
- Merge config: default + user overrides

### Non-functional
- TypeScript
- Error handling cho file operations
- Thread-safe (nhiều process có thể đọc đồng thời)

---

## Architecture

```typescript
// src/config/config-manager.ts
interface ProviderConfig {
  ANTHROPIC_BASE_URL: string
  ANTHROPIC_AUTH_TOKEN: string
  ANTHROPIC_DEFAULT_OPUS_MODEL: string
  ANTHROPIC_DEFAULT_SONNET_MODEL: string
  ANTHROPIC_DEFAULT_HAIKU_MODEL: string
}

interface CsSettings {
  providers: Record<Providers, ProviderConfig>
  current: Providers
}

class ConfigManager {
  private static CONFIG_DIR = path.join(os.homedir(), '.cs')
  private static SETTINGS_FILE = path.join(ConfigManager.CONFIG_DIR, 'settings.json')

  static ensureConfigDir(): void
  static initDefaultConfig(): void
  static loadSettings(): CsSettings
  static saveSettings(settings: CsSettings): void
  static getProvider(provider: Providers): ProviderConfig
  static updateProvider(provider: Providers, updates: Partial<ProviderConfig>): void
  static setCurrentProvider(provider: Providers): void
}
```

---

## Related Code Files

### Create
- `src/config/config-manager.ts`
- `src/config/default-config.ts` (export from temp.ts)

### Modify
- `src/temp.ts` → rename/refactor thành `src/config/default-config.ts`

---

## Implementation Steps

1. Tạo `src/config/default-config.ts` với DEFAULT_CONFIG từ temp.ts
2. Tạo `src/config/config-manager.ts` với ConfigManager class
3. Implement `ensureConfigDir()` - tạo ~/.cs directory
4. Implement `initDefaultConfig()` - tạo settings.json ban đầu
5. Implement `loadSettings()` - đọc JSON, parse, validate schema
6. Implement `saveSettings()` - stringify, write to file
7. Implement `getProvider()` - return config cho provider cụ thể
8. Implement `updateProvider()` - merge updates với existing config
9. Implement `setCurrentProvider()` - update `current` field

---

## Todo List
- [ ] Create src/config/default-config.ts
- [ ] Create src/config/config-manager.ts
- [ ] Implement ensureConfigDir()
- [ ] Implement initDefaultConfig()
- [ ] Implement loadSettings()
- [ ] Implement saveSettings()
- [ ] Implement getProvider()
- [ ] Implement updateProvider()
- [ ] Implement setCurrentProvider()
- [ ] Add error handling
- [ ] Test manually

---

## Success Criteria
- `~/.cs/settings.json` được tạo khi init
- Đọc/ghi config hoạt động đúng
- Merge config (default + overrides) hoạt động
- Error khi file corrupted handled gracefully
