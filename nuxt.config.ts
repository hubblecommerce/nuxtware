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
  modules: ['@shopware/nuxt-module', '@nuxt/eslint', '@nuxtjs/i18n', '@nuxt/image'],
  css: [
    // needs to be relative to work and to be able to be overridden by consumer instance
    './app/assets/styles/main.css',
  ],
  alias: {
    // alias to import files from layer, e.g. when consumer instance overrides main.css
    '#hubble': resolve('./app')
  },
  vite: {
    plugins: [
      tailwindcss(),
    ]
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
    ]
  },
})