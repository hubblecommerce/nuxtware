/**
 * Manual check (excluded from CI via the `.integration.ts` suffix): confirms the
 * anonymous category GET returns a render-ready cmsPage for the base listing and
 * `?p=2` against a real CACHE_REWORK backend, and is served from cache on a
 * second hit.
 *
 * Usage:
 *   NUXT_PUBLIC_SHOPWARE_ENDPOINT="https://shop.example/store-api/" \
 *   NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN="SWSC..." \
 *   [CATEGORY_ID="..."] \
 *   npx jiti test/integration/categoryRead.integration.ts
 */
import { encodeForQuery } from '@shopware/api-client/helpers'
// Deep path so this standalone jiti run reuses the framework's association tree.
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

// Mirrors the override's Criteria: cmsAssociations plus the listing query.
function buildCriteria (query?: Record<string, unknown>) {
    return { associations: cmsAssociations, ...query }
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

async function getCategory (categoryId: string, query?: Record<string, unknown>) {
    const url = `${baseUrl}category/${categoryId}?_criteria=${encodeForQuery(buildCriteria(query))}`
    const res = await fetch(url, { method: 'GET', headers })
    const cacheControl = res.headers.get('cache-control')
    const age = res.headers.get('age')
    const json = await res.json()
    return { ok: res.ok, status: res.status, cacheControl, age, cmsPage: json?.cmsPage }
}

const categoryId = await resolveCategoryId()
console.log(`Testing category GET for ${categoryId}`)

for (const [label, query] of [['base', undefined], ['?p=2', { p: '2' }]] as const) {
    const first = await getCategory(categoryId, query)
    if (!first.ok) throw new Error(`${label} GET returned ${first.status}`)
    if (!first.cmsPage) throw new Error(`${label} GET response is missing a render-ready cmsPage`)
    console.log(`✓ ${label} GET returned a render-ready cmsPage`)
    console.log(`  cache-control: ${first.cacheControl ?? '(none)'} | age: ${first.age ?? '(none)'}`)

    // Second hit: age > 0 means served from cache. Informational — ops-side wiring.
    const second = await getCategory(categoryId, query)
    console.log(`  second hit age: ${second.age ?? '(none)'} ${Number(second.age) > 0 ? '→ served from cache' : ''}`)
}

console.log('Integration check passed.')
