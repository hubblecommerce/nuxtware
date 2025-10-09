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

// @ts-expect-error TODO: fix typing 
const autoSlide = computed(() => props.content.config?.autoSlide?.value ?? false)
</script>

<template>
    <div class="cms-element-image-slider">
        <ComponentCarousel
            ref="productSlider"
            :slides="content.data.sliderItems"
            :label="$t('carousel.label')"
            :breakpoints="{
                'default': {
                    slidesPerView: 1
                }
            }"
            :gap="0"
            :enable-arrows="!!navigationArrows"
            :enable-dots="!!navigationDots"
            :enable-autoplay="autoSlide"
            enable-infinite-scroll
            carousel-width="100%"
        >
            <template #default="{ index }">
                <component
                    :is="(content.data.sliderItems[index] as CmsElementImageSlider['data']['sliderItems'][0]).url ? 'a' : 'div'"
                    v-if="(content.data.sliderItems[index] as CmsElementImageSlider['data']['sliderItems'][0]).media"
                    :href="(content.data.sliderItems[index] as CmsElementImageSlider['data']['sliderItems'][0]).url || undefined"
                    v-bind="(content.data.sliderItems[index] as CmsElementImageSlider['data']['sliderItems'][0]).newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                    class="block w-full h-full"
                >
                    <FoundationImage 
                        :src="srcPath(content.data.sliderItems[index] as CmsElementImageSlider['data']['sliderItems'][0])" 
                        :alt="(content.data.sliderItems[index] as CmsElementImageSlider['data']['sliderItems'][0]).media?.alt || ''"
                        class="w-full h-full object-cover"
                    />
                </component>
            </template>

            <template #left-arrow="{ previous }">
                <FoundationIcon name="chevron-left" class="w-5 h-5" @click="previous" />
            </template>

            <template #right-arrow="{ next }">
                <FoundationIcon name="chevron-right" class="w-5 h-5" @click="next" />
            </template>
        </ComponentCarousel>
    </div>
</template>