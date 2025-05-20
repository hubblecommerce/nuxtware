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

// NEW CODE FOR ACCESSIBLE FILTER SYSTEM WITH RESIZE OBSERVER AND SHOW MORE/LESS
// References for DOM elements
const filterContainerRef = ref<HTMLElement | null>(null);
const filterRefs = ref<HTMLElement[]>([]);
const showMoreButtonRef = ref<HTMLElement | null>(null);

// State for show more/less functionality
const isExpanded = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const visibleFilters = ref<any[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hiddenFilters = ref<any[]>([]);
const hasOverflow = ref(false);
const initialHiddenCount = ref(0); // Store the initial hidden count
const isInitializing = ref(true); // Track initialization phase
const isCalculating = ref(false); // Prevent calculation loops
const isToggling = ref(false); // Prevent resize observer from interfering with toggling

// Fixed filter widths (to prevent recalculation loops)
const filterWidths = ref<number[]>([]);

// Computed property to determine if we should show the toggle button
const showToggleButton = computed(() => {
  return (hasOverflow.value || isExpanded.value) && lgAndLarger.value;
});

// Set up ResizeObserver to detect when filters overflow
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  // Allow time for SidenavOverlay animation and rendering
  setTimeout(() => {
    // Phase 1: Initialize all filters as visible to get their dimensions
    if (getInitialFilters.value && getInitialFilters.value.length) {
      isInitializing.value = true;
      visibleFilters.value = [...getInitialFilters.value];
    }
    
    // Phase 2: After filters are rendered and measured, calculate actual visibility
    // Store the filter widths just once during initialization
    captureFilterWidths();
    
    // Now that we have widths, calculate visibility once
    calculateVisibleFilters();
    
    // Store the initial count of hidden filters for future reference
    initialHiddenCount.value = hiddenFilters.value.length;
    
    // Only now initialize ResizeObserver and end initialization
    initResizeObserver();
    isInitializing.value = false;
    
    // Add window resize handler only after initialization
    window.addEventListener('resize', handleResize);
  }, 300);
});

onBeforeUnmount(() => {
  // Clean up
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', handleResize);
});

// Capture filter widths once during initialization
function captureFilterWidths() {
  filterWidths.value = [];
  
  if (getInitialFilters.value && filterRefs.value.length) {
    getInitialFilters.value.forEach((_, index) => {
      const element = filterRefs.value[index];
      if (element) {
        filterWidths.value.push(element.offsetWidth);
      } else {
        filterWidths.value.push(0); // Fallback
      }
    });
  }
}

function initResizeObserver() {
  if (!filterContainerRef.value) return;
  
  resizeObserver = new ResizeObserver(entries => {
    // Skip if we're in a special state
    if (entries.length === 0 || isInitializing.value || isCalculating.value || isToggling.value) return;
    
    // Only recalculate based on container width changes, not filter visibility changes
    const entry = entries[0];
    if (entry?.contentRect) {
      handleResize();
    }
  });
  
  resizeObserver.observe(filterContainerRef.value);
}

function handleResize() {
  // Skip resize handling during toggle operations
  if (isToggling.value) return;
  
  if (!isCalculating.value && !isToggling.value) {
    calculateVisibleFilters();
  }
}

function calculateVisibleFilters() {
  if (isCalculating.value || !filterContainerRef.value || !getInitialFilters.value?.length) return;
  
  // Set calculating flag to prevent recursive calls
  isCalculating.value = true;
  
  try {
    const containerWidth = filterContainerRef.value.offsetWidth - 80; // Account for button width & spacing
    let availableWidth = containerWidth;
    
    // Reset arrays
    visibleFilters.value = [];
    hiddenFilters.value = [];
    
    // Use stored filter widths rather than measuring dynamically
    getInitialFilters.value.forEach((filter, index) => {
      const filterWidth = filterWidths.value[index] || 0;
      const marginSpace = 12; // Account for gap between filters (3rem = 12px)
      
      if (availableWidth >= (filterWidth + marginSpace) || isExpanded.value) {
        visibleFilters.value.push(filter);
        availableWidth -= (filterWidth + marginSpace);
      } else {
        hiddenFilters.value.push(filter);
      }
    });
    
    // Determine if we have overflow based on current calculation
    hasOverflow.value = hiddenFilters.value.length > 0;
    
    // CRITICAL FIX: Only override expanded state during initialization, not during user toggling
    if (!isToggling.value && isExpanded.value && hiddenFilters.value.length === 0) {
      isExpanded.value = false;
    }
  } finally {
    // Always reset the calculating flag
    isCalculating.value = false;
  }
}

