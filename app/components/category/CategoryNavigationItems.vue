<script setup lang="ts">
import type { Schemas } from "#shopware"

const props = withDefaults(
    defineProps<{
        activeCategory: Schemas["Category"]
        elements: Schemas["Category"][]
        level?: number
    }>(),
    {
        level: 0,
    },
)

function findChildById(navElement: Schemas["Category"], activeCategoryId: string): Schemas["Category"] | null {
    if (navElement.id === activeCategoryId) return navElement

    if (Array.isArray(navElement.children)) {
        for (const child of navElement.children) {
            const found = findChildById(child, activeCategoryId)
            if (found) return found
        }
    }

    return null
}

function isCurrentCategorySelected (navElement : Schemas["Category"]) {
    return findChildById(navElement, props.activeCategory?.id)
}

function getHighlightCategory(navigationElement: Schemas["Category"]) {
    return (
        (props.activeCategory?.path || "").includes(navigationElement.id) ||
        navigationElement.id === props.activeCategory?.id
    )
}
</script>
<template>
    <ul v-if="props.elements?.length" class="list-none m-0 px-5">
        <li
            v-for="(navigationElement, index) in props.elements"
            :key="index"
        >
            <CategoryNavigationItem
                :navigation-element="navigationElement"
                :is-highlighted="getHighlightCategory(navigationElement)"
                :is-active="navigationElement.id === props.activeCategory?.id"
                :is-expanded="navigationElement.id === props.activeCategory?.id"
            />
            <CategoryNavigationItems
                v-if="navigationElement.children && isCurrentCategorySelected(navigationElement)"
                :elements="navigationElement.children"
                :active-category="props.activeCategory"
                :level="navigationElement.level"
            />
        </li>
    </ul>
</template>
