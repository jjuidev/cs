import { program } from 'commander'
import consola from 'consola'
import { configAction } from './actions/config-action-handler.js'
import { switchAction } from './actions/switch-action-handler.js'
import { listAction } from './actions/list-action-handler.js'
import { currentAction } from './actions/current-action-handler.js'
import { VALID_PROVIDERS } from '../config/default-config.js'
import packageJson from '../../package.json' with { type: 'json' }

program
	.name('cs')
	.description('Claude provider switcher - Switch between different Claude API providers')
	.version(packageJson.version)

program
	.command('config')
	.description('Configure a provider (requires -p|--provider)')
	.requiredOption('-p, --provider <provider>', `Provider name: ${VALID_PROVIDERS.join(', ')}`)
	.option('-t, --token <token>', 'Auth token')
	.option('-u, --url <url>', 'Base URL')
	.option('-o, --opus <model>', 'Opus model')
	.option('-s, --sonnet <model>', 'Sonnet model')
	.option('-h, --haiku <model>', 'Haiku model')
	.addHelpText(
		'after',
		`
Examples:
  $ cs config -p claude                                    # Load default config
  $ cs config -p claude -t sk-xxx                          # Set token
  $ cs config -p z -t sk-xxx -u https://api.z.ai          # Set token and URL
  $ cs config -p claude -o claude-opus-4.5 -s claude-sonnet-4.5  # Set models
  `
	)
	.action(configAction)

program
	.command('list')
	.alias('ls')
	.description('List all providers and their configurations')
	.action(listAction)

program
	.command('current')
	.description('Show current provider')
	.action(currentAction)

program
	.argument('[provider]', `Provider to switch to: ${VALID_PROVIDERS.join(', ')}`)
	.description('Switch to a provider')
	.option('--reset', 'Reset provider models to default values')
	.addHelpText(
		'after',
		`
Examples:
  $ cs claude           # Switch to claude
  $ cs z                # Switch to z
  $ cs claudible        # Switch to claudible
  $ cs --reset          # Reset current provider models and switch
  $ cs claude --reset   # Reset claude models and switch
  `
	)
	.action(switchAction)

program.parse()
