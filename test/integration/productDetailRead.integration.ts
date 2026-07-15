/**
 * Integration check for the cacheable product-detail read (issue #14).
 *
 * NOT part of the Vitest suite or CI — the filename ends in `.integration.ts`
 * so it is excluded from `test/**\/*.{test,spec}.ts`. Run it by hand against a
 * real CACHE_REWORK Shopware backend to confirm the anonymous product-detail
 * GET (Criteria in `?_criteria`) returns the render-ready CMS page and — when an
 * http_cache sits in the path — is served from cache on the second hit.
 *
 * Usage:
 *   NUXT_PUBLIC_SHOPWARE_ENDPOINT="https://shop.example/store-api/" \
 *   NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN="SWSC..." \
 *   [PRODUCT_ID="..."] \
 *   npx jiti test/integration/productDetailRead.integration.ts
 */
import { encodeForQuery } from '@shopware/api-client/helpers'
import { defu } from 'defu'
import { productDetailAssociations } from '../../app/utils/productDetailAssociations'
// Deep path (not the package entry) so this standalone jiti run picks up the
// framework's own CMS association tree — the same one useProductSearch expands
// `withCmsAssociations: true` into — without booting Nuxt.
import { cmsAssociations } from '../../node_modules/@shopware/composables/src/cms/cmsAssociations'

const endpoint = process.env.NUXT_PUBLIC_SHOPWARE_ENDPOINT
const accessToken = process.env.NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN

if (!endpoint || !accessToken) {
    console.error('Set NUXT_PUBLIC_SHOPWARE_ENDPOINT and NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN.')
    process.exit(1)
}

const baseUrl = endpoint.endsWith('/') ? endpoint : `${endpoint}/`
const headers = {
    'sw-access-key': accessToken,
    'sw-include-seo-urls': 'true',
    'Content-Type': 'application/json',
}

// Exactly what FrontendDetailPage sends: useProductSearch folds
// `withCmsAssociations: true` (the framework cmsAssociations tree) together with
// the manufacturer/media/cover associations via defu, then GETs it as _criteria.
const criteria = defu(cmsAssociations, { associations: productDetailAssociations })

async function resolveProductId (): Promise<string> {
    if (process.env.PRODUCT_ID) return process.env.PRODUCT_ID

    const res = await fetch(`${baseUrl}product`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ limit: 1 }),
    })
    if (!res.ok) throw new Error(`product listing lookup failed: ${res.status}`)
    const json = await res.json()
    const id = json?.elements?.[0]?.id
    if (!id) throw new Error('no product found to test against — set PRODUCT_ID')
    return id
}

async function getDetail (productId: string) {
    const url = `${baseUrl}product/${productId}?_criteria=${encodeForQuery(criteria)}`
    const res = await fetch(url, { method: 'GET', headers })
    const cacheControl = res.headers.get('cache-control')
    const age = res.headers.get('age')
    const json = await res.json()
    return { ok: res.ok, status: res.status, cacheControl, age, product: json?.product }
}

const productId = await resolveProductId()
console.log(`Testing product-detail GET for ${productId}`)

const first = await getDetail(productId)
if (!first.ok) throw new Error(`GET returned ${first.status}`)
if (!first.product?.cmsPage) throw new Error('GET response is missing a render-ready cmsPage')
console.log('✓ GET returned a render-ready cmsPage')
console.log(`  cache-control: ${first.cacheControl ?? '(none)'} | age: ${first.age ?? '(none)'}`)

// Second hit: with a shared http_cache in the path this should be a cache HIT
// (age > 0). Informational only — the s-maxage/http_cache wiring is ops-side.
const second = await getDetail(productId)
console.log(`  second hit age: ${second.age ?? '(none)'} ${Number(second.age) > 0 ? '→ served from cache' : ''}`)

console.log('Integration check passed.')
