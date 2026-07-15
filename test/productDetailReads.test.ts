import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    verifyCacheableRead,
    expectCacheableGet,
    parseInvokeCall,
    decodeCriteria,
} from './helpers/cacheableRead'
import { productDetailAssociations } from '#nuxtware/utils/productDetailAssociations'

// Single seam: the framework's useProductSearch reads useShopwareContext().apiClient.invoke
// and toggles GET/POST off `cacheableReads`. Mocking #imports lets us drive the real
// composable while flipping the flag per test.
const { invoke, ctx } = vi.hoisted(() => ({
    invoke: vi.fn(),
    ctx: { cacheableReads: true },
}))

vi.mock('#imports', () => ({
    useShopwareContext: () => ({ apiClient: { invoke }, cacheableReads: ctx.cacheableReads }),
}))

const { useProductSearch } = await import('@shopware/composables')

// The exact options the product-detail page passes; kept in one place so this
// test verifies what the component actually sends.
const searchOptions = { withCmsAssociations: true, associations: productDetailAssociations }

interface DecodedCriteria {
    associations?: Record<string, unknown>
}

beforeEach(() => {
    invoke.mockReset()
    invoke.mockResolvedValue({ data: { product: { id: 'p1' } } })
    ctx.cacheableReads = true
})

describe('Product-detail read issues a cacheable GET with associations in _criteria', () => {
    it('reads via readProductDetailGet carrying its Criteria in query._criteria', async () => {
        const { call } = await verifyCacheableRead(
            invoke,
            () => useProductSearch().search('p1', searchOptions),
            { operationName: 'readProductDetailGet', path: '/product/{productId}' },
        )

        expect(call.method).toBe('get')
        expect(call.options?.pathParams).toEqual({ productId: 'p1' })
    })

    it('folds withCmsAssociations plus manufacturer/media/cover into _criteria', async () => {
        await useProductSearch().search('p1', searchOptions)

        const call = expectCacheableGet(invoke, { operationName: 'readProductDetailGet' })
        const criteria = decodeCriteria(call.options!.query!._criteria as string) as DecodedCriteria

        expect(Object.keys(criteria.associations ?? {})).toEqual(
            expect.arrayContaining(['manufacturer', 'media', 'cover', 'cmsPage']),
        )
    })

    it('falls back to the POST variant when cacheableReads is off (baseline)', async () => {
        ctx.cacheableReads = false

        await useProductSearch().search('p1', searchOptions)

        const [operation] = invoke.mock.calls[0]!
        expect(String(operation)).toBe('readProductDetail post /product/{productId}')
    })

    it('sends the identical Criteria whether GET or POST — method only affects cacheability', async () => {
        ctx.cacheableReads = true
        await useProductSearch().search('p1', searchOptions)
        const getCall = expectCacheableGet(invoke, { operationName: 'readProductDetailGet' })
        const getCriteria = decodeCriteria(getCall.options!.query!._criteria as string)

        invoke.mockClear()
        ctx.cacheableReads = false
        await useProductSearch().search('p1', searchOptions)
        const postCall = parseInvokeCall(invoke.mock.calls.at(-1)!)

        expect(postCall.method).toBe('post')
        expect(postCall.options?.body).toEqual(getCriteria)
    })
})
