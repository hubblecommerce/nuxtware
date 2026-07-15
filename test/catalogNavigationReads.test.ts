import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Schemas } from '#shopware'
import { expectCacheableGet, verifyCacheableRead } from './helpers/cacheableRead'

const { invoke, ctx } = vi.hoisted(() => ({
    invoke: vi.fn(),
    ctx: { cacheableReads: true },
}))

vi.mock('#imports', async () => {
    const { ref, unref } = await import('vue')
    return {
        useShopwareContext: () => ({ apiClient: { invoke }, cacheableReads: ctx.cacheableReads }),
        useSessionContext: () => ({
            sessionContext: { value: { salesChannel: { navigationCategoryId: 'root-category' } } },
        }),
        useContext: (_name: string, params?: { context?: unknown }) => ref(unref(params?.context)),
    }
})

// provide/inject need a component instance; back them with a map so composables
// can be called directly. Every other Vue primitive stays real.
vi.mock('vue', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue')>()
    const store = new Map<unknown, unknown>()
    return {
        ...actual,
        provide: (key: unknown, value: unknown) => { store.set(key, value) },
        inject: (key: unknown, fallback?: unknown) => (store.has(key) ? store.get(key) : fallback),
    }
})

const { useNavigationSearch, useNavigation, useNavigationContext } = await import('@shopware/composables')
const { ref } = await import('vue')

beforeEach(() => {
    invoke.mockReset()
    ctx.cacheableReads = true
})

describe('SEO-URL resolution issues a cacheable GET', () => {
    it('resolves a seo path via readSeoUrlGet with query._criteria', async () => {
        const element = { routeName: 'frontend.navigation.page', foreignKey: 'cat-1' }
        invoke.mockResolvedValue({ data: { elements: [element] } })

        const { result, call } = await verifyCacheableRead(
            invoke,
            () => useNavigationSearch().resolvePath('/summer-sale'),
            { operationName: 'readSeoUrlGet', path: '/seo-url' },
        )

        expect(call.method).toBe('get')
        expect(result).toEqual(element)
    })

    it('resolves technical URLs (/navigation/…) via the same cacheable GET (superset)', async () => {
        const element = { routeName: 'frontend.navigation.page', foreignKey: 'cat-2' }
        invoke.mockResolvedValue({ data: { elements: [element] } })

        const { call } = await verifyCacheableRead(
            invoke,
            () => useNavigationSearch().resolvePath('/navigation/cat-2'),
            { operationName: 'readSeoUrlGet', path: '/seo-url' },
        )

        expect(call.method).toBe('get')
    })

    it('returns the already-resolved {routeName, foreignKey} for the home path without a read', async () => {
        const result = await useNavigationSearch().resolvePath('/')

        expect(result).toEqual({
            routeName: 'frontend.navigation.page',
            foreignKey: 'root-category',
        })
        expect(invoke).not.toHaveBeenCalled()
    })

    it('returns null (→ 404) for an unknown seo path with no technical fallback', async () => {
        invoke.mockResolvedValue({ data: { elements: [] } })

        const result = await useNavigationSearch().resolvePath('/does-not-exist')

        expect(result).toBeNull()
    })

    it('falls back to the POST variant when cacheableReads is off (baseline)', async () => {
        ctx.cacheableReads = false
        invoke.mockResolvedValue({ data: { elements: [] } })

        await useNavigationSearch().resolvePath('/summer-sale')

        const [operation] = invoke.mock.calls[0]!
        expect(String(operation)).toBe('readSeoUrl post /seo-url')
    })
})

describe('Navigation loading issues a cacheable GET', () => {
    it('loads navigation via readNavigationGet with query._criteria', async () => {
        invoke.mockResolvedValue({ data: [{ id: 'nav-1' }] })

        const { result, call } = await verifyCacheableRead(
            invoke,
            () => useNavigation().loadNavigationElements({ depth: 3 }),
            { operationName: 'readNavigationGet', path: '/navigation/{activeId}/{rootId}' },
        )

        expect(call.method).toBe('get')
        expect(call.options?.pathParams).toEqual({ activeId: 'main-navigation', rootId: 'main-navigation' })
        expect(result).toEqual([{ id: 'nav-1' }])
    })

    it('targets the requested navigation type', async () => {
        invoke.mockResolvedValue({ data: [] })

        await useNavigation({ type: 'footer-navigation' }).loadNavigationElements({ depth: 1 })

        const call = expectCacheableGet(invoke, { operationName: 'readNavigationGet' })
        expect(call.options?.pathParams).toEqual({ activeId: 'footer-navigation', rootId: 'footer-navigation' })
    })

    it('falls back to the POST variant when cacheableReads is off (baseline)', async () => {
        ctx.cacheableReads = false
        invoke.mockResolvedValue({ data: [] })

        await useNavigation().loadNavigationElements({ depth: 3 })

        const [operation] = invoke.mock.calls[0]!
        expect(String(operation)).toBe('readNavigation post /navigation/{activeId}/{rootId}')
    })
})

describe('useNavigationContext consumes both resolvePath return shapes', () => {
    it('extracts routeName/foreignKey from a raw SeoUrl element', () => {
        const { routeName, foreignKey } = useNavigationContext(
            ref({ routeName: 'frontend.detail.page', foreignKey: 'prod-1' } as Schemas['SeoUrl']),
        )

        expect(routeName.value).toBe('frontend.detail.page')
        expect(foreignKey.value).toBe('prod-1')
    })

    it('extracts routeName/foreignKey from an already-resolved {routeName, foreignKey}', () => {
        const { routeName, foreignKey } = useNavigationContext(
            ref({ routeName: 'frontend.navigation.page', foreignKey: 'root-category' } as Schemas['SeoUrl']),
        )

        expect(routeName.value).toBe('frontend.navigation.page')
        expect(foreignKey.value).toBe('root-category')
    })
})
