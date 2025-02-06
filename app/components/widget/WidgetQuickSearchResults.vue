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
    <div v-if="getTotal === 0" class="text-center" role="alert">
        {{ $t('search.results.noResults') }}
    </div>
    <div v-else class="flex flex-col">
        <p role="alert" class="sr-only">{{ $t('search.results.label') }} {{ getTotal }}</p>
        <h2 class="sr-only">{{ $t('search.results.title') }}</h2>
        <ul>
            <li
                v-for="product in getProducts"
                :key="product.id"
            >
                <FoundationLink
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
            </li>
        </ul>
    </div>
</template>
