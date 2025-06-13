<script setup lang="ts">
import type { Schemas } from "#shopware"
import type { BoxLayout } from "@shopware/composables"
import { getProductName, getSmallestThumbnailUrl, getBiggestThumbnailUrl, getSrcSetForMedia } from "@shopware/helpers"
import { useElementSize } from "@vueuse/core"

interface ProductCardImageProps {
    product: Schemas["Product"]
    layoutType?: BoxLayout
}

const props = withDefaults(defineProps<ProductCardImageProps>(), {
    layoutType: 'standard',
})

const imageElement = useTemplateRef("imageElement")
const { height } = useElementSize(imageElement)

const DEFAULT_THUMBNAIL_SIZE = 10

function roundUp(num: number) {
    return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE
}

const srcPath = computed(() => {
    if (props.layoutType === 'image') {
        return `${getBiggestThumbnailUrl(
            props.product.cover?.media
        )}?&height=${roundUp(height.value)}&fit=cover`
    }

    return `${getSmallestThumbnailUrl(
        props.product.cover?.media
    )}?&height=${roundUp(height.value)}&fit=cover`
})

const imageClasses = computed(() => ({
    'w-full overflow-hidden': true,
    'object-cover': props.layoutType === 'image',
    'h-60 object-contain': props.layoutType === 'standard'
}))
</script>

<template>
    <img
        ref="imageElement"
        :src="srcPath"
        :srcset="getSrcSetForMedia(props.product.cover?.media)"
        :alt="getProductName({ product }) || ''"
        :class="imageClasses"
        data-testid="product-card-image"
    >
</template>