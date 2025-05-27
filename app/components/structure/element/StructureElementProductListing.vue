<script setup lang="ts">
import type { CmsElementProductListing } from "@shopware/composables";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementProductListing;
}>()
</script>

<template>
    <ProductListing 
        v-if="content?.data?.listing" 
        :listing="content.data.listing" 
        :show-top-sorter="content?.config?.showSorting?.value"
        :layout-type="content?.config?.boxLayout?.value"
        show-top-pagination
        show-top-limiter
    />
</template>
