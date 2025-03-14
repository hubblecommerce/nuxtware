<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import type { Schemas } from "#shopware";
import {
    getProductName,
    getProductRoute,
    getSmallestThumbnailUrl,
} from "@shopware/helpers";

const props = defineProps<{
    product: Schemas["Product"],
}>()
const { product } = toRefs(props);

// Image rendering
const imageElement = ref(null);
const { height } = useElementSize(imageElement);
const DEFAULT_THUMBNAIL_SIZE = 10;
function roundUp(num: number) {
    return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}
const srcPath = computed(() => {
    return `${getSmallestThumbnailUrl(
        props.product.cover?.media,
    )}?&height=${roundUp(height.value)}&fit=crop`;
});

// Price rendering
const { unitPrice } = useProductPrice(product);
const { getFormattedPrice } = usePrice();
</script>

<template>
    <div class="flex flex-col w-full justify-start border p-3 gap-3">
        <img
            ref="imageElement"
            loading="lazy"
            :src="srcPath"
            :alt="getProductName({ product }) || ''"
            class=""
        >
        <NuxtLinkLocale
            :to="getProductRoute(product)"
            class="overflow-hidden underline"
        >
            {{ getProductName({ product }) }}
        </NuxtLinkLocale>
        <div>
            {{ getFormattedPrice(unitPrice) }}
        </div>
    </div>
</template>
