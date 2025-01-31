<script setup lang="ts">
import type { Schemas } from '#shopware'
import { getProductRoute, getSmallestThumbnailUrl, getTranslatedProperty } from '@shopware-pwa/helpers-next'

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
const { getProducts, getTotal } = useProductSearchSuggest()
const { getFormattedPrice } = usePrice();

function getPrice (product: Schemas['Product']) {
    const { unitPrice } = useProductPrice(toRef(product))
    return getFormattedPrice(unitPrice.value)
}
</script>

<template>
    <div v-if="getTotal === 0" class="text-center">
        {{ $t('search.results.noResults') }}
    </div>
    <div v-else class="flex flex-col">
        <FoundationLink
            v-for="product in getProducts"
            :key="product.id"
            :href="formatLink(getProductRoute(product)).path"
            class="flex items-center gap-2"
        >
            <img
                ref="imageElement"
                loading="lazy"
                :src="getSmallestThumbnailUrl(product.cover?.media)"
                class="h-8 w-8 object-cover"
                alt=""
            >
            {{ getTranslatedProperty(product, 'name') }}
            <div>
                {{ getPrice(product) }}
            </div>
        </FoundationLink>
    </div>
</template>
