import { encodeForQuery } from '@shopware/api-client/helpers'
import { useLandingSearch as useCoreLandingSearch } from '@shopware/composables'
import { useShopwareContext } from '#imports'
import type { RequestParameters, RequestReturnType } from '#shopware'
import { isCacheableListingQuery } from '#nuxtware/utils/isCacheableListingQuery'

// Byte-identical copy of the framework's non-exported cmsAssociations.
const cmsAssociations = {
    associations: {
        media: {
            associations: {
                media: {}
            }
        },
        cmsPage: {
            associations: {
                sections: {
                    associations: {
                        blocks: {
                            associations: {
                                slots: {
                                    associations: {
                                        block: {
                                            associations: {
                                                slots: {
                                                    associations: {}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// The SDK types neither the GET landing operation nor its `_criteria` query
// param it accepts at runtime; a locally typed invoke bridges just this call.
const LANDING_GET = 'readLandingPageGet get /landing-page/{landingPageId}' as const
type LandingGetQuery = RequestParameters<typeof LANDING_GET>['query']
type InvokeLandingGet = (
    operation: typeof LANDING_GET,
    params: { pathParams: { landingPageId: string }, query: LandingGetQuery }
) => Promise<RequestReturnType<typeof LANDING_GET>>

export function useLandingSearch () {
    const core = useCoreLandingSearch()
    const { apiClient, cacheableReads } = useShopwareContext()

    async function search (
        landingPageId: string,
        options?: {
            withCmsAssociations?: boolean
            query?: Record<string, unknown>
        }
    ) {
        const associations = options?.withCmsAssociations ? cmsAssociations.associations : {}
        const criteria = {
            associations,
            ...options?.query
        }

        if (cacheableReads && isCacheableListingQuery(options?.query)) {
            const invokeLandingGet = apiClient.invoke as unknown as InvokeLandingGet
            const result = await invokeLandingGet(LANDING_GET, {
                pathParams: { landingPageId },
                query: { _criteria: encodeForQuery(criteria) } as LandingGetQuery
            })
            return result.data
        }

        const result = await apiClient.invoke('readLandingPage post /landing-page/{landingPageId}', {
            pathParams: { landingPageId },
            body: criteria
        })
        return result.data
    }

    return {
        ...core,
        search
    }
}
