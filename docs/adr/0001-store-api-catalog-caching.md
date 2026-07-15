# 1. Catalog-route caching via Shopware `http_cache` (Cache-Rework)

Date: 2026-07-14
Status: Accepted

## Context

Shopware has reworked Store-API caching (Cache-Rework, feature flag `CACHE_REWORK` from 6.7.5, default from 6.8). Non-mutating Store-API routes are now callable via **GET** with a compressed Criteria (`?_criteria = base64url(gzip(json(criteria)))`) and carry `Cache-Control: public, max-age=0, s-maxage=1800, stale-while-revalidate=86400`. Caching happens exclusively through a **shared cache** (`s-maxage`) in the request path.

Starting point in nuxtware:

- A custom **Nitro cache layer** (`cachedFunction`) for SEO-URL and navigation resolution, built historically because the Store API used not to be cacheable. It bypasses the shopware-frontends composables and calls `apiClient.invoke(... post ...)` directly.
- Category and product entities run through the composables (`useCategorySearch().search`, `useProductSearch().search`) — POST throughout.

Ops infra decision: **Varnish is dropped**, Shopware's built-in `http_cache` becomes the shared cache. Additionally, `nuxt-multi-cache` stays in place as an SSR page cache at the Nitro level.

The shopware-frontends composables (from 1.12.0) provide the opt-in flag `cacheableReads`, which switches covered reads to GET. **Not** covered (pure typing gap, no backend limit): `useCategorySearch.search`, `useLandingSearch`, `useListing`. Verified against the Store-API source: `CategoryRoute`, `LandingPageRoute` and `ProductListingRoute` all accept `[GET, POST]` with `_httpCache => true` and resolve the CMS page independently of the method.

## Decision

1. **Upgrade** to `@shopware/composables@1.12`, `@shopware/api-client@1.5`, `@shopware/nuxt-module@1.5` and `cacheableReads: true` in `nuxt.config`.
2. **Remove the Nitro cache layer for SEO-URL + navigation entirely** (`server/routes/seo-url.post.ts`, `server/routes/navigation.post.ts`, `server/utils/shopware-get-cached-*.ts`, `app/composables/useNavigationCached.ts`, `apiCacheLifetime`). Resolution instead via the framework composables `useNavigationSearch().resolvePath()` and `useNavigation()` (natively covered by `cacheableReads` as GET; `resolvePath` covers the technical-URL special handling as a superset).
3. **Product detail**: `useProductSearch().search` automatically switches to GET via the flag.
4. **Category and landing detail**: switch to the GET variant of the route via an official composable override (wrap-and-spread, only `search` replaced), because the SDK leaves these routes on POST only due to a typing gap.
5. **Method choice by Criteria**: the overrides pick GET (cacheable) only for **cacheable listing queries** — query parameters exclusively from `CACHEABLE_LISTING_PARAMS` (currently `p`, `limit`, `order`) — and fall back to POST for filters (e.g. `properties`, `min-price`). SSR always sends the full Criteria; the method only affects cacheability, never the rendered DOM.
6. **Interactive listing** (pagination/sorter/limiter clicks via `useCategoryListing().search`) runs through the same method-choice engine: a `useCategoryListing` override (rebuilt around the exported `createListingComposable`, only `searchMethod` replaced) switches to `readProductListingGet` (GET) for cacheable listing queries and leaves filter clicks on POST. Both catalog reads share the single `CACHEABLE_LISTING_PARAMS` allow-list. The base and paginated listing is additionally co-cached via the `cmsPage` slot of the category response. *(Revised: originally the interactive listing stayed POST throughout; the allow-list already bounds the GET permutations, so it was extended to GET.)*

## Consequences

- SSR catalog requests are served by `http_cache` wherever they are cacheable; the custom Nitro cache is gone — less code, one fewer cache authority.
- Full SSR rendering is preserved for **every** URL (no hydration mismatches, correct DOMs for crawlers/no-JS) — including for non-cacheable filtered views (POST then).
- Bounded permutations (base + page numbers) are cached; unbounded filter combinations don't dilute the hit rate. Allow-list via `CACHEABLE_LISTING_PARAMS` trivially extensible.
- **Price:** the overrides for category/landing and the interactive listing hang on an SDK typing gap (`_criteria` not declared on the typed GET operation → narrow `_criteria` cast). Landing is one step wider: `readLandingPageGet` is missing entirely from the SDK `operations` union and the `operationPaths` (the route exists and accepts `_criteria` at runtime), hence a locally typed `invoke` bridge just for this one call. All to be removed once shopware-frontends ships the GET variants with `_criteria` or `useListing` routes via GET itself.
- **Prerequisite:** a shared cache (Shopware `http_cache`) in the SSR path; without it, the GET switch has no effect.

## Open validation points (implementation)

- Cache-key stability in SSR: `sw-language-id` / `sw-currency-id` / `sw-context-hash` must be sent stably/correctly for anonymous catalog requests, otherwise the cache fragments.
- Regenerate `@shopware/api-gen` against a `CACHE_REWORK` backend so the `...Get` operations are typed.
- Invalidation coherence between `nuxt-multi-cache` (SSR pages) and `http_cache` (Store API) — adjacent, not part of this switch.
