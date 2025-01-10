<script setup lang="ts">
import type { CmsElementSidebarFilter } from "@shopware-pwa/composables-next";

const props = defineProps<{
    content: CmsElementSidebarFilter
}>()
</script>

<template>
    <ProductListingFilters :content="content" />
</template>
