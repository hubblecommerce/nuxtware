<script setup lang="ts">
import type { CmsElementBuyBox } from '@shopware-pwa/composables-next'
import {
    useProductPrice,
    useProduct,
    usePrice,
} from '#imports'
import { getTranslatedProperty } from '@shopware-pwa/helpers-next'
import { defu } from 'defu'

const props = defineProps<{
    content: CmsElementBuyBox
}>()

type Translations = {
    product: {
        addedToCart: string;
        qty: string;
        addToCart: string;
    };
};

let translations: Translations = {
    product: {
        addedToCart: "has been added to cart.",
        qty: "Qty",
        addToCart: "Add to cart",
    },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product } = useProduct(
    props.content.data.product,
    props.content.data.configuratorSettings || [],
)
const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product)
const { getFormattedPrice } = usePrice();

const { addToCart, quantity } = useAddToCart(product);
</script>

<template>
    <div v-if="product">
        <div>{{ getTranslatedProperty(product, 'name') }}</div>
        <div>{{ product.productNumber }}</div>
        <div>{{ getFormattedPrice(unitPrice) }}</div>

        <div class="flex flex-row gap-3">
            <div>
                <input
                    id="qty"
                    type="number"
                    v-model="quantity"
                    :min="product.minPurchase || 1"
                    :max="product.calculatedMaxPurchase"
                    :step="product.purchaseSteps || 1"
                    class="border rounded-md py-2 px-4 border-solid border-1 border-cyan-600 w-full mt-4"
                />
            </div>
            <button @click="addToCart">
                {{ translations.product.addToCart }}
            </button>
        </div>
    </div>
</template>
