<script setup lang="ts">
import type { Schemas } from "#shopware"
import type { CmsElementImageGallery } from '@shopware/composables'
import { getBiggestThumbnailUrl } from "@shopware/helpers"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementImageGallery
}>()

const srcPath = (item: CmsElementImageGallery['data']['sliderItems'][0]) => {
    const media = 'media' in item && typeof item.media === 'object' 
        ? item.media 
        : (item as Schemas["ProductMedia"]).media
    return getBiggestThumbnailUrl(media)
}

// Extract navigation and indicator configuration from Shopware config
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
</script>

<template>
    <div>
        <ComponentCarousel
            :items="content.data.sliderItems"
            :items-per-slide="{ default: 1 }"
            aspect-ratio="16/9"
            :auto-play="false"
            :loop="true"
            :gap="0"
            :reserve-space="true"
            :show-navigation="navigationArrows"
            :show-indicators="navigationDots"
        >
            <template #default="{ item }">
                <img 
                    v-if="(item as any).media" 
                    :src="srcPath(item as CmsElementImageGallery['data']['sliderItems'][0])" 
                    :alt="(item as any).media?.alt || ''"
                    class="w-full h-full object-cover"
                >
            </template>
        </ComponentCarousel>
    </div>
</template>
