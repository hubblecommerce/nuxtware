import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    expectCacheableGet,
    parseInvokeCall,
    decodeCriteria,
} from './helpers/cacheableRead'

// Seam: useShopwareContext().apiClient.invoke, mocked to flip cacheableReads.
const { invoke, ctx } = vi.hoisted(() => ({
    invoke: vi.fn(),
    ctx: { cacheableReads: true },
}))

vi.mock('#imports', () => ({
    useShopwareContext: () => ({ apiClient: { invoke }, cacheableReads: ctx.cacheableReads }),
}))

vi.mock('@shopware/composables', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@shopware/composables')>()
    const { ref } = await import('vue')
    return {
        ...actual,
        useCategory: () => ({ category: ref({ id: 'cat1' }) }),
    }
})

// createListingComposable's provide/inject need a component; back them with a map.
vi.mock('vue', async (importOriginal) => {
    const vueActual = await importOriginal<typeof import('vue')>()
    const store = new Map<unknown, unknown>()
    return {
        ...vueActual,
        provide: (key: unknown, value: unknown) => { store.set(key, value) },
        inject: (key: unknown, fallback?: unknown) => (store.has(key) ? store.get(key) : fallback),
    }
})

// createInjectionState needs a live component; swap it for a module-local store.
vi.mock('@vueuse/core', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@vueuse/core')>()
    return {
        ...actual,
        createInjectionState: (composable: (...args: unknown[]) => unknown) => {
            let state: unknown
            return [
                (...args: unknown[]) => { state = composable(...args); return state },
                () => state,
            ]
        },
    }
})

const { createCategoryListingContext, useCategoryListing } =
    await import('#nuxtware/composables/useCategoryListing')

const LISTING_PATH = '/product-listing/{categoryId}'

function listing () {
    createCategoryListingContext(null)
    return useCategoryListing()
}

beforeEach(() => {
    invoke.mockReset()
    invoke.mockResolvedValue({ data: { elements: [], page: 1 } })
    ctx.cacheableReads = true
})

describe('Interactive category listing chooses GET/POST by the allow-list', () => {
    it('?p=1&limit=15&order=… → cacheable GET (readProductListingGet)', async () => {
        await listing().search({ p: 1, limit: 15, order: 'topseller' })

        const call = expectCacheableGet(invoke, {
            operationName: 'readProductListingGet',
            path: LISTING_PATH,
        })
        expect(call.method).toBe('get')
        expect(call.options?.pathParams).toEqual({ categoryId: 'cat1' })

        const criteria = decodeCriteria(call.options!.query!._criteria as string) as Record<string, unknown>
        expect(criteria).toMatchObject({ p: 1, limit: 15, order: 'topseller' })
    })

    it('filter click (properties) → POST (readProductListing), not cached', async () => {
        await listing().search({ properties: 'red' })

        const call = parseInvokeCall(invoke.mock.calls.at(-1)!)
        expect(String(invoke.mock.calls.at(-1)![0])).toBe('readProductListing post /product-listing/{categoryId}')
        expect(call.method).toBe('post')
        expect(call.options?.body).toMatchObject({ properties: 'red' })
        expect(call.options?.query).toBeUndefined()
    })

    it('cacheableReads: false → always POST, even for ?p=2', async () => {
        ctx.cacheableReads = false

        await listing().search({ p: 2 })

        expect(parseInvokeCall(invoke.mock.calls.at(-1)!).method).toBe('post')
    })

    it('sends byte-identical criteria whether GET or POST — method only affects cacheability', async () => {
        ctx.cacheableReads = true
        await listing().search({ p: 2 })
        const getCall = expectCacheableGet(invoke, { operationName: 'readProductListingGet' })
        const getCriteria = decodeCriteria(getCall.options!.query!._criteria as string)

        invoke.mockClear()
        ctx.cacheableReads = false
        await listing().search({ p: 2 })
        const postCall = parseInvokeCall(invoke.mock.calls.at(-1)!)

        expect(postCall.method).toBe('post')
        expect(postCall.options?.body).toEqual(getCriteria)
    })
})
