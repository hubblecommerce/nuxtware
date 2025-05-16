<script setup lang="ts">
import type { CmsElementSidebarFilter } from "@shopware/composables";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementSidebarFilter
}>()
</script>

<template>
    <ProductListingFilters :content="content" />
</template>
