import { describe, it, expect, vi, beforeEach } from 'vitest'
import { expectCacheableGet, verifyCacheableRead, parseInvokeCall } from './helpers/cacheableRead'

// Shared test seam. `#imports` is where both nuxtware composables and the
// framework composables (their TS `src` resolves here under Vitest) pick up
// `useShopwareContext`, so mocking it lets us drive a real flag-covered read
// while toggling `cacheableReads` per test.
const { invoke, ctx } = vi.hoisted(() => ({
    invoke: vi.fn(),
    ctx: { cacheableReads: true },
}))

vi.mock('#imports', () => ({
    useShopwareContext: () => ({ apiClient: { invoke }, cacheableReads: ctx.cacheableReads }),
}))

// Imported after vi.mock so the mocked `#imports` is in place.
const { useProductSearch } = await import('@shopware/composables')

beforeEach(() => {
    invoke.mockReset()
    invoke.mockResolvedValue({ data: { id: 'p1' } })
    ctx.cacheableReads = true
})

describe('cacheableRead verification helper', () => {
    it('parses an operation string into operation, method and path', () => {
        const parsed = parseInvokeCall(['readCategory get /category/{navigationId}', { query: {} }])

        expect(parsed.operationName).toBe('readCategory')
        expect(parsed.method).toBe('get')
        expect(parsed.path).toBe('/category/{navigationId}')
    })

    it('accepts a read that issued a GET carrying its Criteria in query._criteria', () => {
        invoke('readCategory get /category/{navigationId}', {
            pathParams: { navigationId: 'abc' },
            query: { _criteria: 'ENCODED' },
        })

        const call = expectCacheableGet(invoke, {
            operationName: 'readCategory',
            path: '/category/{navigationId}',
        })

        expect(call.method).toBe('get')
    })

    it('rejects a read that issued a POST with a body', () => {
        invoke('readCategory post /category/{navigationId}', {
            pathParams: { navigationId: 'abc' },
            body: { associations: {} },
        })

        expect(() => expectCacheableGet(invoke, { operationName: 'readCategory' })).toThrow()
    })

    it('rejects a GET that still sends a POST body instead of query._criteria', () => {
        invoke('readCategory get /category/{navigationId}', { body: { associations: {} } })

        expect(() => expectCacheableGet(invoke, { operationName: 'readCategory' })).toThrow()
    })

    it('allows a parameterless GET read when requireCriteria is false', () => {
        invoke('readLanguagesGet get /language')

        const call = expectCacheableGet(invoke, {
            operationName: 'readLanguagesGet',
            requireCriteria: false,
        })

        expect(call.method).toBe('get')
    })

    it('fails clearly when the expected operation was never invoked', () => {
        invoke('readProductDetail post /product/{productId}', { body: {} })

        expect(() => expectCacheableGet(invoke, { operationName: 'readCategory' })).toThrow()
    })

    it('verifyCacheableRead returns the read result for render assertions', async () => {
        const product = { id: 'p1', name: 'Test product' }
        const read = async () => {
            invoke('readProductDetailGet get /product/{productId}', {
                pathParams: { productId: 'p1' },
                query: { _criteria: 'ENCODED' },
            })
            return product
        }

        const { result, call } = await verifyCacheableRead(invoke, read, {
            operationName: 'readProductDetailGet',
            path: '/product/{productId}',
        })

        expect(result).toBe(product)
        expect(call.method).toBe('get')
    })
})

// End-to-end at the seam: with cacheableReads on, a real flag-covered catalog
// read (product-detail) must issue the cacheable GET variant — verified through
// the same helper the downstream read tickets reuse.
describe('flag-covered catalog reads issue GET when cacheableReads is on', () => {
    it('product-detail read issues readProductDetailGet with query._criteria', async () => {
        ctx.cacheableReads = true

        const { result, call } = await verifyCacheableRead(
            invoke,
            () => useProductSearch().search('p1', { withCmsAssociations: true }),
            { operationName: 'readProductDetailGet', path: '/product/{productId}' },
        )

        expect(call.options?.pathParams).toEqual({ productId: 'p1' })
        expect(result).toEqual({ id: 'p1' })
    })

    it('falls back to the POST variant when cacheableReads is off (baseline)', async () => {
        ctx.cacheableReads = false

        await useProductSearch().search('p1', { withCmsAssociations: true })

        const [operation] = invoke.mock.calls[0]!
        expect(String(operation)).toBe('readProductDetail post /product/{productId}')
    })
})
