<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers";
import type { Schemas } from "#shopware";

const { category: activeCategory } = useCategory();
const loading: Ref<boolean> = ref(true);
const categoryNavigation: Ref<Schemas["Category"][]> = ref([]);
const currentCategoryId = activeCategory.value?.id ?? "main-navigation";
const { loadNavigationElements } = useNavigation({
    type: currentCategoryId,
});

onMounted(async () => {
    // depth 0 means, we load only first level of categories, depth 1 means we load first and second level of categories ...
    categoryNavigation.value = await loadNavigationElements({ depth: 0 });
    loading.value = false;
});
</script>

<template>
    <div>
        <div
            v-if="categoryNavigation && categoryNavigation.length > 0"
            class="cms-element-category-navigation max-w-(--breakpoint-xl) mx-auto"
        >
            <div class="text-3xl tracking-tight text-secondary-900 m-0 px-5">
                {{ getTranslatedProperty(activeCategory, "name") }}
            </div>
            <CategoryNavigation
                :level="0"
                :elements="categoryNavigation"
                :active-category="activeCategory"
            />
        </div>
        <div v-if="loading">
            Loading...
        </div>
    </div>
</template>
