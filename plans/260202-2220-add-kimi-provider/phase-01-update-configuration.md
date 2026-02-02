# Phase 01: Update Configuration Types and Defaults

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Related File: `/Users/tandm/Documents/jjuidev/npm/cs/src/config/default-config.ts`
- Documentation: `/Users/tandm/Documents/jjuidev/npm/cs/docs/code-standards.md`

## Overview
- **Date**: 2026-02-02
- **Priority**: P1 (Critical path)
- **Effort**: 20min
- **Implementation Status**: Pending
- **Review Status**: Not started

Cập nhật type definitions và default configuration để thêm Kimi provider vào cs CLI tool.

## Key Insights
- Codebase sử dụng TypeScript strict mode với union types cho provider names
- Tất cả providers được định nghĩa tập trung trong `default-config.ts`
- Pattern rất clear: type union → config object → validation array
- No breaking changes vì chỉ thêm provider mới

## Requirements

### Functional Requirements
1. Add 'kimi' to `Providers` type union
2. Add kimi configuration to `DEFAULT_CONFIG` object
3. Add 'kimi' to `VALID_PROVIDERS` array
4. Maintain alphabetical ordering (optional but clean)

### Non-Functional Requirements
- TypeScript type safety maintained
- Follow existing code conventions
- No breaking changes to existing providers
- Clean, readable code

## Architecture

### Current Structure
```typescript
// Line 1: Type definition
export type Providers = 'claude' | 'claudible' | 'jjuidev' | 'z'

// Lines 11-40: Configuration object
export const DEFAULT_CONFIG: Record<Providers, ProviderConfig> = {
  claude: { ... },
  claudible: { ... },
  jjuidev: { ... },
  z: { ... }
}

// Line 42: Validation array
export const VALID_PROVIDERS: Providers[] = ['claude', 'claudible', 'jjuidev', 'z']
```

### Updated Structure
```typescript
// Add 'kimi' to type union
export type Providers = 'claude' | 'claudible' | 'jjuidev' | 'kimi' | 'z'

// Add kimi configuration
export const DEFAULT_CONFIG: Record<Providers, ProviderConfig> = {
  claude: { ... },
  claudible: { ... },
  jjuidev: { ... },
  kimi: {
    ANTHROPIC_BASE_URL: 'https://api.kimi.com/coding',
    ANTHROPIC_AUTH_TOKEN: '',
    ANTHROPIC_DEFAULT_OPUS_MODEL: 'kimi-k2.5',
    ANTHROPIC_DEFAULT_SONNET_MODEL: 'kimi-k2.5',
    ANTHROPIC_DEFAULT_HAIKU_MODEL: 'kimi-k2.5'
  },
  z: { ... }
}

// Add 'kimi' to validation array
export const VALID_PROVIDERS: Providers[] = ['claude', 'claudible', 'jjuidev', 'kimi', 'z']
```

## Related Code Files

### Files to Modify
- `/Users/tandm/Documents/jjuidev/npm/cs/src/config/default-config.ts`

### Files to Read (for context)
- `/Users/tandm/Documents/jjuidev/npm/cs/src/types/cs-cli-options.ts`
- `/Users/tandm/Documents/jjuidev/npm/cs/docs/code-standards.md`

## Implementation Steps

1. **Read current file**
   ```bash
   Read /Users/tandm/Documents/jjuidev/npm/cs/src/config/default-config.ts
   ```

2. **Update Providers type (Line 1)**
   ```typescript
   // Before
   export type Providers = 'claude' | 'claudible' | 'jjuidev' | 'z'

   // After
   export type Providers = 'claude' | 'claudible' | 'jjuidev' | 'kimi' | 'z'
   ```

3. **Add kimi configuration to DEFAULT_CONFIG (after line 31, before z)**
   ```typescript
   kimi: {
     ANTHROPIC_BASE_URL: 'https://api.kimi.com/coding',
     ANTHROPIC_AUTH_TOKEN: '',
     ANTHROPIC_DEFAULT_OPUS_MODEL: 'kimi-k2.5',
     ANTHROPIC_DEFAULT_SONNET_MODEL: 'kimi-k2.5',
     ANTHROPIC_DEFAULT_HAIKU_MODEL: 'kimi-k2.5'
   },
   ```

4. **Update VALID_PROVIDERS array (Line 42)**
   ```typescript
   // Before
   export const VALID_PROVIDERS: Providers[] = ['claude', 'claudible', 'jjuidev', 'z']

   // After
   export const VALID_PROVIDERS: Providers[] = ['claude', 'claudible', 'jjuidev', 'kimi', 'z']
   ```

5. **Verify changes**
   - TypeScript type checks pass
   - No syntax errors
   - Alphabetical ordering maintained

## Todo List

- [ ] Read current default-config.ts file
- [ ] Update Providers type union to include 'kimi'
- [ ] Add kimi configuration to DEFAULT_CONFIG object
- [ ] Update VALID_PROVIDERS array to include 'kimi'
- [ ] Verify TypeScript compilation
- [ ] Review changes for correctness

## Success Criteria

### Definition of Done
- [x] Providers type includes 'kimi'
- [x] DEFAULT_CONFIG has kimi configuration
- [x] VALID_PROVIDERS includes 'kimi'
- [x] TypeScript compiles without errors
- [x] No breaking changes to existing providers
- [x] Code follows existing conventions

### Validation Methods
1. **Type Check**: Run `npm run build` or `tsc --noEmit`
2. **Visual Inspection**: Compare with existing provider patterns
3. **Manual Test**: Try `cs config -p kimi` (in later phase)

## Risk Assessment

### Potential Issues
1. **TypeScript compilation errors**: Low risk - simple type addition
2. **Breaking existing functionality**: Very low - additive only
3. **Merge conflicts**: Low - small file change

### Mitigation Strategies
1. Follow exact pattern of existing providers
2. Maintain alphabetical ordering
3. Run TypeScript compiler after changes
4. Review diff before committing

## Security Considerations

### Auth/Authorization
- Auth token starts empty (secure default)
- Follows same pattern as other providers
- No hardcoded credentials

### Data Protection
- No sensitive data in this phase
- Configuration follows existing security model

## Next Steps

After completion:
1. Proceed to Phase 02: Update Documentation
2. Update README.md with Kimi provider info
3. Add usage examples

## Unresolved Questions
None - requirements are clear and implementation is straightforward.
