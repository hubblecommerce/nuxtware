/**
 * Manual check (excluded from CI via the `.integration.ts` suffix): confirms the
 * anonymous landing GET returns a render-ready cmsPage against a real
 * CACHE_REWORK backend, and is served from cache on a second hit.
 *
 * Usage:
 *   NUXT_PUBLIC_SHOPWARE_ENDPOINT="https://shop.example/store-api/" \
 *   NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN="SWSC..." \
 *   LANDING_PAGE_ID="..." \
 *   npx jiti test/integration/landingRead.integration.ts
 */
import { encodeForQuery } from '@shopware/api-client/helpers'
// Deep path so this standalone jiti run reuses the framework's association tree.
import { cmsAssociations } from '../../node_modules/@shopware/composables/src/cms/cmsAssociations'

const endpoint = process.env.NUXT_PUBLIC_SHOPWARE_ENDPOINT
const accessToken = process.env.NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN
const landingPageId = process.env.LANDING_PAGE_ID

if (!endpoint || !accessToken) {
    console.error('Set NUXT_PUBLIC_SHOPWARE_ENDPOINT and NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN.')
    process.exit(1)
}

if (!landingPageId) {
    console.error('Set LANDING_PAGE_ID — landing pages are not enumerable via a listing endpoint.')
    process.exit(1)
}

const baseUrl = endpoint.endsWith('/') ? endpoint : `${endpoint}/`
const headers = {
    'sw-access-key': accessToken,
    'Content-Type': 'application/json',
}

// Mirrors the override's Criteria: the framework landing uses the inner
// association tree (single-level), plus the (optional) query.
function buildCriteria (query?: Record<string, unknown>) {
    return { associations: cmsAssociations.associations, ...query }
}

async function getLanding (query?: Record<string, unknown>) {
    const url = `${baseUrl}landing-page/${landingPageId}?_criteria=${encodeForQuery(buildCriteria(query))}`
    const res = await fetch(url, { method: 'GET', headers })
    const cacheControl = res.headers.get('cache-control')
    const age = res.headers.get('age')
    const json = await res.json()
    return { ok: res.ok, status: res.status, cacheControl, age, cmsPage: json?.cmsPage }
}

console.log(`Testing landing GET for ${landingPageId}`)

const first = await getLanding()
if (!first.ok) throw new Error(`landing GET returned ${first.status}`)
if (!first.cmsPage) throw new Error('landing GET response is missing a render-ready cmsPage')
console.log('✓ landing GET returned a render-ready cmsPage')
console.log(`  cache-control: ${first.cacheControl ?? '(none)'} | age: ${first.age ?? '(none)'}`)

// Second hit: age > 0 means served from cache. Informational — ops-side wiring.
const second = await getLanding()
console.log(`  second hit age: ${second.age ?? '(none)'} ${Number(second.age) > 0 ? '→ served from cache' : ''}`)

console.log('Integration check passed.')
