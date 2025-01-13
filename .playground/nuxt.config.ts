import { fileURLToPath } from 'node:url'
import {join} from "path";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  extends: ['..'],
  modules: [
    '@nuxt/eslint',
  ],
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: 'https://sw663-playground.dmf-kunden.com/store-api/',
        accessToken: 'SWSCEKN2ZM5NTFZJYKXRRUD0YW',
        devStorefrontUrl: "https://sw663-playground.dmf-kunden.com"
        // endpoint: 'https://api.all4golf.com/store-api/',
        // accessToken: 'SWSCSNVQEVFIR1LGC0HOVKZJRA',
      }
    },
  },
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url))
    }
  },
  components: {
    dirs: [
      {
        path: "~/components",
        priority: 2,
      },
    ],
    global: true,
  },
  nitro: {
    // https://github.com/unjs/nitro/pull/449
    compressPublicAssets: true,
    devStorage: {
      cache: {
        driver: 'memory'
      }
    }
  },
  i18n: {
    defaultLocale: "de",
    locales: [
      {
        code: 'en',
        localeId: '255b788e742940abaa574181caf9d094'
      },
      {
        code: 'de',
        localeId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
      }
    ],
  },
  css: [ '~/assets/css/main.css' ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2025-01-09'
})
