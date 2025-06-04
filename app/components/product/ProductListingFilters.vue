<script setup lang="ts">
import type { CmsElementSidebarFilter } from '@shopware/composables'
import type { RequestParameters } from '#shopware'
import type { RouteLocationRaw } from 'vue-router'
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

// Local reactive state for filters using Sets for multi-value filters
const selectedFilters = reactive<{
    manufacturer: Set<string>;
    properties: Set<string>;
    "min-price": string | number | undefined;
    "max-price": string | number | undefined;
    rating: string | number | undefined;
    "shipping-free": boolean | undefined;
    [key: string]: Set<string> | string | number | boolean | undefined;
}>({
    manufacturer: new Set<string>(),
    properties: new Set<string>(),
    "min-price": undefined,
    "max-price": undefined,
    rating: undefined,
    "shipping-free": undefined,
});

const searchCriteriaForRequest: ComputedRef<RequestParameters<"searchPage">> =
    computed(() => ({
        manufacturer: [...selectedFilters.manufacturer]?.join("|"),
        properties: [...selectedFilters.properties]?.join("|"),
        "min-price": Number(selectedFilters["min-price"]) || undefined,
        "max-price": Number(selectedFilters["max-price"]) || undefined,
        order: getCurrentSortingOrder.value,
        "shipping-free": Boolean(selectedFilters["shipping-free"]),
        rating: Number(selectedFilters.rating) || undefined,
        search: "",
        limit: route.query.limit ? Number(route.query.limit) : 15,
    }))

// Initialize selected filters from query
for (const param in route.query) {
    if (Object.prototype.hasOwnProperty.call(selectedFilters, param)) {
        if (
            selectedFilters[param] &&
            typeof selectedFilters[param] === "object"
        ) {
            const elements = (route.query[param] as unknown as string).split("|");
            for (const element of elements) {
                (selectedFilters[param] as Set<string>).add(element);
            }
        } else {
            const queryValue = route.query[param];
            if (queryValue && !Array.isArray(queryValue)) {
                selectedFilters[param] = queryValue;
            }
        }
    }
}

