<script setup lang="ts">
import type { CmsElementCategoryNavigation } from "@shopware/composables";
import {useCategory, useNavigation} from "#imports";
import type { Schemas } from "#shopware"

const props = defineProps<{
    content: CmsElementCategoryNavigation
}>()
const { category: activeCategory } = useCategory()
const currentCategoryId = activeCategory.value?.id ?? "main-navigation"
const parentCategoryId = activeCategory.value?.parentId ?? currentCategoryId
// use type: 'main-navigation' to show full category tree or type: parentCategoryId to only show parent as level 0 in category nav
const { loadNavigationElements } = useNavigation({ type: 'main-navigation' })
const categoryNavigation = ref<Schemas["Category"][]>([])

onMounted(async () => {
    // depth 0 means, we load only first level of categories, depth 1 means we load first and second level of categories ...
    categoryNavigation.value = await loadNavigationElements({ depth: 3 })
})
</script>

<template>
    <CategoryNavigation :nav-content="categoryNavigation" />
</template>
