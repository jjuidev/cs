# Code Standards - cs (Claude Switch) CLI

## Overview

This document defines the coding standards and conventions used in the cs CLI codebase. These standards ensure code quality, maintainability, and consistency across the project.

## File Organization

### Directory Structure
```
src/
├── cli/                    # CLI interface components
├── config/                # Configuration management
├── shell/                 # Shell integration utilities
├── types/                 # TypeScript type definitions
└── index.ts               # Main entry point
```

### File Naming
- Use kebab-case for filenames: `my-file.ts`
- Match filename to functionality: `config-storage-manager.ts`
- Group related files in subdirectories

### File Size Limits
- Keep individual files under 200 lines
- Split large modules into logical components
- Use composition over inheritance

## TypeScript Standards

### Type System
- **Enable strict mode**: `tsconfig.json` with `"strict": true`
- **No any types**: Use specific types or `unknown` where necessary
- **Type interfaces**: Define clear interfaces for complex objects
- **Union types**: Use discriminated unions for variant types

### Type Definitions

#### Interface Naming
- Use PascalCase for interfaces: `ProviderConfig`, `ShellInfo`
- Add suffix `Config` for configuration objects
- Add suffix `Options` for CLI options
- Add suffix `Response` for API responses (if any)

#### Property Naming
- Use camelCase for properties: `baseUrl`, `authToken`
- Use UPPER_SNAKE_CASE for constants: `ANTHROPIC_BASE_URL`
- Prefix boolean properties with verbs: `hasToken`, `isEnabled`

#### Optional Properties
- Use `?` for truly optional properties
- Use default values for configuration that should always exist
- Document required vs optional properties in JSDoc

### Example Type Definition
```typescript
export interface ProviderConfig {
  ANTHROPIC_BASE_URL: string      // Required - API endpoint
  ANTHROPIC_AUTH_TOKEN: string   // Required - authentication token
  ANTHROPIC_DEFAULT_OPUS_MODEL: string  // Required - default model
  ANTHROPIC_DEFAULT_SONNET_MODEL: string  // Required - default model
  ANTHROPIC_DEFAULT_HAIKU_MODEL: string   // Required - default model
}
```

## Coding Conventions

### Naming Conventions

#### Variables and Functions
- **camelCase**: `getProvider`, `currentProvider`
- **Descriptive names**: `authToken` (not `at`)
- **Boolean variables**: `isLoaded`, `hasToken` (not `loaded`)

#### Constants
- **UPPER_SNAKE_CASE**: `VALID_PROVIDERS`, `CS_MARKER`
- **Export constants**: Use `export const` for public constants
- **Private constants**: Use `const` with underscore prefix: `_DEFAULT_CONFIG`

#### Classes
- **PascalCase**: `ConfigStorageManager`, `ShellIntegrationManager`
- **Clear names**: Avoid abbreviations unless well-known

### Function Standards

#### Function Structure
```typescript
export async function configAction(options: ConfigOptions): Promise<void> {
  // 1. Validate input
  if (!options.provider || !isValidProvider(options.provider)) {
    consola.error(`Invalid provider. Must be one of: ${VALID_PROVIDERS.join(', ')}`)
    process.exit(1)
  }

  // 2. Business logic
  const updates: Partial<Record<string, string>> = {}
  if (options.token !== undefined) updates.ANTHROPIC_AUTH_TOKEN = options.token

  // 3. Side effects
  ConfigStorageManager.updateProvider(options.provider, updates)

  // 4. User feedback
  consola.success(`Updated provider "${options.provider}" config`)
}
```

#### Error Handling
- Use try-catch for file operations
- Provide meaningful error messages
- Use appropriate exit codes
- Log errors with consola

#### Async Functions
- Use `async/await` instead of callbacks
- Handle Promise rejections
- Use proper return types: `Promise<void>`

### Class Standards

#### Static Methods
```typescript
export class ConfigStorageManager {
  private static CONFIG_DIR = path.join(os.homedir(), '.cs')

  static loadSettings(): CsSettings {
    // Implementation
  }

  static getProvider(provider: Providers): ProviderConfig {
    // Implementation
  }
}
```

#### Instance Methods (if needed)
- Use private methods for internal logic
- Keep public interface minimal
- Document public methods with JSDoc

## Error Handling

### Error Messages
- **Clear and specific**: "Invalid provider: xyz"
- **Include suggestions**: "Valid providers: claude, claudible, jjuidev, z"
- **Use consola**: `consola.error()`, `consola.warn()`, `consola.success()`

### Error Handling Patterns
```typescript
// File operations
try {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
} catch (error) {
  consola.error('Failed to read settings file:', error.message)
  return getDefaultSettings()
}

// Validation
if (!isValidProvider(provider)) {
  consola.error(`Invalid provider: ${provider}`)
  consola.info(`Valid providers: ${VALID_PROVIDERS.join(', ')}`)
  process.exit(1)
}

// User feedback without errors
if (!config.ANTHROPIC_AUTH_TOKEN) {
  consola.warn(`Warning: No auth token set for provider "${provider}"`)
  consola.info(`Set token with: cs config -p ${provider} -t <your-token>`)
}
```

