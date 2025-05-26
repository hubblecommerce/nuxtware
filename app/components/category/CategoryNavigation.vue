<script setup lang="ts">
import type { Schemas } from "#shopware"
import { onMounted, ref } from "vue"
import { useCategory } from "#imports"

const props = withDefaults(
    defineProps<{
    showFullCategoryTree: boolean,
    depth?: number
}>(),
    {
        depth: 0
    }
)

const { category: activeCategory } = useCategory()
const currentCategoryId = activeCategory.value?.id ?? "main-navigation"
const parentCategoryId = activeCategory.value?.parentId ?? currentCategoryId
const layoutOfCategoryTree = computed(() => {
    // use type: 'main-navigation' to show full category tree or type: parentCategoryId to only show parent as level 0 in category nav
    return props.showFullCategoryTree ? { type: 'main-navigation'} : { type: parentCategoryId }
})
const { loadNavigationElements } = useNavigation(layoutOfCategoryTree.value)
const categoryNavigation = ref<Schemas["Category"][]>([])
const loading = ref(true)

onMounted(async () => {
    // depth 0 means, we load only first level of categories, depth 1 means we load first and second level of categories ...
    categoryNavigation.value = await loadNavigationElements({ depth: props.depth })
    loading.value = false
})
</script>
<template>
    <div
        role="navigation"
        :aria-label="$t('listing.sidenav.label')"
        class="hidden md:block"
    >
        <CategoryNavigationMenu
            v-if="categoryNavigation"
            :elements="categoryNavigation"
            :active-category="activeCategory"
        />
        <div v-if="loading">
            <div class="px-5">
                <span class="sr-only">
                    {{ $t('listing.sidenav.loading') }}
                </span>
                <div class="hidden lg:grid lg:gap-4">
                    <ComponentSkeleton preset="heading" />
                    <ComponentSkeleton preset="text" width="50%" />
                    <ComponentSkeleton preset="text" width="50%" />
                    <ComponentSkeleton preset="text" width="50%" />
                </div>
            </div>
        </div>
    </div>
</template>
