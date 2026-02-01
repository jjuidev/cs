# System Architecture - cs (Claude Switch) CLI

## Overview

The cs CLI follows a clean, modular architecture designed for simplicity, maintainability, and extensibility. The system is built with TypeScript and separates concerns into distinct layers: CLI interface, configuration management, shell integration, and action handlers.

## Architectural Principles

### 1. Separation of Concerns
- **CLI Layer**: Handles user input and command parsing
- **Action Layer**: Implements business logic for each command
- **Config Layer**: Manages persistent data storage
- **Shell Layer**: Handles environment integration

### 2. Single Responsibility
- Each module has a single, well-defined purpose
- Clear interfaces between components
- Easy to test and modify individual parts

### 3. Layered Architecture
```
User Interface (CLI)
    ↓
Action Handlers
    ↓
Configuration Management
    ↓
Shell Integration
    ↓
File System
```

## High-Level Architecture

### Component Diagram
```
┌─────────────────┐    ┌─────────────────┐
│   CLI Interface │    │   Action Layer  │
│                │    │                │
│ • cs-cli.ts    │───→│ • config-action │
│ • Commands     │    │ • switch-action │
│ • Help/Usage   │    │ • list-action   │
│ • Validation   │    │ • current-action│
└─────────────────┘    └─────────────────┘
         ↓
┌─────────────────┐
│ Config Layer    │
│                │
│ • Storage Mgr   │
│ • Default Config│
│ • Type System   │
└─────────────────┘
         ↓
┌─────────────────┐
│ Shell Layer     │
│                │
│ • Shell Detect  │
│ • Env Exports   │
│ • RC File Mgmt  │
└─────────────────┘
         ↓
┌─────────────────┐
│ File System     │
│                │
│ • ~/.cs/settings│
│ • ~/.claude/settings│
│ • Shell RC files│
└─────────────────┘
```

## Detailed Component Breakdown

### 1. CLI Interface Layer

#### Responsibilities
- Parse command-line arguments
- Validate input parameters
- Display help and usage information
- Route to appropriate action handlers

#### Key Components
- **cs-cli.ts**: Main CLI entry point using Commander.js
- **Commands**: Four main commands with sub-options
- **Validation**: Input validation and error handling

#### Data Flow
```
User Input → Commander.js → Validation → Action Handler
```

#### Example
```typescript
program
  .command('config')
  .requiredOption('-p, --provider <provider>')
  .option('-t, --token <token>')
  .action(configAction)
```

### 2. Action Layer

#### Responsibilities
- Implement business logic for each command
- Coordinate between configuration and shell layers
- Handle error scenarios and user feedback
- Maintain state consistency

#### Key Components
- **config-action-handler.ts**: Update provider configurations
- **switch-action-handler.ts**: Switch between providers
- **list-action-handler.ts**: List available providers
- **current-action-handler.ts**: Show current provider

#### Data Flow
```
Action Handler → Config Layer → Shell Layer → User Feedback
```

#### Example Switch Action Flow
1. Validate provider name
2. Get provider configuration
3. Update Claude settings file
4. Update shell environment exports
5. Set current provider
6. Provide user feedback

### 3. Configuration Layer

#### Responsibilities
- Manage persistent settings storage
- Handle default configurations
- Provide type-safe configuration access
- Ensure data integrity

#### Key Components
- **ConfigStorageManager**: Handles all file operations
- **default-config.ts**: Defines provider configurations and types
- **Type System**: TypeScript types for configuration

#### Storage Architecture
```
~/.cs/settings.json
{
  "providers": {
    "claude": { ... },
    "claudible": { ... },
    "jjuidev": { ... },
    "z": { ... }
  },
  "current": "claude"
}
```

#### Data Access Pattern
```typescript
// Load settings
const settings = ConfigStorageManager.loadSettings()

// Update provider
ConfigStorageManager.updateProvider(provider, updates)

// Get current
const current = ConfigStorageManager.getCurrentProvider()
```

### 4. Shell Integration Layer

#### Responsibilities
- Detect shell environment
- Manage shell configuration files
- Export environment variables
- Provide immediate shell integration

#### Key Components
- **ShellIntegrationManager**: Main shell integration logic
- **shell-types.ts**: Shell type definitions
- **Detection**: Automatic shell type detection

#### Shell Support Matrix
| Shell Type | RC File | Detection Method | Support Status |
|------------|---------|------------------|----------------|
| zsh        | ~/.zshrc | process.env.SHELL | ✅ Full |
| bash       | ~/.bashrc | process.env.SHELL | ✅ Full |
| fish       | ~/.config/fish/config.fish | process.env.SHELL | ✅ Full |
| unknown    | ~/.zshrc | Fallback | ⚠️ Basic |

#### Configuration Pattern
```typescript
// Marker-based configuration
${CS_MARKER}
export ANTHROPIC_BASE_URL="${baseUrl}"
export ANTHROPIC_AUTH_TOKEN="${token}"
${CS_END_MARKER}
```

## Design Patterns Used

### 1. Command Pattern
- Each CLI command is encapsulated in its own action handler
- Clear separation between command parsing and execution
- Easy to extend with new commands

### 2. Singleton Pattern
- ConfigStorageManager uses static methods for state management
- Ensures single source of truth for configuration
- No need for instantiation