## Logging Standards

### Consola Usage
```typescript
// Informational messages
consola.info('Available providers:')
consola.info('Processing configuration...')

// Success messages
consola.success('Updated ~/.claude/settings.json')
consola.success(`Switched to provider: ${provider}`)

// Warning messages
consola.warn('Please restart your shell or run: source ~/.zshrc')
consola.warn(`Warning: No auth token set for provider "${provider}"`)

// Error messages
consola.error('Invalid provider configuration')
consola.error('Failed to read settings file')
```

### Log Message Guidelines
- Be concise but informative
- Include relevant values (provider names, paths)
- Use consistent formatting
- Avoid sensitive information in logs (mask tokens)

## File Operations

### File Path Handling
```typescript
// Use path.join for cross-platform compatibility
const configDir = path.join(os.homedir(), '.cs')
const settingsFile = path.join(configDir, 'settings.json')

// Use path.basename for file names
const shellName = path.basename(process.env.SHELL || '')
```

### File Reading/Writing
```typescript
// Reading files
try {
  const content = fs.readFile(filePath, 'utf-8')
  return JSON.parse(content)
} catch (error) {
  // Handle error
}

// Writing files
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

// Directory creation
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}
```

## Command Line Interface Standards

### Commander.js Usage
```typescript
program
  .name('cs')
  .description('Claude provider switcher - Switch between different Claude API providers')
  .version(packageJson.version)

program
  .command('config')
  .description('Configure a provider (requires -p|--provider)')
  .requiredOption('-p, --provider <provider>', `Provider name: ${VALID_PROVIDERS.join(', ')}`)
  .option('-t, --token <token>', 'Auth token')
  .action(configAction)
```

### Help Text
- Include examples for complex commands
- List valid values for options
- Show usage examples

## Testing Standards

### Unit Test Structure
```typescript
import { describe, it, expect, vi } from 'vitest'
import { configAction } from './config-action-handler'
import { ConfigStorageManager } from '../../config/config-storage-manager'

describe('configAction', () => {
  it('should validate provider name', async () => {
    // Test
  })

  it('should update provider configuration', async () => {
    // Test
  })
})
```

### Test Coverage
- Cover all error scenarios
- Mock external dependencies (fs, process.exit)
- Test edge cases (empty files, invalid JSON)
- Test both success and failure paths

## Performance Considerations

### File I/O
- Minimize file reads/writes
- Cache frequently accessed data
- Use appropriate encoding (utf-8 for text)

### Memory Usage
- Avoid large object creation
- Use streaming for large files (if any)
- Clean up resources when done

### Optimization Techniques
- Use efficient data structures
- Avoid unnecessary string operations
- Use proper error handling instead of try-catch for expected flows

## Code Organization

### Module Exports
```typescript
// Named exports for functions
export async function switchAction(provider: string): Promise<void> {
  // Implementation
}

// Class exports
export class ConfigStorageManager {
  // Implementation
}

// Type exports
export type Providers = 'claude' | 'claudible' | 'jjuidev' | 'z'
```

### Imports
```typescript
// Absolute imports from src
import { ConfigStorageManager } from '../../config/config-storage-manager'
import type { ProviderConfig } from '../../config/default-config'
import consola from 'consola'

// Third-party imports
import path from 'node:path'
import os from 'node:os'
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Updates the current provider in the configuration
 * @param provider - The provider to set as current
 * @throws {Error} If provider is invalid
 */
export function setCurrentProvider(provider: Providers): void {
  // Implementation
}
```

### File Headers
```typescript
/**
 * @file src/cli/actions/switch-action-handler.ts
 * @description Handles the `cs <provider>` command implementation
 */
```

## Security Standards

### Input Validation
- Validate all user inputs
- Sanitize file paths
- Check for malicious provider names

### Data Protection
- Never log sensitive data (tokens)
- Use appropriate file permissions
- Validate file contents before parsing

## Build and Deployment

### Build Process
- Use tsup for multi-format builds
- Generate TypeScript declarations
- Include source maps for debugging

### Version Management
- Use semantic versioning
- Follow Changesets for version updates
- Update package.json version automatically

## Code Review Checklist

### Before Review
- [ ] All tests pass
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compilation passes
- [ ] Follows naming conventions
- [ ] Has appropriate error handling
- [ ] Includes JSDoc comments

### Review Focus Areas
- [ ] Code clarity and readability
- [ ] Error handling completeness
- [ ] Type safety
- [ ] Performance implications
- [ ] Security considerations
- [ ] Testing coverage

## Maintenance Guidelines

### Regular Tasks
- Update dependencies regularly
- Review and update TypeScript types
- Update documentation with code changes
- Monitor for security vulnerabilities

### Refactoring
- Refactor when adding new features
- Keep modules focused and small
- Update tests after refactoring
- Document breaking changes