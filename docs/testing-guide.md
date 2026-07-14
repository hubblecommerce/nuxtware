# Testing Guide

Nuxtware uses [Vitest](https://vitest.dev/) for automated unit tests.

## Running tests

```bash
npm test          # run the suite once (used in CI)
npm run test:watch # watch mode for local development
```

`npm test` runs `nuxt prepare .playground` first (the `pretest` hook) so the
generated `.playground/.nuxt/tsconfig.json` — which the repo `tsconfig.json`
extends — exists in a fresh checkout. Tests themselves run in a plain Node
environment (no full Nuxt runtime) for speed and determinism.

## Layout

```
test/
  setup.ts                 # global Nuxt/Vue auto-import stubs (useCookie, ref, ...)
  tsconfig.json            # TS config for test files (independent of the Nuxt build)
  stubs/                   # stand-ins for Nuxt virtual modules
    imports.ts             # #imports  (useShopwareContext, useContext, useCookie, ...)
    app.ts                 # #app      (CookieRef type)
    shopware.ts            # #shopware (Schemas type)
  composables/
    useCurrency.test.ts    # reference example of the apiClient.invoke seam
```

Nuxt virtual modules (`#imports`, `#app`, `#shopware`) only exist inside a built
Nuxt app. In tests they are aliased to the lightweight stubs above (see
`vitest.config.ts`). Auto-imports that a composable references *without* an
explicit import (e.g. `useCookie`, `ref`) are provided as globals in
`test/setup.ts`.

## The primary seam: `apiClient.invoke`

Store-API reads go through `useShopwareContext().apiClient.invoke(operation, params)`.
The `operation` string encodes the operation name, HTTP method and path, e.g.
`"readCurrency post /currency"`. The central unit-testing technique for the
cache-rework effort is to **mock that `invoke`** and assert which operation
string (and therefore which method) a read chose for a given input — without
hitting a real API.

### Reference example

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

const invoke = vi.fn()

vi.mock('#imports', () => ({
    ref,
    useShopwareContext: () => ({ apiClient: { invoke } }),
    useContext: () => ref([]),
    useCookie: () => ref(undefined)
}))

// Import the composable *after* vi.mock so the mock is in place.
const { useCurrency } = await import('#nuxtware/composables/useCurrency')

describe('useCurrency', () => {
    beforeEach(() => {
        invoke.mockReset()
        invoke.mockResolvedValue([])
    })

    it('reads available currencies via the readCurrency POST operation', async () => {
        await useCurrency().getAvailableCurrencies()

        const [operation] = invoke.mock.calls[0]!
        const [operationName, method, path] = (operation as string).split(' ')

        expect(operationName).toBe('readCurrency')
        expect(method).toBe('post')
        expect(path).toBe('/currency')
    })
})
```

See `test/composables/useCurrency.test.ts` for the runnable version. Downstream
read tickets should follow this pattern: mock `invoke`, exercise the read, and
assert the chosen operation string and HTTP method.

## Integration tests

Real-API integration checks are intentionally kept **out of Vitest and out of
CI**. They are run manually as standalone TypeScript scripts against a real
Shopware instance, because CI has no access to a live store.
