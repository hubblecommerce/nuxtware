<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import type { Schemas } from "#shopware"
import type { CmsElementImageGallery } from '@shopware/composables'
import { getBiggestThumbnailUrl } from "@shopware/helpers"
import { useModal } from '#nuxtware/composables/useModal'
import { useCmsElementConfig } from '#imports'

type SliderItem = CmsElementImageGallery['data']['sliderItems'][0]
type CarouselRef = { goToSlide: (index: number) => void } | null

const props = defineProps<{
    content: CmsElementImageGallery
}>()

const { getConfigValue } = useCmsElementConfig(props.content)
const fullscreenModal = useModal('image-gallery-fullscreen')

const mainCarouselRef = ref<CarouselRef>(null)
const fullscreenCarouselRef = ref<CarouselRef>(null)
const currentSlideIndex = ref(0)

// Gallery Configuration
const mediaGallery = computed<SliderItem[]>(() => props.content?.data?.sliderItems ?? [])
const galleryPosition = computed(() => getConfigValue("galleryPosition") ?? "left")

// UI Configuration - Extract values from Shopware config
const getRawConfigValue = (key: keyof typeof props.content.config) => {
    const config = props.content?.config?.[key]?.value
    return config
}

const getConfigBoolean = (key: keyof typeof props.content.config) => {
    const config = props.content?.config?.[key]?.value
    return config !== '' && !!config
}

const navigationArrows = computed(() => {
    const value = getRawConfigValue('navigationArrows') as string | undefined
    return value === 'none' || value === '' ? false : (value as 'inside' | 'outside')
})
const navigationDots = computed(() => {
    const value = getRawConfigValue('navigationDots') as string | undefined
    return value === 'none' || value === '' ? false : (value as 'inside' | 'outside')
})
const isFullscreenEnabled = computed(() => getConfigBoolean('fullScreen'))

// Layout Configuration
const isVerticalLayout = computed(() => galleryPosition.value === 'left')
const thumbnailContainerStyle = computed(() => ({
    width: isVerticalLayout.value ? '120px' : '100%',
    height: isVerticalLayout.value ? '600px' : '120px',
}))

// Media Utilities
const isSpatial = (media: Schemas["Media"]) => {
    return media?.fileExtension === 'usdz' || media?.fileExtension === 'glb'
}

const getMedia = (item: SliderItem) => {
    return 'media' in item && typeof item.media === 'object'
        ? item.media
        : (item as Schemas["ProductMedia"]).media
}

const getImageSrc = (item: SliderItem) => {
    const media = getMedia(item)
    return media?.url || getBiggestThumbnailUrl(media)
}

// Thumbnail Scrolling Logic
const scrollThumbnailsToShow = (index: number) => {
    const thumbnailContainer = document.querySelector('.thumbnail-container') as HTMLElement
    if (!thumbnailContainer) return

    const thumbnailButtons = thumbnailContainer.querySelectorAll('button')
    const selectedThumbnail = thumbnailButtons[index] as HTMLElement
    if (!selectedThumbnail) return

    const scrollConfig = isVerticalLayout.value
        ? calculateVerticalScroll(thumbnailContainer, selectedThumbnail)
        : calculateHorizontalScroll(thumbnailContainer, selectedThumbnail)

    if (scrollConfig.shouldScroll) {
        thumbnailContainer.scrollTo({
            ...scrollConfig.scrollOptions,
            behavior: 'smooth'
        })
    }
}

const calculateVerticalScroll = (container: HTMLElement, thumbnail: HTMLElement) => {
    const containerHeight = container.clientHeight
    const thumbnailHeight = thumbnail.offsetHeight
    const thumbnailTop = thumbnail.offsetTop
    const containerScrollTop = container.scrollTop

    const thumbnailVisibleTop = thumbnailTop - containerScrollTop
    const thumbnailVisibleBottom = thumbnailVisibleTop + thumbnailHeight
    const shouldScroll = thumbnailVisibleTop < 0 || thumbnailVisibleBottom > containerHeight

    return {
        shouldScroll,
        scrollOptions: {
            top: thumbnailTop - (containerHeight / 2) + (thumbnailHeight / 2)
        }
    }
}

