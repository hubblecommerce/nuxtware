import { shopwareApiClient } from './shopware-api-client'

async function getSeoUrl ({ slug, languageId }: { slug: string, languageId?: string } ) {
    const isTechnicalUrl =
        slug.startsWith('/navigation/') ||
        slug.startsWith('/detail/') ||
        slug.startsWith('/landingPage/')

    // remove leading slash in case of seo url
    const normalizedPath = isTechnicalUrl ? slug : slug.substring(1)

    const seoResult = await shopwareApiClient.invoke('readSeoUrl post /seo-url', {
        headers: {
            ...(languageId && { 'sw-language-id': languageId })
        },
        body: {
            filter: [
                {
                    type: 'equals',
                    field: isTechnicalUrl ? 'pathInfo' : 'seoPathInfo',
                    value: normalizedPath,
                },
            ],
        }
    })

    return seoResult.data.elements?.[0]
}

const runtimeConfig = useRuntimeConfig()

export const getCachedSeoUrl = cachedFunction(
    getSeoUrl,
    {
        maxAge: runtimeConfig?.public?.apiCacheLifetime ?? 60 * 5, // Default 5 Minutes
        name: 'seoUrl'
    }
)