### 3. Strategy Pattern
- Different shell types use different configuration strategies
- Easy to add support for new shell types
- Consistent interface across strategies

### 4. Observer Pattern
- Configuration changes trigger shell updates
- Layered components react to state changes
- Immediate user feedback

## Data Flow Analysis

### Configuration Update Flow
1. User executes: `cs config -p claude -t sk-xxx`
2. CLI parser validates arguments
3. config-action-handler.ts validates provider
4. ConfigStorageManager loads existing settings
5. Updates specific provider configuration
6. Saves settings to ~/.cs/settings.json
7. Displays success message

### Provider Switch Flow
1. User executes: `cs claude`
2. CLI parser validates provider argument
3. switch-action-handler.ts validates provider
4. ConfigStorageManager gets provider configuration
5. Claude settings updated in ~/.claude/settings.json
6. Shell environment exported to ~/.zshrc (or other RC file)
7. Current provider updated in ~/.cs/settings.json
8. Shell configuration sourced (if successful)
9. Success message displayed

### List Flow
1. User executes: `cs list`
2. list-action-handler.ts loads settings
3. Iterates through all providers
4. Formats output with current provider marked
5. Displays provider list with configuration details

## Error Handling Architecture

### Error Categories
1. **Input Validation Errors**
   - Invalid provider names
   - Missing required options
   - Invalid token formats

2. **File System Errors**
   - Missing configuration directories
   - Permission issues
   - Corrupted configuration files

3. **Shell Integration Errors**
   - Shell detection failures
   - RC file access issues
   - Environment export failures

### Error Handling Strategy
```typescript
// Validation errors
if (!isValidProvider(provider)) {
  consola.error(`Invalid provider: ${provider}`)
  consola.info(`Valid providers: ${VALID_PROVIDERS.join(', ')}`)
  process.exit(1)
}

// File system errors
try {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
} catch (error) {
  consola.error('Failed to read settings file:', error.message)
  return getDefaultSettings()
}

// Shell integration errors
try {
  ShellIntegrationManager.sourceShell()
} catch {
  consola.warn('Please restart your shell or run: source ~/.zshrc')
}
```

## Security Architecture

### Security Principles
1. **Least Privilege**: Only necessary file access
2. **Data Protection**: Sensitive data handling
3. **Input Validation**: All user inputs validated
4. **Secure Storage**: Local storage only

### Token Security
- Storage: Encrypted in future versions
- Display: Masked (shows only last 4 characters)
- Transmission: None (local operations only)
- Permissions: User-readable only

### Environment Security
- Variables exported with proper quoting
- Path validation prevents directory traversal
- Configuration markers prevent conflicts
- Clean separation of user data

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Configuration loaded on demand
2. **Caching**: Settings cached during command execution
3. **Minimize I/O**: Single read/write operations
4. **Efficient Parsing**: JSON parsing with error handling

### Resource Management
- **Memory**: Lightweight objects, no persistent connections
- **Files**: Minimal file operations, handle errors gracefully
- **CPU**: Simple operations, fast execution

## Extensibility Architecture

### Adding New Providers
1. Add to `Providers` type in `default-config.ts`
2. Add configuration in `DEFAULT_CONFIG`
3. Update validation in `isValidProvider`
4. No CLI changes needed

### Adding New Commands
1. Add command definition in `cs-cli.ts`
2. Create action handler in `actions/`
3. Add type definitions if needed
4. Update help text and examples

### Adding New Shell Support
1. Add case to `detectShell()` method
2. Update RC file path and source command
3. Test with actual shell environment
4. Update documentation

## Testing Architecture

### Test Strategy
1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **End-to-End Tests**: Test complete command flows
4. **Error Scenarios**: Test failure modes

### Test Coverage Areas
- CLI argument parsing
- Configuration file operations
- Shell integration logic
- Error handling paths
- Edge cases and boundary conditions

## Deployment Architecture

### Build Process
1. **Source Code**: TypeScript in `src/` directory
2. **Build Tool**: tsup for multi-format builds
3. **Outputs**: CJS, ESM, TypeScript declarations
4. **CLI Entry**: Distilled to single executable

### Distribution Model
- **Package**: Published to npm as `@jjuidev/cs`
- **Installation**: Global or local installation
- **Dependencies**: Minimal runtime dependencies
- **Updates**: Semantic versioning with Changesets

## Monitoring and Maintenance

### Health Indicators
1. **Success Rate**: Command execution success percentage
2. **Error Rates**: Frequency and types of errors
3. **Performance**: Command execution times
4. **Usage Patterns**: Most common providers and commands

### Maintenance Tasks
1. **Dependency Updates**: Regular security updates
2. **Type System**: Keep types in sync with code
3. **Documentation**: Update with changes
4. **Performance**: Monitor and optimize bottlenecks

## Future Architecture Directions

### Phase 2 Enhancements
- **Configuration Validation**: Schema validation for configurations
- **GUI Interface**: Optional companion GUI application
- **Plugin System**: Extensible provider architecture
- **Advanced Security**: Encryption for sensitive data

### Phase 3 Enterprise Features
- **Multi-profile Support**: Multiple configuration profiles
- **Team Management**: Shared configurations
- **Audit Logging**: Configuration change tracking
- **Advanced Analytics**: Usage patterns and metrics