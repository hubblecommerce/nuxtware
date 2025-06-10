// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createResolver } from '@nuxt/kit'
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
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  hooks: {
    'nuxt:config': (nuxtConfig, nuxt) => {
      // Ensure layer's alias is available to consumer's TailwindCSS
      if (!nuxtConfig.alias) nuxtConfig.alias = {}
      nuxtConfig.alias['#hubble'] = fileURLToPath(new URL('./app', import.meta.url))

      // If consumer has TailwindCSS, make sure it can resolve #hubble alias
      nuxt.hook('vite:extend', ({ config }) => {
        if (config.plugins) {
          // Ensure Vite can resolve the alias for TailwindCSS
          config.resolve = config.resolve || {}
          config.resolve.alias = {
            ...config.resolve.alias,
            '#hubble': fileURLToPath(new URL('./app', import.meta.url))
          }
        }
      })
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
