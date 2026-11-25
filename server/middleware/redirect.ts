import { getRequestURL, sendRedirect } from 'h3'
import { isNonPageRequest, isDocumentNavigation } from '../utils/request-guards'

interface RedirectConfig {
    allowedDomains?: string[]
    primaryDomain?: string
    localeDomains?: Record<string, string>
}

function getOrigin(url: string): string | undefined {
    try {
        return new URL(url).origin
    } catch {
        return undefined
    }
}

function isAllowedOrigin(currentOrigin: string, allowedDomains: string[]): boolean {
    return allowedDomains.some(allowedUrl => getOrigin(allowedUrl) === currentOrigin)
}

function hasLocalePrefix(pathname: string, locale: string): boolean {
    return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
}

/*
 * Middleware for serverside redirects and domain validation. Does nothing unless configured
 * via runtimeConfig.redirect (e.g. NUXT_REDIRECT_PRIMARY_DOMAIN).
 * Domain validation: if the current origin is not in allowedDomains, redirect to primaryDomain.
 * Locale domains: requests with a locale prefix are redirected to the domain configured for that
 * locale, e.g. shop.com/de/... -> shop.de/de/...
 */
export default defineEventHandler((event) => {
    if (import.meta.dev) {
        return
    }

    const url = getRequestURL(event)
    const { pathname, origin } = url

    // Skip assets / API / framework-internal routes and non-document requests.
    if (isNonPageRequest(pathname) || !isDocumentNavigation(event)) {
        return
    }

    const config = useRuntimeConfig()
    const { allowedDomains, primaryDomain, localeDomains } = (config.redirect ?? {}) as RedirectConfig

    if (allowedDomains?.length && primaryDomain && !isAllowedOrigin(origin, allowedDomains)) {
        const targetUrl = `${primaryDomain.replace(/\/$/, '')}${pathname}${url.search}`
        console.log(`Domain validation failed. Redirecting from ${origin} to ${targetUrl}`)
        return sendRedirect(event, targetUrl, 301)
    }

    // Apps with a baseURL different from '/' have no locale prefix conflicts and need no redirect
    if (config.app.baseURL !== '/' || !localeDomains) {
        return
    }

    for (const [locale, domain] of Object.entries(localeDomains)) {
        const targetOrigin = domain?.trim() ? getOrigin(domain) : undefined

        // Comparing origins prevents redirect loops when already on the locale domain
        if (targetOrigin && targetOrigin !== origin && hasLocalePrefix(pathname, locale)) {
            return sendRedirect(event, `${domain.replace(/\/$/, '')}${pathname}${url.search}`, 301)
        }
    }
})
