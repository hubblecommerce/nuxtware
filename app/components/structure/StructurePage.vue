<script setup lang="ts">
import type { Schemas } from "#shopware";
import { createCategoryListingContext, useNavigationContext } from '#imports'

const props = defineProps<{
    content: Schemas["CmsPage"];
}>();

// required to use useCategoryListing composable
const { routeName } = useNavigationContext();
if (routeName.value === "frontend.navigation.page") {
    createCategoryListingContext();
}
</script>

<template>
    <StructureSection
        v-for="(section, index) in content.sections"
        :key="index"
        :count="index"
        :content="section"
    />
</template>
