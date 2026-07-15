import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    verifyCacheableRead,
    expectCacheableGet,
    parseInvokeCall,
    decodeCriteria,
} from './helpers/cacheableRead'
import { useLandingSearch } from '#nuxtware/composables/useLandingSearch'

// Seam: useShopwareContext().apiClient.invoke, mocked to flip cacheableReads.
const { invoke, ctx } = vi.hoisted(() => ({
    invoke: vi.fn(),
    ctx: { cacheableReads: true },
}))

vi.mock('#imports', () => ({
    useShopwareContext: () => ({ apiClient: { invoke }, cacheableReads: ctx.cacheableReads }),
}))

const searchOptions = { withCmsAssociations: true }
const LANDING_PATH = '/landing-page/{landingPageId}'

interface DecodedCriteria {
    associations?: Record<string, unknown>
}

beforeEach(() => {
    invoke.mockReset()
    invoke.mockResolvedValue({ data: { id: 'land1', cmsPage: { type: 'landingpage' } } })
    ctx.cacheableReads = true
})

describe('Landing-detail read chooses GET/POST by the listing-query allow-list', () => {
    it('no query → cacheable GET carrying its Criteria in query._criteria', async () => {
        const { call, result } = await verifyCacheableRead(
            invoke,
            () => useLandingSearch().search('land1', searchOptions),
            { operationName: 'readLandingPageGet', path: LANDING_PATH },
        )

        expect(call.method).toBe('get')
        expect(call.options?.pathParams).toEqual({ landingPageId: 'land1' })
        expect(result.cmsPage).toEqual({ type: 'landingpage' })
    })

    it('?p=2 → cacheable GET (pagination is in the allow-list)', async () => {
        const { call } = await verifyCacheableRead(
            invoke,
            () => useLandingSearch().search('land1', { ...searchOptions, query: { p: '2' } }),
            { operationName: 'readLandingPageGet', path: LANDING_PATH },
        )

        expect(call.method).toBe('get')
        const criteria = decodeCriteria(call.options!.query!._criteria as string) as Record<string, unknown>
        expect(criteria.p).toBe('2')
    })

    it('filter query (properties + min-price) → POST (not cached)', async () => {
        await useLandingSearch().search('land1', {
            ...searchOptions,
            query: { properties: 'red', 'min-price': '10' },
        })

        const call = parseInvokeCall(invoke.mock.calls.at(-1)!)
        expect(String(invoke.mock.calls.at(-1)![0])).toBe('readLandingPage post /landing-page/{landingPageId}')
        expect(call.method).toBe('post')
        expect(call.path).toBe(LANDING_PATH)
        expect(call.options?.body).toBeDefined()
        expect(call.options?.query).toBeUndefined()
    })

    it('cacheableReads: false → always POST, even for base and ?p=2', async () => {
        ctx.cacheableReads = false

        await useLandingSearch().search('land1', searchOptions)
        expect(parseInvokeCall(invoke.mock.calls.at(-1)!).method).toBe('post')

        invoke.mockClear()
        await useLandingSearch().search('land1', { ...searchOptions, query: { p: '2' } })
        expect(parseInvokeCall(invoke.mock.calls.at(-1)!).method).toBe('post')
    })

    it('sends byte-identical Criteria whether GET or POST — method only affects cacheability', async () => {
        ctx.cacheableReads = true
        await useLandingSearch().search('land1', { ...searchOptions, query: { p: '2' } })
        const getCall = expectCacheableGet(invoke, { operationName: 'readLandingPageGet' })
        const getCriteria = decodeCriteria(getCall.options!.query!._criteria as string)

        invoke.mockClear()
        ctx.cacheableReads = false
        await useLandingSearch().search('land1', { ...searchOptions, query: { p: '2' } })
        const postCall = parseInvokeCall(invoke.mock.calls.at(-1)!)

        expect(postCall.method).toBe('post')
        expect(postCall.options?.body).toEqual(getCriteria)
    })

    it('folds the cms associations into the Criteria under withCmsAssociations', async () => {
        await useLandingSearch().search('land1', searchOptions)

        const call = expectCacheableGet(invoke, { operationName: 'readLandingPageGet' })
        const criteria = decodeCriteria(call.options!.query!._criteria as string) as DecodedCriteria
        expect(Object.keys(criteria.associations ?? {})).toEqual(
            expect.arrayContaining(['media', 'cmsPage']),
        )
    })

    it('delegates search through the wrap-and-spread override', () => {
        expect(typeof useLandingSearch().search).toBe('function')
    })
})
