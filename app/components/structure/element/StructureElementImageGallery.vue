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
</script>

<template>
    <div>
        <ComponentCarousel
            :items="content.data.sliderItems"
            :items-per-slide="{ default: 1 }"
            aspect-ratio="7/10"
            :auto-play="false"
            :loop="true"
            :gap="0"
            :reserve-space="true"
            :show-navigation="content.data.sliderItems.length > 1 ? true : false"
            :show-indicators="content.data.sliderItems.length > 1 ? true : false"
        >
            <template #default="{ item }">
                <img 
                    v-if="(item as any).media" 
                    :src="srcPath(item as CmsElementImageGallery['data']['sliderItems'][0])" 
                    :alt="(item as any).media?.alt || ''"
                >
            </template>
        </ComponentCarousel>
    </div>
</template>
