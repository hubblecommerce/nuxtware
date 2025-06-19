<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers"
import type { Schemas } from "#shopware"

const props = defineProps<{
    product: Schemas["Product"],
}>()
</script>
<template>
    <div class="h-full flex flex-col justify-start">
        <!-- TODO: schema.org content, preferably as it's own component -->

        <h1 class="sr-only font-semibold text-xl" itemprop="name">
            {{ getTranslatedProperty(product, 'name') }}
        </h1>

        <!-- ProductPrice.vue -->

        <section class="mb-6">
            <LazyProductPurchaseUnitAndInfos v-if="props.product.purchaseUnit" :product="props.product" :show-product-info="true" />
        </section>

        <!-- Delivery snippet by sales channel logic  -->

        <template v-if="!product.active || !product.available">
            <div class="flex items-center gap-1 text-sm">
                <div class="w-2 h-2 bg-error rounded-full" />
                <span>{{ $t('product.unavailable') }}</span>
            </div>
        </template>

        <!-- Product delivery time if product is in stock  -->

        <!-- ProductSoldOut.vue  incl. restock time and light version -->

        <!-- ProductDetailVariants.vue  -->

        <!-- ProductQtySelector.vue  -->

        <!--  Add to cart button  -->

        <!--  ProductWishlistToggle.vue  -->

        <!--  Product number / sku  -->
    </div>
</template>