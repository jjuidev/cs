import { defineConfig, Options } from 'tsup'

import { chmodSync, writeFileSync } from 'fs'

const tsupConfig = defineConfig(() => {
	const base: Options = {
		entry: ['src/index.ts'],
		dts: false,
		clean: true,
		bundle: true,
		external: [/^node:/, 'events', 'fs', 'path', 'child_process', 'util']
	}

	const cjs: Options = {
		...base,
		platform: 'node',
		target: 'es2020',
		format: 'cjs',
		outDir: 'dist/cjs',
		tsconfig: 'tsconfig.cjs.json',
		onSuccess: async () => {
			writeFileSync('dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }, null, 2))
		}
	}

	const esm: Options = {
		...base,
		platform: 'node',
		target: 'esnext',
		format: 'esm',
		outDir: 'dist/esm',
		tsconfig: 'tsconfig.esm.json',
		onSuccess: async () => {
			writeFileSync('dist/esm/package.json', JSON.stringify({ type: 'module' }, null, 2))
		}
	}

	const types: Options = {
		...base,
		entry: ['src/index.ts'],
		platform: 'node',
		target: 'esnext',
		format: 'esm',
		dts: { only: true },
		outDir: 'dist/types',
		tsconfig: 'tsconfig.types.json'
	}

	const cli: Options = {
		entry: ['src/cli/cs-cli.ts'],
		platform: 'node',
		target: 'es2020',
		format: 'cjs',
		outDir: 'dist/cli',
		banner: {
			js: '#!/usr/bin/env node'
		},
		onSuccess: async () => {
			chmodSync('dist/cli/cs-cli.cjs', 0o755)
		}
	}

	return [cjs, esm, types, cli]
})

export default tsupConfig
