import { encodeForQuery } from '@shopware/api-client/helpers'
import { useCategorySearch as useCoreCategorySearch } from '@shopware/composables'
import { useShopwareContext } from '#imports'
import type { RequestParameters } from '#shopware'
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

// The typed GET operation omits the `_criteria` query param it accepts at
// runtime; assert just that field.
type CategoryGetQuery = RequestParameters<'readCategoryGet get /category/{navigationId}'>['query']

export function useCategorySearch () {
    const core = useCoreCategorySearch()
    const { apiClient, cacheableReads } = useShopwareContext()

    async function search (
        categoryId: string,
        options?: {
            withCmsAssociations?: boolean
            query?: Record<string, unknown>
        }
    ) {
        const associations = options?.withCmsAssociations ? cmsAssociations : {}
        const criteria = {
            associations,
            ...options?.query
        }

        if (cacheableReads && isCacheableListingQuery(options?.query)) {
            const result = await apiClient.invoke('readCategoryGet get /category/{navigationId}', {
                pathParams: { navigationId: categoryId },
                headers: { 'sw-include-seo-urls': true },
                query: { _criteria: encodeForQuery(criteria) } as CategoryGetQuery
            })
            return result.data
        }

        const result = await apiClient.invoke('readCategory post /category/{navigationId}', {
            pathParams: { navigationId: categoryId },
            headers: { 'sw-include-seo-urls': true },
            body: criteria
        })
        return result.data
    }

    return {
        ...core,
        search
    }
}
