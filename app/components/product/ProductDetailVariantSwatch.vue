<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
    variants: Schemas['Product'][],
    variantOptionId: string,
    swatchMap: Map<string, Schemas['Product']>
}>()

</script>
<template>
    <img
        :src="swatchMap.get(props.variantOptionId)?.cover?.media.url"
        :alt="swatchMap.get(props.variantOptionId)?.cover?.media.translated.alt || ''"
    />
</template>