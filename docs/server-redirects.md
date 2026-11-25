# Server Redirects

Nuxtware ships a server middleware (`server/middleware/redirect.ts`) that handles domain validation and locale domain redirects. It is disabled by default and only becomes active once it is configured.

## Features

### Domain Validation

If a request hits a domain that is not listed in `allowedDomains`, it is redirected (301) to `primaryDomain`. Path and query are kept.

```
https://unknown-domain.com/foo?x=1 -> https://shop.de/foo?x=1
```

### Locale Domains

Requests with a locale prefix are redirected (301) to the domain configured for that locale. Requests already on that domain are not redirected, so no redirect loops occur.

```
https://shop.com/de/product?a=b -> https://shop.de/de/product?a=b
https://shop.de/de/product      -> no redirect
```

## Configuration

The middleware reads `runtimeConfig.redirect`. Empty values disable the respective feature.

| Key | Env variable | Description |
|---|---|---|
| `allowedDomains` | `NUXT_REDIRECT_ALLOWED_DOMAINS` | JSON array of allowed origins |
| `primaryDomain` | `NUXT_REDIRECT_PRIMARY_DOMAIN` | Redirect target for not allowed domains |
| `localeDomains` | `NUXT_REDIRECT_LOCALE_DOMAINS` | JSON object mapping locale prefix to domain |

Domain validation requires both `allowedDomains` and `primaryDomain` to be set.

### Example

```env
NUXT_REDIRECT_ALLOWED_DOMAINS='["https://shop.de","https://shop.com"]'
NUXT_REDIRECT_PRIMARY_DOMAIN='https://shop.de'
NUXT_REDIRECT_LOCALE_DOMAINS='{"de":"https://shop.de","fr":"https://shop.fr"}'
```

Alternatively, set the values in the `nuxt.config.ts` of your project:

```ts
export default defineNuxtConfig({
    runtimeConfig: {
        redirect: {
            allowedDomains: ['https://shop.de', 'https://shop.com'],
            primaryDomain: 'https://shop.de',
            localeDomains: { de: 'https://shop.de' },
        },
    },
})
```

**Important:** `localeDomains` must be set as JSON object via `NUXT_REDIRECT_LOCALE_DOMAINS`. Single keys like `NUXT_REDIRECT_LOCALE_DOMAINS_DE` are ignored by Nuxt, because they are not predefined in the layer config.

## Behaviour

The middleware does nothing:

- in development mode (`nuxt dev`)
- for assets, `/_nuxt/`, `/__nuxt*` and `/api/` routes
- for non-document requests (XHR, fetch, prefetch), detected via `Sec-Fetch-Dest` / `Sec-Fetch-Mode` with an `Accept: text/html` fallback
- for locale redirects, if `app.baseURL` is not `/`

## Notes

- Use origins (`https://shop.de`) as domains. A trailing slash is ignored.
- On preview or staging environments leave `localeDomains` empty, otherwise requests are redirected to the live domain.
- Projects with their own redirect middleware (e.g. migrated from a project specific implementation) should remove it to prevent duplicate redirects.

## Testing

Build and start the app with a test configuration and simulate domains via `Host` header:

```bash
npm run build
PORT=3000 \
NUXT_REDIRECT_ALLOWED_DOMAINS='["http://shop.de:3000"]' \
NUXT_REDIRECT_PRIMARY_DOMAIN='http://shop.de:3000' \
NUXT_REDIRECT_LOCALE_DOMAINS='{"de":"http://shop.de:3000"}' \
node .playground/.output/server/index.mjs

curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' \
    -H 'Accept: text/html' -H 'Host: shop.com:3000' 'http://127.0.0.1:3000/de/product'
# 301 http://shop.de:3000/de/product
```
