<script setup lang="ts">
import type { CmsElementImageSlider } from '@shopware/composables'
import { getBiggestThumbnailUrl } from "@shopware/helpers"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementImageSlider
}>()

const srcPath = (item: CmsElementImageSlider['data']['sliderItems'][0]) => {
    return getBiggestThumbnailUrl(item.media)
}
</script>

<template>
    <div class="cms-element-image-slider">
        <ComponentCarousel
            :items="content.data.sliderItems"
            :items-per-slide="{ default: 1 }"
            aspect-ratio="16/9"
            :auto-play="true"
            :loop="true"
            :gap="0"
            :reserve-space="true"
            :show-navigation="content.data.sliderItems.length > 1 ? true : false"
            :show-indicators="content.data.sliderItems.length > 1 ? true : false"
        >
            <template #default="{ item }">
                <img 
                    v-if="(item as CmsElementImageSlider['data']['sliderItems'][0]).media" 
                    :src="srcPath(item as CmsElementImageSlider['data']['sliderItems'][0])" 
                    :alt="(item as CmsElementImageSlider['data']['sliderItems'][0]).media?.alt || ''"
                    class="w-full h-full object-cover"
                >
            </template>
        </ComponentCarousel>
    </div>
</template>