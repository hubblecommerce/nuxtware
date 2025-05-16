<script setup lang="ts">
import type { Schemas, operations } from "#shopware";

const props = defineProps<{
    listing: Schemas['ProductListingResult'],
    /**
     * Optional base route for pagination links
     * Default is current route with page param
     */
    paginationBaseRoute?: string,
    showTopPagination?: boolean,
    showBottomPagination?: boolean,
    /**
     * When true, pagination is only visible to screen readers (for infinite scroll)
     */
    srOnlyPagination?: boolean,
    availableLimits?: number[],
    showTopLimiter?: boolean,
    showBottomLimiter?: boolean,
    showTopSorter?: boolean,
    showBottomSorter?: boolean,
    defaultLimit?: number,
    defaultSorting?: string
}>()

// Default values
const defaultLimitValue = props.defaultLimit || 12
const defaultPage = 1
const defaultSortingValue = props.defaultSorting || 'name-asc'

const {
    getCurrentPage,
    getCurrentSortingOrder,
    getElements,
    getLimit,
    getSortingOrders,
    getTotalPagesCount,
    search,
    loading,
    setInitialListing,
} = useCategoryListing();

setInitialListing(
    props?.listing as Schemas["ProductListingResult"],
);

const route = useRoute()
const router = useRouter()
const initialPath = ref(route.path)

/**
 * Update listing with all parameters
 */
const updateListing = async (params: {
    page?: number,
    limit?: number,
    order?: string
}) => {
    // Create query object with current values
    const query = { 
        ...route.query,
        // Update with new values, defaulting to current if not provided
        p: params.page?.toString() || getCurrentPage.value.toString(),
        limit: params.limit?.toString() || getLimit.value.toString(),
        order: params.order?.toString() || getCurrentSortingOrder.value?.toString()
    } as unknown as operations["searchPage post /search"]["body"];
    
    // Update URL
    await router.push({ query });
    
    // Apply to listing 
    await search(query);
}

/**
 * Watch for route changes to handle navigation
 */
watch(
    () => route,
    (newRoute) => {
        // Only handle same-page navigation
        if (initialPath.value !== newRoute.path) {
            initialPath.value = newRoute.path;
            return;
        }
        
        // Reset to defaults if query is empty
        if (Object.keys(newRoute.query).length === 0) {
            updateListing({
                page: defaultPage,
                limit: defaultLimitValue,
                order: defaultSortingValue
            });
        }
    },
    { deep: true }
);

/**
 * Handle pagination change
 */
const onPageChange = async (page: number) => {
    await updateListing({ page });
    // Scroll to top of listing if needed
    // const listingElement = document.getElementById('product-listing')
    // if (listingElement) listingElement.scrollIntoView({ behavior: 'smooth' })
};

const onLimitChange = async (limit: number) => {
    // Reset to page 1 when changing the limit
    await updateListing({ limit, page: 1 });
};

const onSortChange = async (order: string) => {
    // Reset to page 1 when changing the sorting
    await updateListing({ order, page: 1 });
};

/**
 * Generate base route for pagination that includes all current parameters
 */
const baseRoute = computed(() => {
    if (props.paginationBaseRoute) return props.paginationBaseRoute;
    
    // Use current route with page parameter and preserve other parameters
    const currentPath = route.path;
    const params = new URLSearchParams();
    
    params.append('p', ':page');
    
    if (getLimit.value) {
        params.append('limit', getLimit.value.toString());
    }
    
    if (getCurrentSortingOrder.value) {
        params.append('order', getCurrentSortingOrder.value);
    }
    
    // Add any other query parameters from the current route
    // except for pagination-related ones we're already handling
    Object.entries(route.query).forEach(([key, value]) => {
        if (key !== 'p' && key !== 'limit' && key !== 'order') {
            params.append(key, value as string);
        }
    });
    
    return `${currentPath}?${params.toString()}`;
});
</script>

<template>
    <div id="product-listing">
        <div class="flex flex-wrap items-center justify-between mb-4">
            <div class="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-start gap-4">
                <ProductListingSorter
                    v-if="showTopSorter !== false && getSortingOrders?.length"
                    instance-id="product-listing-sorter-top"
                    class="w-auto"
                    :current-sorting="getCurrentSortingOrder"
                    :available-sortings="getSortingOrders"
                    @update:sorting="onSortChange"
                />
                
                <ProductListingLimiter
                    v-if="showTopLimiter !== false"
                    instance-id="product-listing-limiter-top"
                    class="w-auto"
                    :current-limit="getLimit"
                    :available-limits="availableLimits"
                    @update:limit="onLimitChange"
                />
            </div>
            
            <ProductListingPagination
                v-if="getTotalPagesCount > 1 && showTopPagination !== false"
                instance-id="product-listing-pagination-top"
                class="w-full md:w-auto mt-2 md:mt-0"
                :current-page="getCurrentPage"
                :total-pages="getTotalPagesCount"
                :base-route="baseRoute"
                :sr-only="srOnlyPagination"
                @page-change="onPageChange"
            />
        </div>
        
        <!-- Product grid -->
        <div v-if="!loading" class="grid grid-cols-4 gap-3">
            <ProductListingCard
                v-for="element in getElements"
                :key="element.id"
                :product="element"
            />
        </div>
        <div v-else>
            Loading...
        </div>
        
        <div class="flex flex-wrap items-center justify-between mt-4">
            <div class="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-start gap-4">
                <ProductListingSorter
                    v-if="showBottomSorter !== false && getSortingOrders?.length"
                    instance-id="product-listing-sorter-bottom"
                    class="w-full"
                    :current-sorting="getCurrentSortingOrder"
                    :available-sortings="getSortingOrders"
                    @update:sorting="onSortChange"
                />
                
                <ProductListingLimiter
                    v-if="showBottomLimiter !== false"
                    instance-id="product-listing-limiter-bottom"
                    class="w-full"
                    :current-limit="getLimit"
                    :available-limits="availableLimits"
                    @update:limit="onLimitChange"
                />
            </div>
            
            <ProductListingPagination
                v-if="getTotalPagesCount > 1 && showBottomPagination !== false"
                instance-id="product-listing-pagination-bottom"
                class="w-full md:w-auto mt-2 md:mt-0"
                :current-page="getCurrentPage"
                :total-pages="getTotalPagesCount"
                :base-route="baseRoute"
                :sr-only="srOnlyPagination"
                @page-change="onPageChange"
            />
        </div>
    </div>
</template>
