<script setup lang="ts">
import type { CmsElementCategoryNavigation } from "@shopware/composables"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div v-else class="px-5">
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
</template>
