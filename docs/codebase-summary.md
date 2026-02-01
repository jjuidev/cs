# Codebase Summary - cs (Claude Switch) CLI

## Overview

The cs CLI is a TypeScript-based command-line tool for managing multiple Claude API providers. The codebase follows a modular architecture with clear separation of concerns between CLI interface, configuration management, shell integration, and action handlers.

## Directory Structure

```
src/
├── cli/                    # CLI interface and actions
│   ├── actions/           # Command action handlers
│   │   ├── config-action-handler.ts    # Handle `cs config` command
│   │   ├── current-action-handler.ts   # Handle `cs current` command
│   │   ├── list-action-handler.ts       # Handle `cs list` command
│   │   └── switch-action-handler.ts     # Handle `cs <provider>` command
│   ├── claude-settings-updater.ts       # Update ~/.claude/settings.json
│   └── cs-cli.ts          # Main CLI entry point
├── config/                # Configuration management
│   ├── config-storage-manager.ts    # Settings file operations
│   └── default-config.ts             # Default provider configurations
├── shell/                 # Shell integration
│   ├── shell-integration-manager.ts  # Shell RC file management
│   └── shell-types.ts               # Shell type definitions
├── types/                 # TypeScript type definitions
│   └── cs-cli-options.ts           # CLI option interfaces
└── index.ts               # Main entry point (for library usage)
```

## Key Components

### 1. CLI Interface (`src/cli/`)

#### Main Entry Point (`cs-cli.ts`)
- Uses Commander.js for CLI parsing
- Defines commands: config, list, current, switch
- Handles command validation and error reporting
- Provides help text and examples

#### Action Handlers (`actions/`)
Each command has its own action handler:

- **config-action-handler.ts**: Updates provider configurations with CLI options
- **switch-action-handler.ts**: Switches between providers, updates both Claude settings and shell exports
- **list-action-handler.ts**: Lists all configured providers with their settings
- **current-action-handler.ts**: Shows the currently active provider

#### Claude Settings Updater (`claude-settings-updater.ts`)
- Updates `~/.claude/settings.json` file
- Merges with existing settings if they exist
- Creates parent directories if needed
- Handles JSON serialization safely

### 2. Configuration Management (`src/config/`)

#### Default Config (`default-config.ts`)
- Defines four supported providers: claude, claudible, jjuidev, z
- Each provider has specific base URLs and model configurations
- Provides type validation for provider names
- Includes default model mappings for each provider

#### Config Storage Manager (`config-storage-manager.ts`)
- Manages settings in `~/.cs/settings.json`
- Handles initialization with default values
- Provides methods for: load, save, get, update, and current provider operations
- Ensures configuration directory exists
- Handles JSON parsing errors gracefully

### 3. Shell Integration (`src/shell/`)

#### Shell Integration Manager (`shell-integration-manager.ts`)
- Detects shell type (bash, zsh, fish) automatically
- Updates shell RC files with environment exports
- Manages configuration blocks with markers for easy updates
- Supports sourcing shell configuration immediately

#### Shell Types (`shell-types.ts`)
- Defines ShellType enum ('bash', 'zsh', 'fish', 'unknown')
- Defines ShellInfo interface for shell detection results
- Includes marker constants for configuration blocks

### 4. Type Definitions (`src/types/`)

#### CLI Options (`cs-cli-options.ts`)
- Defines `ConfigOptions` interface for configuration command parameters
- Includes optional properties for: provider, token, url, opus, sonnet, haiku

## Architecture Patterns

### 1. Command Pattern
- Each CLI command is handled by a separate action handler
- Clear separation of command parsing from business logic
- Easy to extend with new commands

### 2. Strategy Pattern
- Shell integration uses different strategies for different shells
- Provider configurations can be extended with custom strategies

### 3. Singleton Pattern
- ConfigStorageManager uses static methods for state management
- Ensures single source of truth for configuration

### 4. Module Pattern
- Each module has clear responsibilities and interfaces
- Clean separation between CLI, config, and shell layers

## Data Flow

### Configuration Update Flow
1. User runs `cs config -p provider -t token`
2. `config-action-handler.ts` validates provider
3. ConfigStorageManager loads existing settings
4. Updates specific provider configuration
5. Saves settings to `~/.cs/settings.json`

### Provider Switch Flow
1. User runs `cs <provider>`
2. `switch-action-handler.ts` validates provider
3. Gets provider configuration from ConfigStorageManager
4. Updates Claude settings via `claude-settings-updater.ts`
5. Updates shell environment exports
6. Sets current provider in configuration
7. Sources shell configuration (if successful)

## Error Handling

### Common Error Scenarios
- **Invalid provider**: Shows list of valid providers
- **Missing token**: Warns user and shows command to set token
- **File not found**: Gracefully handles missing config files
- **Permission issues**: Provides helpful error messages

### Error Recovery
- Falls back to default configuration if parsing fails
- Creates missing directories automatically
- Handles shell detection failures gracefully

## Build System

### Build Configuration (`tsup.config.ts`)
- Multi-format build: CJS, ESM, TypeScript declarations
- Tree-shaking for optimal bundle size
- Source map generation for debugging
- Automatic type generation

### Output Structure
```
dist/
├── cjs/          # CommonJS build
├── esm/          # ES Module build
├── types/        # TypeScript declarations
└── cli/          # CLI executable
```

## Dependencies

### Runtime Dependencies
- `commander`: CLI argument parsing
- `consola`: Structured logging

### Development Dependencies
- `@changesets/cli`: Version management
- `tsup`: Build tool
- `typescript`: Type checking

## Security Considerations

### Token Management
- Tokens are stored locally in configuration files
- Display is masked (shows only last 4 characters)
- No network transmission of tokens
- File permissions respected (user-readable only)

### Environment Variables
- Updates environment variables in shell RC files
- Uses marker system to manage configuration blocks
- Safe replacement of existing configurations

## Performance Characteristics

### File I/O
- Minimal file operations (read once, write once per command)
- Efficient JSON parsing with error handling
- Directory creation on-demand

### Memory Usage
- Lightweight object structures
- No persistent connections
- Clean separation of concerns

### Execution Speed
- Fast CLI parsing with Commander.js
- Synchronous file operations for simplicity
- Quick validation and error handling

## Extensibility Points

### Adding New Providers
1. Add to Providers type in `default-config.ts`
2. Add configuration in DEFAULT_CONFIG
3. Update validation in `isValidProvider`
4. No CLI changes needed

### Adding New Commands
1. Add command to `cs-cli.ts`
2. Create action handler in `actions/`
3. Add type definitions if needed
4. Update help text and examples

### Adding New Shell Support
1. Add case to `detectShell()` in shell-integration-manager.ts
2. Update RC file path and source command
3. Test with actual shell environment

## Testing Strategy

### Unit Testing
- Test each action handler with mock configurations
- Test configuration storage with mock file system
- Test shell integration with mock shell detection
- Test validation functions with various inputs

### Integration Testing
- Test complete command flows
- Test file creation and modification
- Test error scenarios and recovery

## Code Quality

### TypeScript
- Strict type checking enabled
- Clear interfaces and type definitions
- No any types except where necessary
- Proper null/undefined handling

### Code Style
- Consistent naming conventions
- Clear function and variable names
- Appropriate error handling
- Helpful comments for complex logic

### Linting
- ESLint configured for code quality
- Prettier for consistent formatting
- Pre-commit hooks to maintain standards