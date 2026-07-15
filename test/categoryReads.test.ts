import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    verifyCacheableRead,
    expectCacheableGet,
    parseInvokeCall,
    decodeCriteria,
} from './helpers/cacheableRead'
import { useCategorySearch } from '#nuxtware/composables/useCategorySearch'
import {
    isCacheableListingQuery,
    CACHEABLE_LISTING_PARAMS,
} from '#nuxtware/utils/isCacheableListingQuery'

// Seam: useShopwareContext().apiClient.invoke, mocked to flip cacheableReads.
const { invoke, ctx } = vi.hoisted(() => ({
    invoke: vi.fn(),
    ctx: { cacheableReads: true },
}))

vi.mock('#imports', () => ({
    useShopwareContext: () => ({ apiClient: { invoke }, cacheableReads: ctx.cacheableReads }),
}))

const searchOptions = { withCmsAssociations: true }
const CATEGORY_PATH = '/category/{navigationId}'

interface DecodedCriteria {
    associations?: { associations?: Record<string, unknown> }
}

beforeEach(() => {
    invoke.mockReset()
    invoke.mockResolvedValue({ data: { id: 'cat1', cmsPage: { type: 'page' } } })
    ctx.cacheableReads = true
})

describe('Category-detail read chooses GET/POST by the listing-query allow-list', () => {
    it('no query → cacheable GET carrying its Criteria in query._criteria', async () => {
        const { call, result } = await verifyCacheableRead(
            invoke,
            () => useCategorySearch().search('cat1', searchOptions),
            { operationName: 'readCategoryGet', path: CATEGORY_PATH },
        )

        expect(call.method).toBe('get')
        expect(call.options?.pathParams).toEqual({ navigationId: 'cat1' })
        expect(result.cmsPage).toEqual({ type: 'page' })
    })

    it('?p=2 → cacheable GET (pagination is in the allow-list)', async () => {
        const { call } = await verifyCacheableRead(
            invoke,
            () => useCategorySearch().search('cat1', { ...searchOptions, query: { p: '2' } }),
            { operationName: 'readCategoryGet', path: CATEGORY_PATH },
        )

        expect(call.method).toBe('get')
        const criteria = decodeCriteria(call.options!.query!._criteria as string) as Record<string, unknown>
        expect(criteria.p).toBe('2')
    })

    it('?p=1&limit=15&order=… → GET (all keys in the allow-list)', async () => {
        const { call } = await verifyCacheableRead(
            invoke,
            () => useCategorySearch().search('cat1', {
                ...searchOptions,
                query: { p: '1', limit: '15', order: 'topseller' },
            }),
            { operationName: 'readCategoryGet', path: CATEGORY_PATH },
        )

        expect(call.method).toBe('get')
    })

    it('filter query (properties + min-price) → POST (not cached)', async () => {
        await useCategorySearch().search('cat1', {
            ...searchOptions,
            query: { properties: 'red', 'min-price': '10' },
        })

        const call = parseInvokeCall(invoke.mock.calls.at(-1)!)
        expect(String(invoke.mock.calls.at(-1)![0])).toBe('readCategory post /category/{navigationId}')
        expect(call.method).toBe('post')
        expect(call.path).toBe(CATEGORY_PATH)
        expect(call.options?.body).toBeDefined()
        expect(call.options?.query).toBeUndefined()
    })

    it('a single non-allow-listed key forces POST even alongside allow-listed ones', async () => {
        await useCategorySearch().search('cat1', {
            ...searchOptions,
            query: { p: '2', properties: 'red' },
        })

        expect(parseInvokeCall(invoke.mock.calls.at(-1)!).method).toBe('post')
    })

    it('cacheableReads: false → always POST, even for base and ?p=2', async () => {
        ctx.cacheableReads = false

        await useCategorySearch().search('cat1', searchOptions)
        expect(parseInvokeCall(invoke.mock.calls.at(-1)!).method).toBe('post')

        invoke.mockClear()
        await useCategorySearch().search('cat1', { ...searchOptions, query: { p: '2' } })
        expect(parseInvokeCall(invoke.mock.calls.at(-1)!).method).toBe('post')
    })

    it('sends byte-identical Criteria whether GET or POST — method only affects cacheability', async () => {
        ctx.cacheableReads = true
        await useCategorySearch().search('cat1', { ...searchOptions, query: { p: '2' } })
        const getCall = expectCacheableGet(invoke, { operationName: 'readCategoryGet' })
        const getCriteria = decodeCriteria(getCall.options!.query!._criteria as string)

        invoke.mockClear()
        ctx.cacheableReads = false
        await useCategorySearch().search('cat1', { ...searchOptions, query: { p: '2' } })
        const postCall = parseInvokeCall(invoke.mock.calls.at(-1)!)

        expect(postCall.method).toBe('post')
        expect(postCall.options?.body).toEqual(getCriteria)
    })

    it('folds the cms associations into the Criteria under withCmsAssociations', async () => {
        await useCategorySearch().search('cat1', searchOptions)

        const call = expectCacheableGet(invoke, { operationName: 'readCategoryGet' })
        const criteria = decodeCriteria(call.options!.query!._criteria as string) as DecodedCriteria
        expect(Object.keys(criteria.associations?.associations ?? {})).toEqual(
            expect.arrayContaining(['media', 'cmsPage']),
        )
    })

    it('delegates everything but search to the core composable (wrap-and-spread)', () => {
        expect(typeof useCategorySearch().advancedSearch).toBe('function')
    })
})

describe('isCacheableListingQuery predicate + allow-list', () => {
    it('treats an empty or absent query as cacheable (base listing)', () => {
        expect(isCacheableListingQuery(undefined)).toBe(true)
        expect(isCacheableListingQuery({})).toBe(true)
    })

    it('is cacheable when every key is in the allow-list', () => {
        expect(isCacheableListingQuery({ p: '2' })).toBe(true)
        expect(isCacheableListingQuery({ p: '1', limit: '15', order: 'topseller' })).toBe(true)
    })

    it('is not cacheable when any key is outside the allow-list', () => {
        expect(isCacheableListingQuery({ properties: 'red' })).toBe(false)
        expect(isCacheableListingQuery({ p: '2', properties: 'red' })).toBe(false)
        expect(isCacheableListingQuery({ properties: 'red', 'min-price': '10' })).toBe(false)
    })

    it('bounds cache-safe listing params to pagination, limit and sorting', () => {
        expect([...CACHEABLE_LISTING_PARAMS].sort()).toEqual(['limit', 'order', 'p'])
    })
})
