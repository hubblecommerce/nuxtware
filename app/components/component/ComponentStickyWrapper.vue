<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"

const props = withDefaults(
    defineProps<{
        topBoundElement: HTMLElement | null,
        bottomBoundElement: HTMLElement | null,
        parentSelector: string,
        ariaLabel?: string
    }>(),
    {
        ariaLabel: 'Sticky Wrapper'
    },
)

const stickyElement = ref<HTMLElement | null>(null)
const lastScrollTop = ref(0)
const scrollListenerAttached = ref(false)
const minHeightForScrollDampening = ref(0)
const { height: windowHeight } = useWindowSize()
const shouldDampenScroll = computed(() => windowHeight.value > minHeightForScrollDampening.value)

onMounted(async () => {
    minHeightForScrollDampening.value = window.innerHeight * 0.75 // 75% of viewport
    await setupStickyNavigation()
})

onUnmounted(() => {
    if (scrollListenerAttached.value) {
        window.removeEventListener("scroll", handleScrollBehaviour)
    }
})
async function setupStickyNavigation() {
    const el = stickyElement.value
    const block = el?.closest(props.parentSelector) as HTMLElement | null

    if (!el || !block || !props.topBoundElement) return

    const fitsViewport = (block.offsetHeight + props.topBoundElement.clientHeight) <= window.innerHeight
    block.classList.add("sticky", "top-0")

    if (!fitsViewport) {
        window.addEventListener("scroll", handleScrollBehaviour, { passive: true })
        scrollListenerAttached.value = true
    }
}

function isAtTop(el: HTMLElement): boolean {
    return el.getBoundingClientRect().top <= el.offsetTop
}

function handleScrollBehaviour() {
    const el = stickyElement.value
    const currentScrollTop = window.scrollY

    if (!el) return

    const atTop = isAtTop(el)
    let deltaScroll = lastScrollTop.value - currentScrollTop

    const shouldScroll = props.bottomBoundElement
        ? props.bottomBoundElement.getBoundingClientRect().top > window.innerHeight
        : true

    if (atTop && shouldScroll) {
        if (deltaScroll > 0 && shouldDampenScroll.value) {
            deltaScroll -= 0.7 // dampen upward scroll
        }
        el.scrollTop -= deltaScroll
    }

    lastScrollTop.value = currentScrollTop
}
</script>
<template>
    <section ref="stickyElement" :aria-label="props.ariaLabel">
        <slot />
    </section>
</template>