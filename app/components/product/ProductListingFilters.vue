<script setup lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import type { CmsElementSidebarFilter } from '@shopware/composables'
import type { RequestParameters } from '#shopware'
import { getTranslatedProperty } from '@shopware/helpers'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import {
    ProductListingFilterPrice,
    ProductListingFilterProperties,
    ProductListingFilterRating,
    ProductListingFilterShippingFree
} from '#components'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementSidebarFilter
}>()

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

const {
    filtersToQuery,
    getCurrentSortingOrder,
    getInitialFilters,
    search
} = useCategoryListing();

const selectedFilters: UnwrapNestedRefs<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}> = reactive<{
    manufacturer: Array<string>;
    properties: Array<string>;
    "min-price": string | number | undefined;
    "max-price": string | number | undefined;
    rating: string | number | undefined;
    "shipping-free": boolean | undefined;
}>({
    manufacturer: [],
    properties: [],
    "min-price": undefined,
    "max-price": undefined,
    rating: undefined,
    "shipping-free": undefined,
});

const searchCriteriaForRequest: ComputedRef<RequestParameters<"searchPage">> =
    computed(() => ({
        manufacturer: selectedFilters.manufacturer?.join("|"),
        properties: selectedFilters.properties?.join("|"),
        "min-price": selectedFilters["min-price"],
        "max-price": selectedFilters["max-price"],
        order: getCurrentSortingOrder.value,
        "shipping-free": selectedFilters["shipping-free"],
        rating: selectedFilters["rating"],
        search: "",
        limit: route.query.limit ? Number(route.query.limit) : 15,
    }))

// Set selected filters from query
for (const param in route.query) {
    if (Object.prototype.hasOwnProperty.call(selectedFilters, param)) {
        if (
            selectedFilters[param] &&
            typeof selectedFilters[param] === "object"
        ) {
            (route.query[param] as unknown as string)
            .split("|")
            .forEach((element) => {
                selectedFilters[param].push(element)
            });
        } else {
            selectedFilters[param] = route.query[param]
        }
    }
}

async function onFilterChange () {
    await executeSearch()
}

async function executeSearch () {
    await search(searchCriteriaForRequest.value);
    const query = filtersToQuery(searchCriteriaForRequest.value) as { query: string };
    router.push({
        query,
    });
}

const open = ref(false)
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndLarger = breakpoints.greaterOrEqual('lg')

/*
* Filter Types
*/
const filterMap = (filterCode: string) => {
  const map: {
    [key: string]: object;
  } = {
    manufacturer: ProductListingFilterProperties,
    properties: ProductListingFilterProperties,
    price: ProductListingFilterPrice,
    rating: ProductListingFilterRating,
    'shipping-free': ProductListingFilterShippingFree,
  };

  return map[filterCode];
};

const getStaticFilterName = (filterCode: string): string => {
const map: {
    [key: string]: string;
  } = {
    manufacturer: t('listing.filter.manufacturerLabel'),
    price: t('listing.filter.priceLabel'),
    rating: t('listing.filter.ratingLabel'),
    'shipping-free': t('listing.filter.shippingFreeLabel'),
  };

  return map[filterCode] ? map[filterCode] : '';
}
</script>

<template>
    <FoundationButton color="primary" class="w-full lg:hidden" @click="open = true">
        {{ $t('listing.filter.title') }}
    </FoundationButton>
    <SidenavOverlay v-model="open" :unwrap="lgAndLarger" class="bg-white">
        <div class="flex justify-between items-center p-2 pr-0 lg:hidden">
            <FoundationHeadline tag="h2" class="text-lg font-semibold">{{ $t('listing.filter.title') }}</FoundationHeadline>
            <FoundationButton
                ref="sidenavMenuCloseButton"
                size="medium"
                variant="ghost"
                square
                @click="open = false"
            >
                <span class="sr-only">{{ $t('listing.filter.close') }}</span>
                <FoundationIcon name="x" />
            </FoundationButton>
        </div>
        <div v-if="getInitialFilters.length" class="flex flex-col gap-3 px-2 lg:flex-row lg:flex-wrap lg:px-0">
            <div v-for="filter in getInitialFilters" :key="`${filter?.id || filter?.code}`">
                <ComponentDropdown
                    :trigger-label="filter?.code === 'properties' ? getTranslatedProperty(filter, 'name') : getStaticFilterName(filter?.code)"
                    class="w-full border btn-small justify-between"
                    content-classes="bg-white w-full p-2 z-10 lg:origin-top-left lg:absolute lg:left-0 lg:mt-2 lg:w-56 lg:rounded-xs lg:shadow-lg lg:border"
                >
                    <component
                        :is="filterMap(filter?.code)"
                        :filter="filter"
                        :selected-filters="selectedFilters"
                        @select-value="onFilterChange()"
                    />
                </ComponentDropdown>
            </div>
        </div>
        <template #fallback>
            <span class="sr-only">{{ $t('listing.filter.loading') }}</span>
            <div class="hidden lg:flex flex-wrap gap-3">
                <ComponentSkeleton preset="button" :repeat="8" />
            </div>
        </template>
    </SidenavOverlay>
</template>
