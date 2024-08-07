import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	plugins: [],
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			formats: ['es']
		}
	},
	assetsInclude: ['**/*.wasm', '**/*.zkey']
})