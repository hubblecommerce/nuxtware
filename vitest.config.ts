import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Unit tests run in plain Node (no full Nuxt runtime) for speed and determinism.
// Nuxt virtual modules (#imports, #app, #shopware) are auto-imports that only
// exist inside a built Nuxt app, so they are aliased to lightweight test stubs
// here. The primary seam — useShopwareContext().apiClient.invoke — is provided
// by those stubs and overridden per-test via vi.mock/vi.fn.
export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.{test,spec}.ts'],
        setupFiles: ['./test/setup.ts'],
        globals: true
    },
    resolve: {
        alias: {
            // Mirror the `#nuxtware` layer alias declared in nuxt.config.ts so
            // tests can import composables the same way app code does.
            '#nuxtware': fileURLToPath(new URL('./app', import.meta.url)),
            '#imports': fileURLToPath(new URL('./test/stubs/imports.ts', import.meta.url)),
            '#app': fileURLToPath(new URL('./test/stubs/app.ts', import.meta.url)),
            '#shopware': fileURLToPath(new URL('./test/stubs/shopware.ts', import.meta.url))
        }
    }
})