const calculateHorizontalScroll = (container: HTMLElement, thumbnail: HTMLElement) => {
    const containerWidth = container.clientWidth
    const thumbnailWidth = thumbnail.offsetWidth
    const thumbnailLeft = thumbnail.offsetLeft
    const containerScrollLeft = container.scrollLeft

    const thumbnailVisibleLeft = thumbnailLeft - containerScrollLeft
    const thumbnailVisibleRight = thumbnailVisibleLeft + thumbnailWidth
    const shouldScroll = thumbnailVisibleLeft < 0 || thumbnailVisibleRight > containerWidth

    return {
        shouldScroll,
        scrollOptions: {
            left: thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2)
        }
    }
}

// Event Handlers
const handleMainSlideChange = (slideIndex: number) => {
    currentSlideIndex.value = slideIndex
    nextTick(() => scrollThumbnailsToShow(slideIndex))
}

const handleThumbnailClick = (index: number) => {
    currentSlideIndex.value = index
    nextTick(() => {
        mainCarouselRef.value?.goToSlide(index)
    })
}

const openModal = (index: number) => {
    if (!isFullscreenEnabled.value) return

    currentSlideIndex.value = index
    fullscreenModal.open()

    nextTick(() => {
        fullscreenCarouselRef.value?.goToSlide(index)
    })
}

// Template Utilities
const getThumbnailClasses = (index: number) => ({
    'border-primary': index === currentSlideIndex.value,
    'border-border hover:border-primary/50': index !== currentSlideIndex.value
})

const getMainImageClasses = (_item: SliderItem) => [
    'w-full h-full',
    { 
        'object-cover': getRawConfigValue('displayMode') === 'standard' || getRawConfigValue('displayMode') === 'cover',
        'object-contain': getRawConfigValue('displayMode') === 'contain',
        'cursor-zoom-in': isFullscreenEnabled.value 
    }
]
</script>

