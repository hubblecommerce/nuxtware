<script setup lang="ts">
import type { Schemas } from "#shopware"
import type { BoxLayout } from "@shopware/composables"
import { getProductName, getProductRoute, getSmallestThumbnailUrl } from "@shopware/helpers"
import { useElementSize } from "@vueuse/core"

interface ProductCardImageProps {
    product: Schemas["Product"]
    layoutType?: BoxLayout
}

const props = withDefaults(defineProps<ProductCardImageProps>(), {
    layoutType: 'standard',
})

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

const imageElement = useTemplateRef("imageElement")
const { height } = useElementSize(imageElement)

const DEFAULT_THUMBNAIL_SIZE = 10

function roundUp(num: number) {
    return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE
}

const srcPath = computed(() => {
    return `${getSmallestThumbnailUrl(
        props.product.cover?.media
    )}?&height=${roundUp(height.value)}&fit=cover`
})

const containerClasses = computed(() => ({
    'w-full rounded-md overflow-hidden hover:opacity-75': true,
    'h-80': props.layoutType === 'image',
    'h-60': props.layoutType === 'standard'
}))
</script>

<template>
    <div :class="containerClasses">
        <RouterLink
            :to="formatLink(getProductRoute(product))"
            class="overflow-hidden"
        >
            <img
                ref="imageElement"
                :src="srcPath"
                :alt="getProductName({ product }) || ''"
                class="w-full h-full object-contain"
                data-testid="product-card-image"
            >
        </RouterLink>
    </div>
</template>