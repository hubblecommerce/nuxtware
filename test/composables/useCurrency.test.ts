import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// The central test seam for the cache-rework effort: mock
// useShopwareContext().apiClient.invoke and assert which Store-API operation
// string (which encodes the operation name, HTTP method and path) a read
// chooses for a given input. Every downstream read ticket reuses this pattern.
const invoke = vi.fn()

vi.mock('#imports', () => ({
    ref,
    useShopwareContext: () => ({
        apiClient: { invoke }
    }),
    useContext: () => ref([]),
    useCookie: () => ref(undefined)
}))

// Imported after vi.mock so the mocked `#imports` is in place.
const { useCurrency } = await import('#nuxtware/composables/useCurrency')

describe('useCurrency', () => {
    beforeEach(() => {
        invoke.mockReset()
        invoke.mockResolvedValue([])
    })

    it('reads available currencies via the readCurrency POST operation', async () => {
        const { getAvailableCurrencies } = useCurrency()

        await getAvailableCurrencies()

        expect(invoke).toHaveBeenCalledTimes(1)

        const [operation] = invoke.mock.calls[0]!
        // Operation string format: "<operationName> <method> <path>"
        const [operationName, method, path] = (operation as string).split(' ')

        expect(operationName).toBe('readCurrency')
        expect(method).toBe('post')
        expect(path).toBe('/currency')
    })
})
