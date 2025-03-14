<script setup lang="ts">
import type { CmsElementProductDescriptionReviews } from '@shopware-pwa/composables-next'
import { getTranslatedProperty } from '@shopware/helpers'

const props = defineProps<{
    content: CmsElementProductDescriptionReviews
}>()

const { product } = useProduct(props.content.data?.product)
const description = computed(() =>
    getTranslatedProperty(product.value, 'description'),
)
</script>

<template>
    {{ description }}
</template>
