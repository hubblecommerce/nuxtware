// Listing query keys that stay cacheable as a GET. Any key outside this set
// forces a POST. Central, extensible.
export const CACHEABLE_LISTING_PARAMS = new Set<string>(['p', 'limit', 'order'])

export function isCacheableListingQuery (query?: Record<string, unknown>): boolean {
    if (!query) return true
    return Object.keys(query).every(key => CACHEABLE_LISTING_PARAMS.has(key))
}
