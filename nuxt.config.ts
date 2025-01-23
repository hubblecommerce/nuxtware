// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createResolver } from '@nuxt/kit'

const currentDir = dirname(fileURLToPath(import.meta.url))
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  extends: [
    // usage of composables
    "@shopware-pwa/composables-next/nuxt-layer"
  ],
  imports: {
    dirs: [
        // auto import composables
        join(currentDir, "node_modules/@shopware-pwa/composables-next/src")
    ],
  },
  modules: [
    '@shopware-pwa/nuxt3-module',
    '@nuxt/eslint',
    '@nuxtjs/i18n'
  ],
  css: [
    // needs to be relative to work and to be able to be overridden by consumer instance
    './app/assets/styles/main.css',
  ],
  alias: {
    // alias to import files from layer, e.g. when consumer instance overrides main.css
    '#hubble': resolve('./app')
  },
  postcss: {
    // plugin order as tailwind recommends it
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    }
  },
  i18n: {
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
    vueI18n: './config',
    langDir: './src/langs/',
    defaultLocale: "de",
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
