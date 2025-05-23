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
        :limit-top-element="topBoundElement"
        :limit-bottom-element="bottomBoundElement"
        closest-el-to-stick-to=".cms-block"
        aria-label="Sticky Category Navigation Wrapper"
    >
        <CategoryNavigation :show-full-category-tree="true" />
    </ComponentStickyWrapper>
</template>
