<script setup lang="ts">
import type { CmsElementImageGallery } from '@shopware/composables'
import { getBiggestThumbnailUrl } from "@shopware/helpers"
import { ref, nextTick } from 'vue'
import { useModal } from '../../../composables/useModal'

 
const props = defineProps<{
    content: CmsElementImageGallery
}>()

// Follow Shopware's pattern exactly - use sliderItems directly
const mediaGallery = computed(() => props.content?.data?.sliderItems ?? [])

const srcPath = (item: CmsElementImageGallery['data']['sliderItems'][0]) => {
    // Following Shopware's pattern: item.media.url
    if (item.media?.url) {
        return item.media.url
    }
    
    // Fallback to getBiggestThumbnailUrl for better quality
    if (item.media) {
        return getBiggestThumbnailUrl(item.media)
    }
    
    // Handle direct media objects
    if (item.url || item.thumbnails) {
        return getBiggestThumbnailUrl(item)
    }
    
    return ''
}

// Extract navigation and indicator configuration from Shopware config
const navigationArrows = computed(() => {
    const config = props.content?.config?.navigationArrows?.value
    if (config === '' || !config) return false
    return config
})

const navigationDots = computed(() => {
    const config = props.content?.config?.navigationDots?.value
    if (config === '' || !config) return false
    return config
})

// Check if fullscreen is enabled in backend config
const isFullscreenEnabled = computed(() => {
    return props.content?.config?.fullScreen?.value === true
})

// Modal state
const currentSlideIndex = ref(0)
const carouselRef = ref<InstanceType<typeof ComponentCarousel> | null>(null)
const fullscreenCarouselRef = ref<InstanceType<typeof ComponentCarousel> | null>(null)
const fullscreenModal = useModal('image-gallery-fullscreen')

// Track current slide for button access
const currentSlide = ref(0)
const handleSlideChange = (index: number) => {
    currentSlide.value = index
}

// Modal functions
function openModal(index: number) {
    // Only open modal if fullscreen is enabled
    if (!isFullscreenEnabled.value) return

    // Use the click index directly - this is the standard approach
    currentSlideIndex.value = index

    fullscreenModal.open()

    // Manually navigate to the correct slide after modal opens
    nextTick(() => {
        if (fullscreenCarouselRef.value && fullscreenCarouselRef.value.goToSlide) {
            fullscreenCarouselRef.value.goToSlide(index)
        }
    })
}
</script>

<template>
    <div class="relative">
        <!-- Single keyboard-accessible fullscreen button for entire gallery -->
        <FoundationButton
            v-if="isFullscreenEnabled"
            size="small"
            :circle="true"
            class="absolute bg-white top-2 right-2 opacity-0 focus:opacity-100 transition-opacity z-10"
            :aria-label="$t('gallery.openFullscreen')"
            @click="openModal(currentSlide)"
        >
            <FoundationIcon name="scan" class="w-4 h-4" />
        </FoundationButton>

        <ComponentCarousel
            ref="carouselRef"
            :items="mediaGallery"
            :items-per-slide="{ default: 1 }"
            aspect-ratio="16/9"
            :auto-play="false"
            :loop="true"
            :gap="0"
            :reserve-space="true"
            :show-navigation="navigationArrows"
            :show-indicators="navigationDots"
            @slide-change="handleSlideChange"
        >
            <template #default="{ item }">
                <FoundationImage
                    :src="srcPath(item as CmsElementImageGallery['data']['sliderItems'][0])"
                    :alt="item.media?.alt || item.alt || ''"
                    :class="[
                        'w-full h-full object-cover',
                        { 'cursor-zoom-in': isFullscreenEnabled }
                    ]"
                    @click="openModal(index)"
                />
            </template>
        </ComponentCarousel>

        <!-- Fullscreen Modal using ComponentModal -->
        <ComponentModal
            v-if="isFullscreenEnabled"
            :controller="fullscreenModal"
            :close-on-click-outside="true"
            :fullscreen="true"
        >
            <ComponentCarousel
                ref="fullscreenCarouselRef"
                :items="mediaGallery"
                :items-per-slide="{ default: 1 }"
                :loop="true"
                :show-navigation="'inside'"
                :show-indicators="'inside'"
                :auto-play="false"
                :gap="0"
                class="w-full h-full"
                :key="`modal-${currentSlideIndex}`"
                :initial-slide="currentSlideIndex"
            >
                <template #default="{ item }">
                    <img
                        :src="srcPath(item as CmsElementImageGallery['data']['sliderItems'][0])"
                        :alt="item.media?.alt || item.alt || ''"
                        class="w-full h-full object-contain"
                    >
                </template>
            </ComponentCarousel>
        </ComponentModal>
    </div>
</template>
