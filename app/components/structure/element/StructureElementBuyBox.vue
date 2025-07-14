<script setup lang="ts">
import type { CmsElementBuyBox } from '@shopware/composables'
import { useProduct, } from '#imports'

const props = defineProps<{
    content: CmsElementBuyBox
}>()

const { product } = useProduct(
    props.content.data.product,
    props.content.data.configuratorSettings || [],
)
</script>

<template>
    <ProductDetailBuyBox
        v-if="product"
        :product="product"
        :configurator="props.content.data.configuratorSettings"
    />
</template>
