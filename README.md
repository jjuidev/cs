# @jjuidev/cs

**cs (claude switch)** - CLI tool for switching between different Claude API providers.

## Features

- 🔧 **Provider Management**: Switch between Claude, Claudible, jjuidev, and z providers
- 📝 **Configuration Management**: Configure tokens, URLs, and models for each provider
- 🖥️ **Shell Integration**: Automatically exports environment variables to your shell
- 🎯 **Quick Switching**: Instant provider switching with `cs <provider>`
- 📊 **Provider Listing**: View all configured providers and their settings

## Quick Start

```bash
# Install the CLI
npm install -g @jjuidev/cs

# Or with other package managers
yarn global add @jjuidev/cs
pnpm add -g @jjuidev/cs
```

## Commands

### `cs <provider>` - Switch to Provider

Switch to a configured provider immediately.

```bash
# Switch to official Claude
cs claude

# Switch to z provider
cs z

# Switch to Claudible
cs claudible

# Switch to jjuidev
cs jjuidev
```

### `cs config -p <provider>` - Configure Provider

Configure provider settings including tokens, URLs, and models.

```bash
# Set authentication token
cs config -p claude -t sk-ant-api03-...

# Set custom base URL
cs config -p z -u https://api.z.ai/api/anthropic

# Set specific models
cs config -p claude -o claude-opus-4.5 -s claude-sonnet-4.5 -h claude-haiku-4.5

# Load default configuration
cs config -p claude
```

**Options:**

- `-p, --provider <provider>` - Provider name (required)
- `-t, --token <token>` - Authentication token
- `-u, --url <url>` - Custom base URL
- `-o, --opus <model>` - Opus model name
- `-s, --sonnet <model>` - Sonnet model name
- `-h, --haiku <model>` - Haiku model name

### `cs list` - List Providers

List all available providers and their current configurations.

```bash
cs list
# or
cs ls
```

**Output:**

```
→ claude:
    URL: https://api.anthropic.com
    Token: sk-ant-****1234
    Opus: claude-opus-4.5
    Sonnet: claude-sonnet-4.5
    Haiku: claude-haiku-4.5

  z:
    URL: https://api.z.ai/api/anthropic
    Token: not set
    Opus: GLM-4.7
    Sonnet: GLM-4.7
    Haiku: GLM-4.5-Air

Current provider: claude
```

### `cs current` - Show Current Provider

Display the currently active provider.

```bash
cs current
```

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

## Supported Providers

| Provider  | Base URL                       | Default Models                                                                               |
| --------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| claude    | https://api.anthropic.com      | claude-opus-4.5, claude-sonnet-4.5, claude-haiku-4.5                                         |
| claudible | https://claudible.io           | claude-opus-4.5, claude-sonnet-4.5, claude-haiku-4.5                                         |
| jjuidev   | https://ai.jjuidev.com         | gemini-claude-opus-4-5-thinking, gemini-claude-sonnet-4-5-thinking, gemini-claude-sonnet-4-5 |
| z         | https://api.z.ai/api/anthropic | GLM-4.7, GLM-4.7, GLM-4.5-Air                                                                |

## Configuration

### Storage Location

Configuration is stored in `~/.cs/settings.json`:

```json
{
	"providers": {
		"claude": {
			"ANTHROPIC_BASE_URL": "https://api.anthropic.com",
			"ANTHROPIC_AUTH_TOKEN": "sk-ant-api03-...",
			"ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4.5",
			"ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4.5",
			"ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4.5"
		},
		"z": {
			"ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
			"ANTHROPIC_AUTH_TOKEN": "",
			"ANTHROPIC_DEFAULT_OPUS_MODEL": "GLM-4.7",
			"ANTHROPIC_DEFAULT_SONNET_MODEL": "GLM-4.7",
			"ANTHROPIC_DEFAULT_HAIKU_MODEL": "GLM-4.5-Air"
		}
	},
	"current": "claude"
}
```

### Claude Code Integration

The CLI automatically updates `~/.claude/settings.json` for Claude Code integration:

```json
{
	"env": {
		"ANTHROPIC_BASE_URL": "https://api.anthropic.com",
		"ANTHROPIC_AUTH_TOKEN": "sk-ant-api03-...",
		"ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4.5",
		"ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4.5",
		"ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4.5"
	}
}
```

### Shell Integration

The CLI automatically updates your shell configuration file (`.zshrc`, `.bashrc`, or `.config/fish/config.fish`):

```bash
# cs marker - do not edit
export ANTHROPIC_BASE_URL="https://api.anthropic.com"
export ANTHROPIC_AUTH_TOKEN="sk-ant-api03-..."
# cs end marker
```

After switching providers, run `source ~/.zshrc` (or your shell equivalent) or restart your shell.

## Usage Examples

### Complete Setup Flow

1. **Install the CLI**

```bash
npm install -g @jjuidev/cs
```

2. **Configure a provider**

```bash
# Set up Claude provider
cs config -p claude -t sk-ant-api03-your-token-here

# Set up z provider
cs config -p z -t sk-ant-api03-another-token -u https://api.z.ai/api/anthropic
```

3. **List providers to verify**

```bash
cs list
```

4. **Switch providers**

```bash
# Switch to Claude
cs claude

# Switch to z
cs z
```

### Working with Multiple Providers

```bash
# Configure multiple providers
cs config -p claude -t sk-ant-api03-... -o claude-opus-4.5
cs config -p claudible -t sk-ant-api03-... -o claude-sonnet-4.5
cs config -p jjuidev -t sk-ant-api03-... -o gemini-claude-opus-4-5-thinking

# View all configurations
cs list

# Quickly switch between them
cs claude      # Use Claude
cs jjuidev     # Switch to jjuidev
cs claudible   # Switch to Claudible
```

## Troubleshooting

### Common Issues

**Provider not found**

```bash
cs invalid-provider
# Error: Invalid provider: invalid-provider
# Info: Valid providers: claude, claudible, jjuidev, z
```

**Missing token**

```bash
cs z
# Warning: No auth token set for provider "z"
# Info: Set token with: cs config -p z -t <your-token>
```

**Shell integration not working**

```bash
# After switching providers, restart your shell or run:
source ~/.zshrc  # for zsh
source ~/.bashrc # for bash
```

### Debug Mode

Enable debug logging for troubleshooting:

```bash
# Set debug environment variable
export DEBUG=cs:*

# Run commands with debug output
cs list
cs current
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/jjuidev/cs.git
cd cs

# Install dependencies
npm install

# Build the project
npm run build

# Test the build
node dist/cli/cs-cli.cjs --help
```

### Project Structure

```
src/
├── cli/                    # CLI interface
│   ├── actions/           # Command handlers
│   └── cs-cli.ts         # Main entry point
├── config/                # Configuration management
├── shell/                 # Shell integration
├── types/                 # TypeScript types
└── index.ts               # Library entry point
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Quick Start for Contributors

```bash
# Make your changes
npm run build

# Test your changes
npm install -g .
cs --help

# Create a changeset
npm run changeset

# Commit your changes
git commit -m "feat: your feature"
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

MIT

## Author

jjuidev <hi@jjuidev.com>
