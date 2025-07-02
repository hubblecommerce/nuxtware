<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers"
import type { Schemas } from "#shopware"

const props = defineProps<{
    product: Schemas["Product"],
    configurator: Schemas["PropertyGroup"][] | null
}>()

function updateProduct (newProduct: Schemas["Product"]) {
    Object.assign(props.product, newProduct)
}
</script>
<template>
    <div class="h-full flex flex-col justify-start gap-4">
        <!-- TODO: schema.org content, preferably as it's own component -->

        <h1 class="sr-only font-semibold text-xl" itemprop="name">
            {{ getTranslatedProperty(props.product, 'name') }}
        </h1>

        <section class="flex flex-col gap-3">
            <ProductBadges
                :product="props.product"
                variant="default"
                class="!relative !left-auto"
            />

            <ProductPrice
                :product="props.product"
                alignment="start"
                :show-tier-prices="true"
                :show-tax="true"
            />
        </section>

        <section>
            <LazyProductPurchaseUnitAndInfos v-if="props.product.purchaseUnit" :product="props.product" :show-product-info="true" />
        </section>

        <!-- Delivery snippet by sales channel logic  -->

        <template v-if="!props.product.active || !props.product.available">
            <div class="flex items-center gap-1 text-sm">
                <div class="w-2 h-2 bg-error rounded-full" />
                <span>{{ $t('product.unavailable') }}</span>
            </div>
        </template>

        <!-- Product delivery time if product is in stock  -->

        <!-- ProductSoldOut.vue  incl. restock time and light version -->

        <ProductDetailVariants
            :configurator="props.configurator"
            :parent-id="props.product.parentId"
            @product-variant-changed="(product) => updateProduct(product)"
        />

        <!-- ProductQtySelector.vue  -->

        <!--  Add to cart button  -->

        <!--  ProductWishlistToggle.vue  -->

        <!--  Product number / sku  -->
    </div>
</template>