function toggleExpandFilters() {
  // Set toggling flag to prevent interference
  isToggling.value = true;
  
  // Toggle state
  isExpanded.value = !isExpanded.value;
  
  // Use nextTick to ensure DOM is updated before focusing elements
  nextTick(() => {
    // Force a recalculation with isToggling still true
    calculateVisibleFilters();
    window.setTimeout(() => {
      isToggling.value = false;
    }, 1); // Small delay for DOM updates
  });
}

// Register a filter ref
function setFilterRef(el: HTMLElement | null, index: number) {
  if (el) {
    filterRefs.value[index] = el;
  }
}

// Determine if a filter should be rendered based on visibility state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shouldRenderFilter(filter: any): boolean {
  // During initialization or toggling, render everything to ensure proper measurements
  if (isInitializing.value || isToggling.value) {
    return true;
  }
  
  // When expanded, render everything
  if (isExpanded.value) {
    return true;
  }
  
  // When collapsed, only render visible filters
  return visibleFilters.value.some((visibleFilter) => {
    if (visibleFilter.id != null && filter.id != null) {
      return visibleFilter.id === filter.id;
    } else {
      return visibleFilter.code === filter.code;
    }
  });
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
        <div
            v-if="getInitialFilters.length"
            id="filterContainer"
            ref="filterContainerRef"
            role="region"
            aria-live="polite"
            class="relative flex flex-col gap-3 px-2 lg:flex-row lg:flex-wrap lg:px-0"
        >
            <!-- Visible filters -->
            <template v-for="(filter, index) in getInitialFilters" :key="`${filter?.id || filter?.code}`">
                <div
                    v-if="shouldRenderFilter(filter)"
                    :ref="el => setFilterRef(el as HTMLElement, index)"
                    class="relative"
                >
                    <ComponentDropdown
                        :trigger-label="filter?.code === 'properties' ? getTranslatedProperty(filter, 'name') : getStaticFilterName(filter?.code)"
                        class="w-full border btn-small justify-between"
                        content-classes="bg-white w-full p-2 z-10 lg:origin-top-left lg:absolute lg:left-0 lg:mt-2 lg:w-56 lg:rounded-xs lg:shadow-lg lg:border"
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
            
            <!-- Gradient fade for partially visible filters (desktop only) - only show in collapsed state -->
            <div 
                v-if="hasOverflow && !isExpanded && lgAndLarger" 
                class="hidden lg:block absolute right-12 h-full w-16 pointer-events-none"
                style="background: linear-gradient(to left, white, transparent);"
                aria-hidden="true"
            />
            
            <!-- Show More/Less button (desktop only) - dynamic positioning based on state -->
            <FoundationButton
                v-if="showToggleButton"
                ref="showMoreButtonRef"
                variant="ghost"
                size="small"
                :class="[
                  'lg:flex items-center',
                  isExpanded ? 'relative' : 'absolute right-0'
                ]"
                :aria-expanded="isExpanded"
                aria-controls="filterContainer"
                @click="toggleExpandFilters"
            >
                {{ isExpanded ? $t('listing.filter.showLess') : $t('listing.filter.showMore') }}
                <FoundationIcon :name="isExpanded ? 'chevron-up' : 'chevron-down'" class="ml-1" />
            </FoundationButton>
            
            <!-- Reset filters button -->
            <FoundationButton 
                v-if="showResetFiltersButton"
                class="lg:ml-auto"
                variant="ghost"
                size="small"
                @click="onResetFilters()"
            >
                {{ $t('listing.filter.reset') }}
            </FoundationButton>
        </div>
        <template #fallback>
            <span class="sr-only">{{ $t('listing.filter.loading') }}</span>
            <div class="hidden lg:flex flex-wrap gap-3">
                <ComponentSkeleton preset="button" :repeat="8" />
            </div>
        </template>
    </SidenavOverlay>
</template>
