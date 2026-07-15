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
  compatibilityDate: '2026-03-01',
  // Layer dev only
  typescript: {
    tsConfig: {
      // Type-check the unit tests too: `nuxt typecheck` only covers `test/nuxt/**`
      // by default, so our root-level `test/**` specs are otherwise invisible to
      // the CLI gate (and get checked against the minimal Vitest stubs in the IDE
      // instead of the real Nuxt types). Path is relative to the build dir.
      include: ['../../test/**/*'],
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
