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

        <div class="hidden gap-3 justify-between flex-col">
            <h1 class="font-semibold text-xl" itemprop="name">
                {{ getTranslatedProperty(product, 'name') }}
            </h1>
        </div>

        <!-- ProductPrice.vue -->

        <!-- Delivery snippet by sales channel logic  -->

        <!-- Product is not available `!product.active`  -->

        <!-- Product delivery time if product is in stock  -->

        <!-- ProductSoldOut.vue  incl. restock time and light version -->

        <!-- ProductDetailVariants.vue  -->

        <!-- ProductQtySelector.vue  -->

        <!--  Add to cart button  -->

        <!--  ProductWishlistToggle.vue  -->

        <!--  Product number / sku  -->
    </div>
</template>