<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import type { Schemas } from "#shopware"
import type { CmsElementImageGallery } from '@shopware/composables'
import { getBiggestThumbnailUrl } from "@shopware/helpers"
import { useModal } from '#hubble/composables/useModal'
import { useCmsElementConfig } from '#imports'

const props = defineProps<{
    content: CmsElementImageGallery
}>()

const { getConfigValue } = useCmsElementConfig(props.content)

// Current index for main image and thumbnails
const currentIndex = ref(0)
const imageSlider = ref()
const thumbnailSlider = ref()

// Gallery data and configuration
const mediaGallery = computed(() => props.content?.data?.sliderItems ?? [])
const isLoading = computed(() => !mediaGallery.value.length)
const galleryPosition = computed<string>(() =>
    getConfigValue("galleryPosition") ?? "left"
)

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
const fullscreenCarouselRef = ref<{ goToSlide: (index: number) => void } | null>(null)
const fullscreenModal = useModal('image-gallery-fullscreen')

// Check if media is spatial/3D
const isSpatial = (media: Schemas["Media"]) => {
    return media?.fileExtension === 'usdz' || media?.fileExtension === 'glb'
}

// Get media object from item
const getMedia = (item: CmsElementImageGallery['data']['sliderItems'][0]) => {
    return 'media' in item && typeof item.media === 'object'
        ? item.media
        : (item as Schemas["ProductMedia"]).media
}

// Get image source path
const srcPath = (item: CmsElementImageGallery['data']['sliderItems'][0]) => {
    const media = getMedia(item)
    if (media?.url) {
        return media.url
    }
    return getBiggestThumbnailUrl(media)
}

// Change main image when thumbnail is clicked
function changeCover(i: number) {
    if (i === currentIndex.value) return
    currentIndex.value = i
    imageSlider.value?.goToSlide(i)
}

// Handle slide change from main carousel
function handleChangeSlide(slideIndex: number) {
    currentIndex.value = slideIndex
    // Thumbnail carousel will auto-sync via selectedIndex prop
}

// Modal functions
function openModal(index: number) {
    if (!isFullscreenEnabled.value) return

    currentSlideIndex.value = index
    fullscreenModal.open()

    nextTick(() => {
        if (fullscreenCarouselRef.value && fullscreenCarouselRef.value.goToSlide) {
            fullscreenCarouselRef.value.goToSlide(index)
        }
    })
}

</script>

<template>
    <div
        :class="{
            'flex gap-10': true,
            'flex-col': galleryPosition !== 'left',
        }"
    >
        <!-- Main Image Display -->
        <div
            class="flex-1 overflow-hidden relative"
            :class="{ 'order-2': galleryPosition === 'left' }"
        >
            <!-- Fullscreen button -->
            <FoundationButton
                v-if="isFullscreenEnabled"
                size="small"
                :circle="true"
                class="absolute bg-white top-2 right-2 opacity-0 focus:opacity-100 transition-opacity z-10"
                :aria-label="$t('gallery.openFullscreen')"
                @click="openModal(currentIndex)"
            >
                <FoundationIcon name="scan" class="w-4 h-4" />
            </FoundationButton>

            <ComponentCarousel
                ref="imageSlider"
                :items="mediaGallery"
                :items-per-slide="{ default: 1 }"
                aspect-ratio="16/9"
                :auto-play="false"
                :loop="true"
                :gap="0"
                :loading="isLoading"
                :reserve-space="true"
                :show-navigation="navigationArrows"
                :show-indicators="navigationDots"
                @change-slide="handleChangeSlide"
            >
                <template #default="{ item, index }">
                    <div
                        v-if="isSpatial(getMedia(item as CmsElementImageGallery['data']['sliderItems'][0]))"
                        class="w-full h-full bg-muted flex items-center justify-center relative"
                    >
                        <FoundationIcon name="box" size="2xl" />
                        <span class="absolute bottom-4 left-4 text-sm bg-gray-800 rounded px-2 py-1 text-white">
                            {{ $t('gallery.3dModel') }}
                        </span>
                    </div>
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
        </div>

        <!-- Thumbnail Navigation -->
        <div
            class="hidden lg:flex flex-shrink-0"
            :class="{
                'order-1': galleryPosition === 'left',
                'w-full': galleryPosition !== 'left',
            }"
        >
            <ComponentThumbnailCarousel
                ref="thumbnailSlider"
                :items="mediaGallery"
                :selected-index="currentIndex"
                :vertical="galleryPosition === 'left'"
                :thumbnail-size="80"
                :gap="10"
                :show-navigation="true"
                :position="galleryPosition === 'left' ? 'left' : 'underneath'"
                :loading="isLoading"
                :skeleton-items="galleryPosition === 'left' ? 5 : 10"
                @thumbnail-select="changeCover"
            >
                <template #thumbnail="{ item }">
                    <div v-if="isSpatial(getMedia(item as CmsElementImageGallery['data']['sliderItems'][0]))" class="h-full relative">
                        <div class="w-full h-full bg-muted flex items-center justify-center">
                            <FoundationIcon name="box" size="lg" />
                        </div>
                        <span class="absolute bottom-0 text-xs bg-gray-800 rounded px-1 text-white">
                            3D
                        </span>
                    </div>
                    <img
                        v-else
                        loading="lazy"
                        :src="srcPath(item as CmsElementImageGallery['data']['sliderItems'][0])"
                        class="w-full h-full object-center object-contain"
                        :alt="getMedia(item as CmsElementImageGallery['data']['sliderItems'][0])?.alt || $t('gallery.productImage')"
                    >
                </template>
            </ComponentThumbnailCarousel>
        </div>

        <!-- Fullscreen Modal -->
        <ComponentModal
            v-if="isFullscreenEnabled"
            :controller="fullscreenModal"
            :close-on-click-outside="true"
            :fullscreen="true"
        >
            <ComponentCarousel
                ref="fullscreenCarouselRef"
                :key="`modal-${currentSlideIndex}`"
                :items="mediaGallery"
                :items-per-slide="{ default: 1 }"
                :loop="true"
                :show-navigation="'inside'"
                :show-indicators="'inside'"
                :auto-play="false"
                :gap="0"
                class="w-full h-full"
                :initial-slide="currentSlideIndex"
            >
                <template #default="{ item }">
                    <div
                        v-if="isSpatial(getMedia(item as CmsElementImageGallery['data']['sliderItems'][0]))"
                        class="w-full h-full bg-muted flex items-center justify-center relative"
                    >
                        <FoundationIcon name="box" size="2xl" />
                        <span class="absolute bottom-4 left-4 text-sm bg-gray-800 rounded px-2 py-1 text-white">
                            {{ $t('gallery.3dModel') }}
                        </span>
                    </div>
                    <img
                        v-else
                        :src="srcPath(item as CmsElementImageGallery['data']['sliderItems'][0])"
                        :alt="getMedia(item as CmsElementImageGallery['data']['sliderItems'][0])?.alt || $t('gallery.productImage')"
                        class="w-full h-full object-contain"
                    >
                </template>
            </ComponentCarousel>
        </ComponentModal>
    </div>
</template>