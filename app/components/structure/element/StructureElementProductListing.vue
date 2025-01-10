<script setup lang="ts">
import type { CmsElementProductListing } from "@shopware-pwa/composables-next";

const props = defineProps<{
    content: CmsElementProductListing;
}>()
</script>

<template>
    <ProductListing v-if="content?.data?.listing" :listing="content.data.listing" />
</template>
