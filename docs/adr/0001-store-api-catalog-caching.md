# 1. Katalog-Route-Caching über Shopware `http_cache` (Cache-Rework)

Datum: 2026-07-14
Status: Akzeptiert

## Kontext

Shopware hat das Caching der Store-API überarbeitet (Cache-Rework, Feature-Flag `CACHE_REWORK` ab 6.7.5, Default ab 6.8). Nicht-mutierende Store-API-Routen sind jetzt per **GET** mit komprimierter Criteria (`?_criteria = base64url(gzip(json(criteria)))`) aufrufbar und tragen `Cache-Control: public, max-age=0, s-maxage=1800, stale-while-revalidate=86400`. Gecacht wird ausschließlich durch einen **shared Cache** (`s-maxage`) im Anfragepfad.

Ausgangslage in nuxtware:

- Ein eigener **Nitro-Cache-Layer** (`cachedFunction`) für SEO-URL- und Navigations-Auflösung, historisch gebaut, weil die Store-API früher nicht cachebar war. Umgeht die shopware-frontends-Composables und ruft `apiClient.invoke(... post ...)` direkt auf.
- Kategorie- und Produkt-Entitäten laufen über die Composables (`useCategorySearch().search`, `useProductSearch().search`) — durchweg POST.

Infra-Entscheidung des Betriebs: **Varnish entfällt**, Shopwares eingebauter `http_cache` wird der shared Cache. Zusätzlich bleibt `nuxt-multi-cache` als SSR-Page-Cache auf Nitro-Ebene bestehen.

Die shopware-frontends-Composables (ab 1.12.0) bieten das Opt-in-Flag `cacheableReads`, das abgedeckte Reads auf GET umstellt. **Nicht** abgedeckt (reine Typ-Lücke, kein Backend-Limit): `useCategorySearch.search`, `useLandingSearch`, `useListing`. Verifiziert an der Store-API-Quelle: `CategoryRoute`, `LandingPageRoute` und `ProductListingRoute` akzeptieren alle `[GET, POST]` mit `_httpCache => true` und lösen die CMS-Page methodenunabhängig auf.

## Entscheidung

1. **Upgrade** auf `@shopware/composables@1.12`, `@shopware/api-client@1.5`, `@shopware/nuxt-module@1.5` und `cacheableReads: true` in `nuxt.config`.
2. **Nitro-Cache-Layer für SEO-URL + Navigation ersatzlos entfernen** (`server/routes/seo-url.post.ts`, `server/routes/navigation.post.ts`, `server/utils/shopware-get-cached-*.ts`, `app/composables/useNavigationCached.ts`, `apiCacheLifetime`). Auflösung stattdessen über die Framework-Composables `useNavigationSearch().resolvePath()` und `useNavigation()` (nativ von `cacheableReads` als GET abgedeckt; `resolvePath` deckt die technische-URL-Sonderbehandlung als Superset ab).
3. **Produkt-Detail**: `useProductSearch().search` schaltet über das Flag automatisch auf GET.
4. **Kategorie- und Landing-Detail**: per offiziellem Composable-Override (Wrap-and-Spread, nur `search` ersetzt) auf die GET-Variante der Route umstellen, weil die SDK diese Routen nur wegen einer Typ-Lücke bei POST belässt.
5. **Methoden-Wahl nach Criteria**: Die Overrides wählen GET (cachebar) nur für **cachebare Listing-Queries** — Query-Parameter ausschließlich aus `CACHEABLE_LISTING_PARAMS` (aktuell `p`, `limit`, `order`) — und fallen für Filter (z. B. `properties`, `min-price`) auf POST zurück. SSR sendet stets die volle Criteria; die Methode beeinflusst nur die Cachebarkeit, nie den gerenderten DOM.
6. **Interaktives Listing** (Pagination-/Sorter-/Limiter-Klicks via `useCategoryListing().search`) läuft über denselben Methoden-Wahl-Motor: ein `useCategoryListing`-Override (rebuilt um das exportierte `createListingComposable`, nur `searchMethod` ersetzt) schaltet für cachebare Listing-Queries auf `readProductListingGet` (GET) und belässt Filter-Klicks auf POST. Beide Katalog-Reads teilen sich die eine `CACHEABLE_LISTING_PARAMS`-Allow-List. Das Basis- und paginierte Listing wird zusätzlich über den `cmsPage`-Slot der Kategorie-Antwort mit-gecacht. *(Revidiert: ursprünglich blieb das interaktive Listing durchweg POST; die Allow-List begrenzt die GET-Permutationen bereits, daher auf GET erweitert.)*

## Konsequenzen

- SSR-Katalog-Requests werden vom `http_cache` bedient, wo sie cachebar sind; der eigene Nitro-Cache entfällt, weniger Code, eine Cache-Autorität weniger.
- Vollständiges SSR-Rendering bleibt für **jede** URL erhalten (keine Hydration-Mismatches, korrekte DOMs für Crawler/No-JS) — auch für nicht-cachebare gefilterte Views (dann POST).
- Bounded Permutationen (Basis + Seitenzahlen) werden gecacht; unbounded Filter-Kombinationen verwässern die Hit-Rate nicht. Allow-List via `CACHEABLE_LISTING_PARAMS` trivial erweiterbar.
- **Preis:** Overrides für Kategorie/Landing und das interaktive Listing hängen an einer SDK-Typ-Lücke (`_criteria` auf der getippten GET-Operation nicht deklariert → schmaler `_criteria`-Cast). Zu entfernen, sobald shopware-frontends die GET-Varianten mit `_criteria` liefert bzw. `useListing` selbst über GET routet.
- **Voraussetzung:** ein shared Cache (Shopware `http_cache`) im SSR-Pfad; ohne ihn ist die GET-Umstellung wirkungslos.

## Offene Validierungspunkte (Implementierung)

- Cache-Key-Stabilität im SSR: `sw-language-id` / `sw-currency-id` / `sw-context-hash` müssen für anonyme Katalog-Requests stabil/korrekt gesendet werden, sonst fragmentiert der Cache.
- `@shopware/api-gen` gegen ein `CACHE_REWORK`-Backend neu generieren, damit die `...Get`-Operationen getippt sind.
- Invalidations-Kohärenz zwischen `nuxt-multi-cache` (SSR-Seiten) und `http_cache` (Store-API) — angrenzend, nicht Teil dieser Umstellung.
