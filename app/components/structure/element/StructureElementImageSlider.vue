<script setup lang="ts">
import type { CmsElementImageSlider } from '@shopware/composables'
import { getBiggestThumbnailUrl } from "@shopware/helpers"

 
const props = defineProps<{
    content: CmsElementImageSlider
}>()

const srcPath = (item: CmsElementImageSlider['data']['sliderItems'][0]) => {
    return getBiggestThumbnailUrl(item.media)
}

// Extract configuration from Shopware config
const navigationArrows = computed(() => {
    const config = props.content.config?.navigationArrows?.value
    if (config === '' || !config) return false
    return config
})

const navigationDots = computed(() => {
    const config = props.content.config?.navigationDots?.value
    if (config === '' || !config) return false
    return config
})

const autoSlide = computed(() => props.content.config?.autoSlide?.value ?? false)
const autoplayTimeout = computed(() => props.content.config?.autoplayTimeout?.value ?? 3000)
const speed = computed(() => props.content.config?.speed?.value ?? 300)
</script>

<template>
    <div class="cms-element-image-slider">
        <ComponentCarousel
            :items="content.data.sliderItems"
            :items-per-slide="{ default: 1 }"
            aspect-ratio="16/9"
            :auto-play="autoSlide"
            :auto-play-interval="autoplayTimeout"
            :transition-duration="speed"
            :loop="true"
            :gap="0"
            :reserve-space="true"
            :show-navigation="navigationArrows"
            :show-indicators="navigationDots"
        >
            <template #default="{ item }">
                <component
                    :is="(item as CmsElementImageSlider['data']['sliderItems'][0]).url ? 'a' : 'div'"
                    v-if="(item as CmsElementImageSlider['data']['sliderItems'][0]).media"
                    :href="(item as CmsElementImageSlider['data']['sliderItems'][0]).url || undefined"
                    v-bind="(item as CmsElementImageSlider['data']['sliderItems'][0]).newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                    class="block w-full h-full"
                >
                    <img 
                        :src="srcPath(item as CmsElementImageSlider['data']['sliderItems'][0])" 
                        :alt="(item as CmsElementImageSlider['data']['sliderItems'][0]).media?.alt || ''"
                        class="w-full h-full object-cover"
                    >
                </component>
            </template>
        </ComponentCarousel>
    </div>
</template>