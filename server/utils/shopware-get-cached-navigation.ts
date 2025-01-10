import type { Schemas } from '#shopware'
import { shopwareApiClient } from './shopware-api-client'

async function getNavigation ( { type, depth, languageId }: { type: Schemas['NavigationType'] | string, depth: number, languageId?: string } ) {
    type = type ?? 'main-navigation'

    try {
        const navigationResponse = await shopwareApiClient.invoke(
            'readNavigation post /navigation/{activeId}/{rootId}',
            {
                headers: {
                    "sw-include-seo-urls": true,
                    ...(languageId && { 'sw-language-id': languageId })
                },
                pathParams: {
                    activeId: type,
                    rootId: type,
                },
                body: {
                    depth,
                },
            },
        )

        return navigationResponse?.data || []
    } catch (e) {
        console.error('[getNavigation][loadNavigationElements]', e)
        return []
    }
}

const runtimeConfig = useRuntimeConfig()

export const getCachedNavigation = cachedFunction(
    getNavigation,
    {
        maxAge: runtimeConfig?.public?.apiCacheLifetime ?? 60 * 5, // Default 5 Minutes
        name: 'navigation'
    }
)
