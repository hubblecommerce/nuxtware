<script setup lang="ts">
import type {
    CmsElementImage,
    CmsElementManufacturerLogo,
} from "@shopware-pwa/composables-next";
import { useElementSize } from "@vueuse/core";
import { useCmsElementImage } from "#imports";

const props = defineProps<{
    content: CmsElementImage | CmsElementManufacturerLogo;
}>();

const { imageAttrs } = useCmsElementImage(props.content);

const DEFAULT_THUMBNAIL_SIZE = 10;
const imageElement = ref(null);
const { width, height } = useElementSize(imageElement);

function roundUp(num: number) {
    return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const srcPath = computed(() => {
    if (imageAttrs.value.src == null) {
        return null
    }

    const biggestParam =
        width.value > height.value
            ? `width=${roundUp(width.value)}`
            : `height=${roundUp(height.value)}`;
    return `${imageAttrs.value.src}?${biggestParam}&fit=crop,smart`;
});
</script>

<template>
    <img
        v-if="srcPath"
        ref="imageElement"
        loading="lazy"
        :alt="imageAttrs.alt"
        :src="srcPath"
        :srcset="imageAttrs.srcset"
    >
</template>