// Handle filter changes
const onOptionSelectToggle = async ({
    code,
    value,
}: {
    code: string;
    value: string;
}) => {
    if (!["properties", "manufacturer"].includes(code)) {
        selectedFilters[code] = value;
    } else {
        const filterSet = selectedFilters[code] as Set<string>;
        if (filterSet.has(value)) {
            filterSet.delete(value);
        } else {
            filterSet.add(value);
        }
    }
    await router.push({
        query: {
            ...filtersToQuery(searchCriteriaForRequest.value),
        },
    } as RouteLocationRaw);
    await search({
        ...searchCriteriaForRequest.value,
        ...route.query,
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterIsSelected (filter: any): boolean {
    let isSelected = false
    
    if (filter?.code === 'manufacturer' && selectedFilters.manufacturer?.size > 0) {
        isSelected = true
    }

    if (filter?.code === 'price' 
        && (
            selectedFilters['min-price'] != null && Number(selectedFilters['min-price']) > 0 && selectedFilters['min-price'] !== Math.floor(Number(filter.min)) || 
            selectedFilters['max-price'] != null && Number(selectedFilters['max-price']) > 0 && selectedFilters['max-price'] !== Math.floor(Number(filter.max))
        )) {
        isSelected = true
    }

    if (filter?.code === 'rating' && selectedFilters[filter?.code] != null && Number(selectedFilters[filter?.code]) > 0) {
        isSelected = true
    }

    if (filter?.code === 'shipping-free' && selectedFilters[filter?.code]) {
        isSelected = true
    }

    if (filter?.code === 'properties') {
        for (const optionId of selectedFilters.properties) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filter?.options?.map((option: any) => {
                if (option?.id === optionId) isSelected = true
            })
        }   
    }

    return isSelected
}

// Clear all filters
const clearFilters = async () => {
    selectedFilters.manufacturer.clear();
    selectedFilters.properties.clear();
    selectedFilters["min-price"] = undefined;
    selectedFilters["max-price"] = undefined;
    selectedFilters.rating = undefined;
    selectedFilters["shipping-free"] = undefined;
    await router.push({
        query: {
            ...filtersToQuery(searchCriteriaForRequest.value),
        },
    } as RouteLocationRaw);
};

async function onResetFilters() {
    await clearFilters();
    await search({
        ...route.query,
        ...filtersToQuery(searchCriteriaForRequest.value),
    });
}

// Computed properties for displaying current state
const selectedOptionIds = computed(() => [
    ...selectedFilters.properties,
    ...selectedFilters.manufacturer,
]);

const showResetFiltersButton = computed<boolean>(() => {
    if (
        selectedOptionIds.value.length !== 0 ||
        selectedFilters["max-price"] ||
        selectedFilters["min-price"] ||
        selectedFilters.rating ||
        selectedFilters["shipping-free"]
    ) {
        return true;
    }
    return false;
});

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
        
        <ComponentCollapsible
            v-if="getInitialFilters.length"
            id="filterContainer"
            :items="getInitialFilters"
            :show-more-text="$t('listing.filter.showMore')"
            :show-less-text="$t('listing.filter.showLess')"
            :is-desktop-mode="lgAndLarger"
            class="flex flex-col gap-3 px-2 lg:flex-row lg:flex-wrap lg:px-0"
        >
            <template #default="{ shouldRenderItem, setItemRef }">
                <!-- Visible filters -->
                <template v-for="(filter, index) in getInitialFilters" :key="`${filter?.id || filter?.code}`">
                    <div
                        v-if="shouldRenderItem(filter)"
                        :ref="el => setItemRef(el as HTMLElement, index)"
                        class="relative"
                    >
                        <ComponentDropdown
                            :trigger-label="filter?.code === 'properties' ? getTranslatedProperty(filter, 'name') : getStaticFilterName(filter?.code)"
                            class="w-full border btn-small justify-between"
                            content-classes="bg-white w-full p-2 z-50 lg:origin-top-left lg:absolute lg:left-0 lg:mt-2 lg:w-56 lg:rounded-xs lg:shadow-lg lg:border"
                        >
                            <component
                                :is="filterMap(filter?.code)"
                                :filter="filter"
                                :selected-filters="selectedFilters"
                                @select-filter-value="onOptionSelectToggle"
                            />
                        </ComponentDropdown>
                        <div v-if="filterIsSelected(filter)" class="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full" />
                    </div>
                </template>
            </template>
            
            <!-- Custom toggle button slot implementation -->
            <template #toggle-button="{ toggle, isExpanded, hasOverflow }">
                <FoundationButton
                    v-if="hasOverflow || (isExpanded && !hasOverflow)"
                    color="secondary"
                    variant="outline"
                    size="small"
                    :class="[
                      'lg:flex items-center',
                      isExpanded ? 'relative' : 'absolute right-0'
                    ]"
                    :aria-expanded="isExpanded"
                    aria-controls="filterContainer"
                    @click="toggle"
                >
                    {{ isExpanded ? $t('listing.filter.showLess') : $t('listing.filter.showMore') }}
                    <FoundationIcon :name="hasOverflow || (isExpanded && hasOverflow) ? 'chevron-down' : 'chevron-up'" class="ml-1" />
                </FoundationButton>
            </template>
        </ComponentCollapsible>

        <!-- Reset filters button -->
        <div v-if="showResetFiltersButton" class="px-2 mt-3 lg:px-0">
          <FoundationButton 
              variant="outline"
              size="small"
              class="w-full lg:w-auto"
              @click="onResetFilters()"
          >
            {{ $t('listing.filter.reset') }}
          </FoundationButton>
        </div>
        
        <template #fallback>
            <span class="sr-only">{{ $t('listing.filter.loading') }}</span>
            <div class="hidden lg:flex flex-wrap gap-3">
                <ComponentSkeleton preset="button" :repeat="4" />
            </div>
        </template>
    </SidenavOverlay>
</template>