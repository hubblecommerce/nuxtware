<template>
    <div
        v-if="!intersecting"
        class="md:flex md:justify-end fixed bottom-[100px] right-0 z-[100] focus-style"
        role="button"
        tabindex="0"
        :style="{ opacity: buttonOpacity }"
        @click="scrollToTop"
        @keydown.enter="scrollToTop"
    >
        <div
            type="button"
            class="btn rounded-none bg-neutral text-primary-content"
            :aria-label="$t('misc.backToTopBtn')"
        >
            <span class="hidden lg:block">
                {{ $t('misc.backToTopBtn') }}
            </span>
            <FoundationIcon name="chevron-up" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useElementBounding, useWindowSize } from '@vueuse/core'

const { width: windowWidth } = useWindowSize()

const buttonOpacity = ref(1)
const scrollTimeout = ref<number | undefined>(0)
const intersecting = ref(true)
const referenceElement = ref<HTMLElement | null>()
const lastScrollPos = ref(0)

let observer = null
if (import.meta.client) {
    observer = new IntersectionObserver((entries) => {
        for (const { isIntersecting } of entries) {
            intersecting.value = isIntersecting
        }
    })
}

const isMobile = computed(() => {
    return windowWidth.value <= 768
})

function changeBtnStyleOnScroll () {
    buttonOpacity.value = 0.75
    if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
    }
    scrollTimeout.value = window.setTimeout(() => {
        buttonOpacity.value = 1
    }, 500)
}

function scrollToTop () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

watch(useElementBounding(referenceElement).top, (newVal) => {
    lastScrollPos.value = newVal
    changeBtnStyleOnScroll()
})

onMounted(() => {
    referenceElement.value = isMobile.value ? document.querySelector('header')?.nextElementSibling : document.querySelector('header')
    if (observer && referenceElement.value?.offsetHeight) observer.observe(referenceElement.value)
})

onUnmounted(() => {
    if (observer && referenceElement.value != null) observer.unobserve(referenceElement.value)
})
</script>
