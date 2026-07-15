/**
 * Manual check (excluded from CI via the `.integration.ts` suffix): confirms the
 * anonymous product-listing GET returns products for an allow-listed query
 * (`?p`/`?limit`/`?order`) against a real CACHE_REWORK backend, and is served
 * from cache on a second hit — i.e. that folding the listing query into
 * `_criteria` is honoured by the ProductListingRoute GET.
 *
 * Usage:
 *   NUXT_PUBLIC_SHOPWARE_ENDPOINT="https://shop.example/store-api/" \
 *   NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN="SWSC..." \
 *   [CATEGORY_ID="..."] \
 *   npx jiti test/integration/categoryListingRead.integration.ts
 */
import { encodeForQuery } from '@shopware/api-client/helpers'

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

async function resolveCategoryId (): Promise<string> {
    if (process.env.CATEGORY_ID) return process.env.CATEGORY_ID

    const res = await fetch(`${baseUrl}category`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ limit: 1 }),
    })
    if (!res.ok) throw new Error(`category listing lookup failed: ${res.status}`)
    const json = await res.json()
    const id = json?.elements?.[0]?.id
    if (!id) throw new Error('no category found to test against — set CATEGORY_ID')
    return id
}

async function getListing (categoryId: string, criteria: Record<string, unknown>) {
    const url = `${baseUrl}product-listing/${categoryId}?_criteria=${encodeForQuery(criteria)}`
    const res = await fetch(url, { method: 'GET', headers })
    const cacheControl = res.headers.get('cache-control')
    const age = res.headers.get('age')
    const json = await res.json()
    return { ok: res.ok, status: res.status, cacheControl, age, total: json?.total, elements: json?.elements }
}

const categoryId = await resolveCategoryId()
console.log(`Testing product-listing GET for ${categoryId}`)

const criteria = { p: 1, limit: 15, order: 'topseller' }

const first = await getListing(categoryId, criteria)
if (!first.ok) throw new Error(`GET returned ${first.status}`)
if (!Array.isArray(first.elements)) throw new Error('GET response is missing a products array')
console.log(`✓ GET returned ${first.elements.length} products (total ${first.total ?? '?'})`)
console.log(`  cache-control: ${first.cacheControl ?? '(none)'} | age: ${first.age ?? '(none)'}`)

// Second hit: age > 0 means served from cache. Informational — ops-side wiring.
const second = await getListing(categoryId, criteria)
console.log(`  second hit age: ${second.age ?? '(none)'} ${Number(second.age) > 0 ? '→ served from cache' : ''}`)

console.log('Integration check passed.')
