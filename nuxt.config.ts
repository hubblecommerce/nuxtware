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
        file: 'en-GB.ts',
        // localeId: '018f2b868f7d73438b6a861fffdaf1d5'
      },
      {
        code: 'de',
        file: 'de-DE.ts',
        // localeId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
      }
    ],
  },
})
