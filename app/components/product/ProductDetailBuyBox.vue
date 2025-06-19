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

        <!-- Product is not available `!product.active`  -->

        <template v-if="product.stock >= (product.minPurchase || 1) && product.deliveryTime">
            <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-info rounded-full" />
                <span>{{ $t('product.deliveryTime') }}: {{ product.deliveryTime?.translated?.name }}</span>
            </div>
        </template>

        <!-- ProductSoldOut.vue  incl. restock time and light version -->

        <!-- ProductDetailVariants.vue  -->

        <!-- ProductQtySelector.vue  -->

        <!--  Add to cart button  -->

        <!--  ProductWishlistToggle.vue  -->

        <!--  Product number / sku  -->
    </div>
</template>