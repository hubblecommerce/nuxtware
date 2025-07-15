<script setup lang="ts">
import type { CmsElementManufacturerLogo } from '@shopware/composables'
import { getSmallestThumbnailUrl } from "@shopware/helpers"
import { useElementSize } from "@vueuse/core"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementManufacturerLogo
}>()

const manufacturerLogo = useTemplateRef("manufacturerLogo")
const { height } = useElementSize(manufacturerLogo)

const DEFAULT_THUMBNAIL_SIZE = 10

function roundUp(num: number) {
    return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE
}

const srcPath = computed(() => {
    const manufacturerMedia = props.content?.data?.manufacturer?.media
    if (!manufacturerMedia) return ''
    
    const thumbnailUrl = getSmallestThumbnailUrl(manufacturerMedia)
    if (!thumbnailUrl) return ''
    
    return `${thumbnailUrl}?&height=${roundUp(height.value)}&fit=cover`
})

const imageClasses = computed(() => ({
    'h-12 rounded-md overflow-hidden': true,
    'object-cover': props.content?.config?.displayMode?.value === 'image',
    'object-contain': props.content?.config?.displayMode?.value === 'standard'
}))
</script>

<template>
    <img
        v-if="srcPath"
        ref="manufacturerLogo"
        :src="srcPath"
        :alt="props.content.data?.manufacturer?.media?.alt || ''"
        :class="imageClasses"
    >
</template>