// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@shopware/composables/nuxt-layer"],
  imports: {
    dirs: [
        // auto import types
        'types/*.{ts,tsx}',
    ],
  },
  modules: ['@shopware/nuxt-module', '@nuxt/eslint', '@nuxtjs/i18n', '@nuxt/image'],
  // Route anonymous catalog reads (SEO-URL, navigation, product-detail) through
  // their cacheable GET variants so a CACHE_REWORK Shopware backend can serve
  // them from its http_cache. Criteria is compressed into the `?_criteria`
  // query param; SSR still renders the full requested result — only cacheability
  // changes, never the rendered DOM. See docs/adr/0001-store-api-catalog-caching.md.
  shopware: {
    cacheableReads: true,
  },
  css: [
    // needs to be relative to work and to be able to be overridden by consumer instance
    './app/assets/styles/main.css',
  ],
  alias: {
    // alias to import files from layer, e.g. when consumer instance overrides main.css
    '#nuxtware': resolve('./app')
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