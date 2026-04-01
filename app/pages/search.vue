<script setup lang="ts">
import type { Schemas, operations } from '#shopware'

const route = useRoute()
const router = useRouter()

const {
    changeCurrentPage,
    getCurrentListing,
    getCurrentPage,
    getCurrentSortingOrder,
    getElements,
    getLimit,
    getSortingOrders,
    getTotalPagesCount,
    search,
    setInitialListing,
} = useProductSearchListing()

const searchTerm = computed(() => route.query.search as string || '')
const cacheKey = computed(() => `productSearch-${JSON.stringify(route.query)}`)

const pageElements = shallowRef(getElements.value)
const pageLoading = ref(true)

const { data: initialData } = await useAsyncData(cacheKey.value, async () => {
    await search({
        search: searchTerm.value,
        order: route.query.order as string || 'name-asc',
        limit: route.query.limit ? Number(route.query.limit) : 12,
        p: route.query.p ? Number(route.query.p) : 1,
    })
    return getCurrentListing.value
})

setInitialListing(initialData.value as Schemas['ProductListingResult'])
pageElements.value = getElements.value
pageLoading.value = false

/**
 * Re-run search when URL query changes (e.g. after filter updates from ProductListingFilters)
 */
watch(
    () => route.query,
    async (newQuery) => {
        pageLoading.value = true
        await search({
            ...newQuery as unknown as operations['searchPage post /search']['body'],
            search: newQuery.search as string || '',
        })
        pageElements.value = getElements.value
        pageLoading.value = false
    },
)

const onPageChange = async (page: number) => {
    await router.push({
        query: { ...route.query, p: page },
    })
    await changeCurrentPage(
        page,
        route.query as unknown as operations['searchPage post /search']['body'],
    )
}

const onLimitChange = async (limit: number) => {
    await router.push({
        query: { ...route.query, limit, p: 1 },
    })
}

const onSortChange = async (order: string) => {
    await router.push({
        query: { ...route.query, order, p: 1 },
    })
}

const baseRoute = computed(() => {
    const params = new URLSearchParams()
    params.append('p', ':page')
    if (getLimit.value) params.append('limit', getLimit.value.toString())
    if (getCurrentSortingOrder.value) params.append('order', getCurrentSortingOrder.value)
    if (searchTerm.value) params.append('search', searchTerm.value)
    Object.entries(route.query).forEach(([key, value]) => {
        if (!['p', 'limit', 'order', 'search'].includes(key)) {
            params.append(key, value as string)
        }
    })
    return `/search?${params.toString()}`
})
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Page heading -->
        <h1 class="text-3xl font-bold mb-6 text-center">
            <template v-if="pageElements?.length">
                {{ $t('search.results.header') }}
                <strong>"{{ searchTerm }}"</strong>
            </template>
            <template v-else-if="!pageLoading">
                {{ $t('search.results.noResults') }}
            </template>
        </h1>

        <!-- Filters above results -->
        <ProductListingFilters listing-type="search" class="mb-4" />

        <!-- Top controls -->
        <div class="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div class="flex flex-wrap items-center gap-3">
                <ProductListingSorter
                    v-if="getSortingOrders?.length"
                    instance-id="search-sorter-top"
                    :current-sorting="getCurrentSortingOrder"
                    :available-sortings="getSortingOrders"
                    @update:sorting="onSortChange"
                />
                <ProductListingLimiter
                    instance-id="search-limiter-top"
                    :current-limit="getLimit"
                    @update:limit="onLimitChange"
                />
            </div>
            <ProductListingPagination
                v-if="getTotalPagesCount > 1"
                instance-id="search-pagination-top"
                :current-page="getCurrentPage"
                :total-pages="getTotalPagesCount"
                :base-route="baseRoute"
                @page-change="onPageChange"
            />
        </div>

        <!-- Product grid -->
        <div v-if="pageLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <ComponentSkeleton v-for="i in getLimit" :key="i" preset="card" />
        </div>
        <div v-else-if="pageElements?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <ProductCard
                v-for="product in pageElements"
                :key="product.id"
                :product="product"
                :show-description="false"
            />
        </div>
        <div v-else class="py-16 text-center text-gray-500">
            {{ $t('search.results.noResults') }}
        </div>

        <!-- Bottom controls -->
        <div class="flex flex-wrap items-center justify-between mt-4 gap-3">
            <div class="flex flex-wrap items-center gap-3">
                <ProductListingSorter
                    v-if="getSortingOrders?.length"
                    instance-id="search-sorter-bottom"
                    :current-sorting="getCurrentSortingOrder"
                    :available-sortings="getSortingOrders"
                    @update:sorting="onSortChange"
                />
                <ProductListingLimiter
                    instance-id="search-limiter-bottom"
                    :current-limit="getLimit"
                    @update:limit="onLimitChange"
                />
            </div>
            <ProductListingPagination
                v-if="getTotalPagesCount > 1"
                instance-id="search-pagination-bottom"
                :current-page="getCurrentPage"
                :total-pages="getTotalPagesCount"
                :base-route="baseRoute"
                @page-change="onPageChange"
            />
        </div>
    </div>
</template>
