import { fileURLToPath } from 'node:url'

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
      // Required for consumer: process.env needs to be set for prod builds
      shopware: {
        endpoint: process.env.NUXT_PUBLIC_SHOPWARE_ENDPOINT,
        accessToken: process.env.NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN,
        devStorefrontUrl: process.env.NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL,
      }
    },
  },
  eslint: {
    config: {
      // Layer dev only: use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url))
    }
  },
  // Required for consumer: to make components auto-import work
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
  // Required for consumer to set individual localeId
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
  compatibilityDate: '2025-01-09',
  // Layer dev only
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@shopware-pwa/helpers-next': ['../../node_modules/@shopware-pwa/helpers-next/dist'],
        }
      },
    }
  },
})
