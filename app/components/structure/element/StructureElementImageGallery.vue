<script setup lang="ts">
import type { CmsElementImageGallery } from '@shopware/composables'
import { getBiggestThumbnailUrl } from "@shopware/helpers"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementImageGallery
}>()

// Follow Shopware's pattern exactly - use sliderItems directly
const mediaGallery = computed(() => props.content.data?.sliderItems ?? [])

const srcPath = (item: any) => {
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
            :items="mediaGallery"
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
                    :src="srcPath(item)" 
                    :alt="item.media?.alt || item.alt || ''"
                    class="w-full h-full object-cover"
                >
            </template>
        </ComponentCarousel>
    </div>
</template>
