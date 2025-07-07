<template>
    <FoundationButton
        v-if="!intersecting"
        :aria-label="$t('misc.backToTopBtn')"
        size="small"
        class="md:flex md:justify-end fixed bottom-5 right-0 z-[100] focus-style btn rounded-none bg-neutral text-primary-content"
        :style="{ opacity: buttonOpacity }"
        @click="scrollToTop"
        @keydown.enter="scrollToTop"
    >
        <span class="hidden lg:block">
            {{ $t('misc.backToTopBtn') }}
        </span>
        <FoundationIcon name="chevron-up" />
    </FoundationButton>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useElementBounding, useIntersectionObserver } from '@vueuse/core'

const buttonOpacity  = ref(1)
const scrollTimeout  = ref<number>()
const intersecting   = ref(true)
const referenceElement = ref<HTMLElement | null>(null)

function changeBtnStyleOnScroll () {
    buttonOpacity.value = 0.75
    clearTimeout(scrollTimeout.value)
    scrollTimeout.value = window.setTimeout(() => (buttonOpacity.value = 1), 500)
}

function scrollToTop () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

useIntersectionObserver(
    referenceElement,
    ([entry]) => {
        intersecting.value = entry?.isIntersecting ?? false
    }
)

watch(useElementBounding(referenceElement).top, changeBtnStyleOnScroll)

onMounted(() => {
    const header = document.querySelector('header') as HTMLElement | null
    if (header) {
        referenceElement.value = header
    }
})
</script>
