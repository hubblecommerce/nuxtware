<script setup lang="ts">
import type { CmsElementCategoryNavigation } from "@shopware/composables";

const props = defineProps<{
    content: CmsElementCategoryNavigation;
}>()
</script>

<template>
    <CategoryNavigation />
</template>
