<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
    listing: Schemas['ProductListingResult']
}>()

const {
    changeCurrentPage,
    getCurrentPage,
    getElements,
    getTotalPagesCount,
    loading,
    setInitialListing,
} = useCategoryListing();

setInitialListing(
    props?.listing as Schemas["ProductListingResult"],
);
</script>

<template>
    <div>
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
    </div>
</template>
