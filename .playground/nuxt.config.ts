import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
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
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
    }
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
  // Required for consumer to override types
  imports: {
    dirs: [
      // auto import types
      'types/*.{ts,tsx}',
    ],
  },
  nitro: {
    // Asset compression: https://github.com/unjs/nitro/pull/449
    compressPublicAssets: true,
    // Nuxt cache set to memory for testing purposes (default: dev = file, prod = memory)
    devStorage: {
      cache: {
        driver: 'memory'
      }
    }
  },
  // Required for consumer to set individual localeId
  i18n: {
    defaultLocale: 'en',
    bundle: {
      optimizeTranslationDirective: false,
    },
    locales: [
      {
        code: 'en',
        localeId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
      },
      {
        code: 'de',
        localeId: '0197405b01f370689447a63b7de2afd1'
      }
    ]
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
  vite: {
    optimizeDeps: {
      include: [
        '@vueuse/core',
        '@shopware/helpers',
        '@vueuse/shared',
        '@vueuse/integrations/useFocusTrap',
        '@shopware/api-client',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@intlify/shared',
        '@intlify/core-base',
        'scule'
      ]
    }
  }
})
