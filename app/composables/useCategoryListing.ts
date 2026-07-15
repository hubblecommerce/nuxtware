import { encodeForQuery } from '@shopware/api-client/helpers'
import { createListingComposable, useCategory } from '@shopware/composables'
import { createInjectionState } from '@vueuse/core'
import { useShopwareContext } from '#imports'
import type { RequestParameters, Schemas, operations } from '#shopware'
import { isCacheableListingQuery } from '#nuxtware/utils/isCacheableListingQuery'

type ListingBody = operations['readProductListing post /product-listing/{categoryId}']['body']

// The typed GET operation omits the `_criteria` query param it accepts at
// runtime; assert just that field.
type ProductListingGetQuery = RequestParameters<'readProductListingGet get /product-listing/{categoryId}'>['query']

function createCategoryListingSearchMethod () {
    const { apiClient, cacheableReads } = useShopwareContext()
    const { category } = useCategory()

    return async (searchCriteria: ListingBody): Promise<Schemas['ProductListingResult']> => {
        const categoryId = category.value?.id as string

        if (cacheableReads && isCacheableListingQuery(searchCriteria as Record<string, unknown>)) {
            const { data } = await apiClient.invoke('readProductListingGet get /product-listing/{categoryId}', {
                headers: { 'sw-include-seo-urls': true },
                pathParams: { categoryId },
                query: { _criteria: encodeForQuery(searchCriteria) } as ProductListingGetQuery
            })
            return data
        }

        const { data } = await apiClient.invoke('readProductListing post /product-listing/{categoryId}', {
            headers: { 'sw-include-seo-urls': true },
            pathParams: { categoryId },
            body: searchCriteria
        })
        return data
    }
}

// Rebuilt around the framework's createListingComposable so only searchMethod
// changes; listingKey `categoryListing` keeps the shared state SDK-compatible.
const [_createCategoryListingContext, _useCategoryListingContext] = createInjectionState(
    (initialListing?: Schemas['ProductListingResult'] | null) => {
        return createListingComposable({
            listingKey: 'categoryListing',
            searchMethod: createCategoryListingSearchMethod(),
            searchDefaults: {} as operations['searchPage post /search']['body'],
            initialListing
        })
    },
    { injectionKey: 'categoryListing' }
)

export const createCategoryListingContext = _createCategoryListingContext

export function useCategoryListing () {
    const listingContext = _useCategoryListingContext()

    if (!listingContext) {
        throw new Error(
            '[useCategoryListing] Please call `createCategoryListingContext` on the appropriate parent component'
        )
    }

    return listingContext
}
