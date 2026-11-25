import type { H3Event } from 'h3'
import { getRequestHeader } from 'h3'

const ASSET_EXTENSION_RE = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|json)$/i

/**
 * Static assets, API and framework-internal routes that redirect middleware must ignore.
 * Shared by every server-side redirect middleware.
 */
export function isNonPageRequest(pathname: string): boolean {
    return (
        pathname.startsWith('/_nuxt/')
        || pathname.startsWith('/__nuxt')
        || pathname.startsWith('/api/')
        || ASSET_EXTENSION_RE.test(pathname)
    )
}

/**
 * True only for real document navigations (address-bar loads, link clicks, crawlers), so
 * redirect middleware never rewrites data / XHR / prefetch requests. Uses Fetch Metadata
 * (Sec-Fetch-*) with an Accept-header fallback for clients that don't send it.
 */
export function isDocumentNavigation(event: H3Event): boolean {
    const secFetchDest = getRequestHeader(event, 'sec-fetch-dest')
    const secFetchMode = getRequestHeader(event, 'sec-fetch-mode')
    const acceptHeader = getRequestHeader(event, 'accept') || ''

    return (
        (secFetchDest === 'document' && secFetchMode === 'navigate')
        || (!secFetchDest && event.method === 'GET' && acceptHeader.includes('text/html'))
    )
}
