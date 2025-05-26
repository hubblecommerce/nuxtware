<script setup lang="ts">
import type { CmsElementCategoryNavigation } from "@shopware/composables";

const props = defineProps<{
    content: CmsElementCategoryNavigation
}>()

const topBoundElement = ref<HTMLElement | null>(null)
const bottomBoundElement = ref<HTMLElement | null>(null)

function getDomElement(selector: string): HTMLElement | null {
    return document.querySelector(selector)
}

onMounted(() => {
    topBoundElement.value = getDomElement('header')
    bottomBoundElement.value = getDomElement('footer')
})
</script>

<template>
    <ComponentStickyWrapper
        v-if="topBoundElement || bottomBoundElement"
        :top-bound-element="topBoundElement"
        :bottom-bound-element="bottomBoundElement"
        parent-selector=".cms-block"
    >
        <CategoryNavigation :show-full-category-tree="true" :depth="3" />
    </ComponentStickyWrapper>
</template>
