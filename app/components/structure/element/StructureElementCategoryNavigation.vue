<script setup lang="ts">
import type { Schemas } from "#shopware"
import { useWindowSize } from "@vueuse/core"
import { onMounted, onUnmounted, ref, computed, nextTick } from "vue"
import { useCategory, useNavigation } from "#imports"

const { category: activeCategory } = useCategory()
const loading = ref(true)
const categoryNavigation = ref<Schemas["Category"][]>([])
const menuElement = ref<HTMLElement | null>(null)
const lastScrollTop = ref(0)
const scrollListenerAttached = ref(false)

const currentCategoryId = activeCategory.value?.id ?? "main-navigation"
const parentCategoryId = activeCategory.value?.parentId ?? currentCategoryId
const { loadNavigationElements, navigationElements } = useNavigation({ type: parentCategoryId })
const minHeightForScollDampening = ref(0)
const { height: windowHeight } = useWindowSize()
const shouldDampenScroll = computed(() => windowHeight.value > minHeightForScollDampening.value)

onMounted(async () => {
    // depth 0 means, we load only first level of categories, depth 1 means we load first and second level of categories ...
    categoryNavigation.value = await loadNavigationElements({ depth: 1 })
    minHeightForScollDampening.value = window.innerHeight * 0.75 // 75% of viewport
    loading.value = false
    if (categoryNavigation.value.length > 0) {
        await setupStickyNavigation()
    }
})

onUnmounted(() => {
    if (scrollListenerAttached.value) {
        window.removeEventListener("scroll", handleNavigationScrollBehaviour)
    }
})

async function setupStickyNavigation() {
    await nextTick()

    const el = menuElement.value
    const block = el?.closest(".cms-block") as HTMLElement | null
    const header = getHeaderElement()

    if (!el || !block || !header) return

    const fitsViewport = (block.offsetHeight + header.clientHeight) <= window.innerHeight
    block.classList.add("sticky", "top-0")

    if (!fitsViewport) {
        window.addEventListener("scroll", handleNavigationScrollBehaviour, { passive: true })
        scrollListenerAttached.value = true
    }
}

function handleNavigationScrollBehaviour() {
    const el = menuElement.value
    const footer = getFooterElement()
    const currentScrollTop = window.scrollY

    if (!el) return

    const atTop = isAtTop(el)
    let deltaScroll = lastScrollTop.value - currentScrollTop

    const shouldScroll = footer
        ? footer.getBoundingClientRect().top > window.innerHeight
        : true

    if (atTop && shouldScroll) {
        if (deltaScroll > 0 && shouldDampenScroll.value) {
            deltaScroll -= 0.7 // dampen upward scroll
        }
        el.scrollTop -= deltaScroll
    }

    lastScrollTop.value = currentScrollTop
}

// Utilities
function isAtTop(el: HTMLElement): boolean {
    return el.getBoundingClientRect().top <= el.offsetTop
}

function getHeaderElement(): HTMLElement | null {
    return document.querySelector("header")
}

function getFooterElement(): HTMLElement | null {
    return document.querySelector("footer")
}
</script>

<template>
    <div ref="menuElement" role="navigation" :aria-label="$t('listing.sidenav.label')" class="hidden md:block">
        <ComponentCategoryNavigation
            v-if="navigationElements"
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
