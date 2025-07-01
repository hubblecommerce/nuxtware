<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
    variants: Schemas['Product'][],
    variantOptionId: string,
    colorMap: Map<string, Schemas['Product']>
}>()

</script>
<template>
    <img
        :src="colorMap.get(props.variantOptionId)?.cover?.media.url"
        :alt="colorMap.get(props.variantOptionId)?.cover?.media.translated.alt || ''"
    />
</template>