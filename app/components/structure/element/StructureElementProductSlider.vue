<script setup lang="ts">
import type { CmsElementProductSlider } from '@shopware/composables'

const props = defineProps<{
    content: CmsElementProductSlider
}>()

// Extract products from CMS element data
const products = computed(() => props.content?.data?.products ?? [])

// Define config interface to match actual structure
interface ConfigValue {
    value?: string | boolean | number | null
    source?: string
}

interface ProductSliderConfig {
    title?: ConfigValue
    navigationArrows?: ConfigValue
    rotate?: ConfigValue
    border?: ConfigValue
    boxLayout?: ConfigValue
    displayMode?: ConfigValue
    slidesPerViewMobile?: ConfigValue
    slidesPerViewTablet?: ConfigValue
    slidesPerViewDesktop?: ConfigValue
    [key: string]: ConfigValue | undefined
}

// Get configuration values with proper typing
const config = computed(() => props.content?.config as unknown as ProductSliderConfig || {})

// Configuration mapping following shopware reference
const title = computed(() => config.value.title?.value as string || '')
const autoPlay = computed(() => config.value.rotate?.value === true)
const border = computed(() => config.value.border?.value === true)
const displayMode = computed(() => config.value.displayMode?.value as string || 'standard')

// Extract items per slide from config - these should be the direct backend values
const itemsPerSlide = computed(() => {
    return {
        default: (config.value.slidesPerViewMobile?.value as number) || 1,
        md: (config.value.slidesPerViewTablet?.value as number) || 2,
        lg: (config.value.slidesPerViewDesktop?.value as number) || 3,
        xl: (config.value.slidesPerViewDesktop?.value as number) || 3
    }
})

// Other carousel settings
const gap = computed(() => 20) // 1.25rem = 20px
const showIndicators = computed(() => false) // Following Shopware reference
const navigationArrows = computed(() => {
    const config = props.content?.config?.navigationArrows?.value
    if (config === '' || !config) return false
    return config
})
const loop = computed(() => true)
const autoPlayInterval = computed(() => 5000)
</script>

<template>
    <div class="cms-element-product-slider">
        <div :class="{ 'py-5 border border-border': border }">
            <ComponentProductCarousel
                :products="products"
                :title="title"
                :show-title="!!title"
                layout-type="minimal"
                :items-per-slide="itemsPerSlide"
                :gap="gap"
                :show-navigation="navigationArrows"
                :show-indicators="showIndicators"
                :auto-play="autoPlay"
                :auto-play-interval="autoPlayInterval"
                :loop="loop"
                :show-wishlist="true"
                :show-badges="true"
                :show-description="displayMode !== 'cover'"
                :description-lines="2"
            />
        </div>
    </div>
</template>