<template>
    <div
        :class="{
            'flex gap-10': true,
            'flex-col': !isVerticalLayout,
        }"
    >
        <!-- Main Image Display -->
        <div
            class="flex-1 overflow-hidden relative"
            :class="{ 'order-2': isVerticalLayout }"
        >
            <!-- Fullscreen button -->
            <FoundationButton
                v-if="isFullscreenEnabled"
                size="small"
                :circle="true"
                class="absolute bg-white top-2 right-2 hover:opacity-100 focus:opacity-100 transition-opacity z-10"
                :aria-label="$t('gallery.openFullscreen')"
                @click="openModal(currentSlideIndex)"
            >
                <FoundationIcon name="scan" class="w-4 h-4" />
            </FoundationButton>

            <ComponentCarousel
                ref="mainCarouselRef"
                :slides="mediaGallery"
                :label="$t('gallery.productImage')"
                :breakpoints="{
                    'default': {
                        slidesPerView: 1
                    }
                }"
                :gap="0"
                :enable-arrows="mediaGallery?.length > 1 && navigationArrows ? true : false"
                :enable-dots="mediaGallery?.length > 1 && navigationDots ? true : false"
                :enable-autoplay="false"
                carousel-width="100%"
                left-arrow-class="btn btn-circle bg-transparent z-30 border-none"
                right-arrow-class="btn btn-circle bg-transparent z-30 border-none"
                dots-container-class="absolute bottom-0 left-0 right-0 flex justify-center gap-4 flex justify-center gap-4 mt-4"
                @slide-change="handleMainSlideChange"
            >
                <template #default="{ index }">
                    <div
                        v-if="isSpatial(getMedia(mediaGallery[index] as SliderItem))"
                        class="w-full h-full bg-muted flex items-center justify-center relative cursor-pointer"
                        @click="openModal(index)"
                    >
                        <FoundationIcon name="box" size="2xl" />
                        <span class="absolute bottom-4 left-4 text-sm bg-gray-800 rounded px-2 py-1 text-white">
                            {{ $t('gallery.3dModel') }}
                        </span>
                    </div>
                    <FoundationImage
                        v-else
                        :src="getImageSrc(mediaGallery[index] as SliderItem)"
                        :alt="getMedia(mediaGallery[index] as SliderItem)?.alt || $t('gallery.productImage')"
                        :class="getMainImageClasses(mediaGallery[index] as SliderItem)"
                        :intersection-lazy="index === 0 ? false : true"
                        @click="openModal(index)"
                    />
                </template>
            </ComponentCarousel>
        </div>

        <!-- Thumbnail Navigation -->
        <div
            v-if="mediaGallery.length > 1"
            class="hidden lg:flex flex-shrink-0"
            :class="{
                'order-1': isVerticalLayout,
                'w-full': !isVerticalLayout,
            }"
        >
            <div
                class="thumbnail-container flex gap-3 overflow-auto"
                :class="{
                    'flex-col': isVerticalLayout,
                    'flex-row': !isVerticalLayout,
                }"
                :style="thumbnailContainerStyle"
            >
                <FoundationButton
                    v-for="(item, index) in mediaGallery"
                    :key="index"
                    class="flex-shrink-0 border-2 rounded transition-all duration-200 focus:outline-none p-1"
                    :class="getThumbnailClasses(index)"
                    style="width: 100px; height: 100px;"
                    :aria-label="$t('gallery.selectThumbnail', { index: index + 1 })"
                    :aria-current="index === currentSlideIndex ? 'true' : 'false'"
                    @click="handleThumbnailClick(index)"
                >
                    <div
                        v-if="isSpatial(getMedia(item as SliderItem))"
                        class="w-full h-full bg-muted flex items-center justify-center relative"
                    >
                        <FoundationIcon name="box" size="lg" />
                        <span class="absolute bottom-0 text-xs bg-gray-800 rounded px-1 text-white">
                            3D
                        </span>
                    </div>
                    <FoundationImage
                        v-else
                        :src="getImageSrc(item as SliderItem)"
                        class="w-full h-full object-cover rounded-sm"
                        :alt="getMedia(item as SliderItem)?.alt || $t('gallery.productImage')"
                        intersection-lazy
                    />
                </FoundationButton>
            </div>
        </div>

        <!-- Fullscreen Modal -->
        <ComponentModal
            v-if="isFullscreenEnabled"
            :controller="fullscreenModal"
            :close-on-click-outside="true"
            :fullscreen="true"
            :modal-headline="$t('gallery.fullscreenTitle')"
        >
            <ComponentCarousel
                ref="fullscreenCarouselRef"
                :key="`modal-${currentSlideIndex}`"
                :slides="mediaGallery"
                :label="$t('gallery.productImage')"
                :breakpoints="{
                    'default': {
                        slidesPerView: 1
                    }
                }"
                :gap="0"
                :enable-arrows="mediaGallery?.length > 1 ? true : false"
                left-arrow-class="absolute left-2 w-5 h-5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full"
                right-arrow-class="absolute right-2 w-5 h-5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full"
                :enable-dots="mediaGallery?.length > 1 ? true : false"
                :enable-autoplay="false"
                enable-infinite-scroll
                carousel-width="100%"
            >
                <template #default="{ index }">
                    <div
                        v-if="isSpatial(getMedia(mediaGallery[index] as SliderItem))"
                        class="w-full h-full bg-muted flex items-center justify-center relative"
                    >
                        <FoundationIcon name="box" size="2xl" />
                        <span class="absolute bottom-4 left-4 text-sm bg-gray-800 rounded px-2 py-1 text-white">
                            {{ $t('gallery.3dModel') }}
                        </span>
                    </div>
                    <FoundationImage
                        v-else
                        :src="getImageSrc(mediaGallery[index] as SliderItem)"
                        :alt="getMedia(mediaGallery[index] as SliderItem)?.alt || $t('gallery.productImage')"
                        class="w-full h-full object-contain"
                        intersection-lazy
                    />
                </template>

                <template #left-arrow="{ previous }">
                    <FoundationIcon name="chevron-left" class="w-5 h-5" @click="previous" />
                </template>

                <template #right-arrow="{ next }">
                    <FoundationIcon name="chevron-right" class="w-5 h-5" @click="next" />
                </template>
            </ComponentCarousel>
        </ComponentModal>
    </div>
</template>