// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  extends: [
    "@shopware-pwa/composables-next/nuxt-layer"
  ],
  imports: {
    dirs: [
        join(currentDir, "node_modules/@shopware-pwa/composables-next/src")
    ],
  },
  modules: [
    '@shopware-pwa/nuxt3-module',
    '@nuxt/eslint',
    '@nuxtjs/i18n'
  ],
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
