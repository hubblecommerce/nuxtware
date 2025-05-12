<script setup lang="ts">
import type { CmsElementProductListing } from "@shopware/composables";

const props = defineProps<{
    content: CmsElementProductListing;
}>()
</script>

<template>
    <ProductListing 
        v-if="content?.data?.listing" 
        :listing="content.data.listing" 
        showTopPagination
        showTopLimiter
        showTopSorter
    />
</template>
