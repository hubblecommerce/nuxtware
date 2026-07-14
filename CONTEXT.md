# Context: Nuxtware

Glossary of the project's ubiquitous language. Terms only — no implementation details.

## Caching

- **Katalog-Route** — Eine Route, deren Daten nicht an die Shopware-Customer-Session gebunden sind: SEO-URL-Auflösung, Kategorie- und Produkt-Entitäten, Navigation. Anonym cachebar.
- **Nitro-Cache** — Der eigene serverseitige Cache von nuxtware innerhalb des Nuxt-Servers, umgesetzt über Nitro `cachedFunction` (z.B. `getCachedSeoUrl`, `getCachedNavigation`). Historisch gebaut, weil die Store-API früher nicht cachebar war. Wird im Zuge der Cache-Rework abgeschafft.
- **Store-API-GET-Cache** — Der geteilte HTTP-Cache *vor* der Store-API-Logik, der cachebare GET-Antworten anhand von `s-maxage` speichert. Ab der Cache-Rework Shopwares eingebauter `http_cache` (ersetzt das bisherige Varnish).
- **nuxt-multi-cache** — Der verbleibende nuxtware-seitige Cache; cached gerenderte SSR-Seiten auf Nitro-Ebene. Bleibt bestehen.
- **cacheableReads** — Opt-in-Flag der shopware-frontends-Composables (ab composables 1.12.0). Leitet anonyme Lese-Composables auf ihre cachebaren GET-Varianten (`_criteria`-Query) statt POST um. Aktivierbar in `nuxt.config` via `shopware: { cacheableReads: true }`.
- **shared Cache vs. private Cache** — *Shared*: liegt im Anfragepfad und speichert Antworten für *alle* User (Reverse Proxy / CDN / Shopware `http_cache`); reagiert auf `s-maxage`. *Private*: der Browser eines einzelnen Users; reagiert auf `max-age`. Für den SSR-Pfad (`Nitro → Store-API`) zählt nur der shared Cache.
- **Methoden-Wahl nach Criteria** — Regel für Katalog-Reads: Die HTTP-Methode (GET vs. POST) ändert nie den Response-Body, nur die Cachebarkeit. SSR sendet immer die volle Criteria (korrektes Rendering für Crawler/No-JS), wählt aber GET (cachebar) für „cachebare" Anfragen und POST (`no-cache, private`) für alle anderen.
- **cachebare Listing-Query** — Eine Listing-Anfrage gilt als cachebar (→ GET), wenn ihre Query-Parameter ausschließlich aus der Allow-List `CACHEABLE_LISTING_PARAMS` stammen (aktuell nur Pagination `p`). Filter, Sortierung und Limiter (unbounded Permutationen) fallen auf POST zurück.
