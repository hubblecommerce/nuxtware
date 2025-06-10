// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createResolver } from '@nuxt/kit'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'

const currentDir = dirname(fileURLToPath(import.meta.url))
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  imports: {
    dirs: [
        // auto import composables
        join(currentDir, 'node_modules/@shopware/composables/src'),
        // auto import types
        'types/*.{ts,tsx}',
    ],
  },
  modules: [
    '@shopware/nuxt-module',
    '@nuxt/eslint',
    '@nuxtjs/i18n'
  ],
  css: [
    // needs to be relative to work and to be able to be overridden by consumer instance
    './app/assets/styles/main.css',
  ],
  alias: {
    // alias to import files from layer, e.g. when consumer instance overrides main.css
    '#hubble': fileURLToPath(new URL('./app', import.meta.url))
  },
  hooks: {
    'build:before': () => {
      // Layer patches consumer's CSS to include absolute paths
      const consumerCssPath = resolve(process.cwd(), 'app/assets/styles/main.css')

      if (fs.existsSync(consumerCssPath)) {
        const content = fs.readFileSync(consumerCssPath, 'utf8')
        const layerPath = resolve('./app').replace(/\\/g, '/')

        const updated = content.replace(
          '@source \'#hubble\';',
          `@source '${layerPath}';`
        )

        if (content !== updated) {
          fs.writeFileSync(consumerCssPath, updated)
          console.log('✅ Layer: TailwindCSS paths resolved')
        }
      }
    }
  },
  i18n: {
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
    vueI18n: './config',
    langDir: './src/langs/',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        file: 'en-GB.ts'
      },
      {
        code: 'de',
        file: 'de-DE.ts'
      }
    ],
  },
})
