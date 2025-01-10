<script setup lang="ts">
import { type UnwrapNestedRefs } from 'vue'
import type { CmsElementSidebarFilter } from "@shopware-pwa/composables-next";
import type { RequestParameters } from "#shopware";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

const props = defineProps<{
    content: CmsElementSidebarFilter
}>()

const route = useRoute()
const router = useRouter()

const {
    changeCurrentSortingOrder,
    filtersToQuery,
    getCurrentFilters,
    getCurrentSortingOrder,
    getInitialFilters,
    getSortingOrders,
    search,
} = useCategoryListing();

const selectedFilters: UnwrapNestedRefs<{
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
    }));

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
            selectedFilters[param] = route.query[param];
        }
    }
}

async function onFilterChange () {
    await executeSearch()
}

async function executeSearch () {
    await search(searchCriteriaForRequest.value);
    const query = filtersToQuery(searchCriteriaForRequest.value);
    delete query.limit; // this will remove limit from the url query but still use it in the search
    router.push({
        query,
    });
}
</script>

<template>
    <client-only>
        <div v-if="getInitialFilters.length" class="flex gap-3 border">
            <div
                v-for="filter in getInitialFilters"
                :key="`${filter?.id || filter?.code}`"
            >
                <div>{{ getTranslatedProperty(filter, 'name') }}</div>
                <div v-if="filter.code === 'properties'" class="border flex flex-col">
                    <label v-for="option in filter.options" :key="option.id">
                        <input
                            v-model="selectedFilters.properties"
                            type="checkbox"
                            :value="option.id"
                            @change="onFilterChange()"
                        >
                        {{ getTranslatedProperty(option, 'name') }}
                    </label>
                </div>
                <div v-if="filter.code === 'manufacturer'" class="border flex flex-col">
                    <label v-for="entity in filter.entities" :key="entity.id">
                        <input
                            v-model="selectedFilters.manufacturer"
                            type="checkbox"
                            :value="entity.id"
                            @change="onFilterChange()"
                        >
                        {{ getTranslatedProperty(entity, 'name') }}
                    </label>
                </div>
            </div>
        </div>
        <template #fallback>
            <div class="flex gap-3">
                Loading...
            </div>
        </template>
    </client-only>
</template>
