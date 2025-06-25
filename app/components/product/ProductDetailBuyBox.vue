<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers"
import type { Schemas } from "#shopware"

const props = defineProps<{
    product: Schemas["Product"],
}>()

const { addToCart, quantity } = useAddToCart(ref(props.product))

const showQtySelect = computed(() => {
    return props.product.maxPurchase !== 1
})

const isBuyable = computed(() => {
    if (props.product.calculatedMaxPurchase) {
        return props.product.available && (!props.product.childCount || props.product.childCount <= 0) && props.product.calculatedMaxPurchase > 0
    } else return false
})

const showCartSidenav = ref(false)

const handleAddToCart = async () => {
    await addToCart()
    showCartSidenav.value = true
}
</script>
<template>
    <div class="h-full flex flex-col justify-start gap-4">
        <!-- TODO: schema.org content, preferably as it's own component -->

        <h1 class="sr-only font-semibold text-xl" itemprop="name">
            {{ getTranslatedProperty(product, 'name') }}
        </h1>

        <section class="flex flex-col gap-3">
            <ProductBadges
                :product="product"
                variant="default"
                class="!relative !left-auto"
            />

            <ProductPrice
                :product="product"
                alignment="start"
                :show-tier-prices="true"
                :show-tax="true"
            />
        </section>

        <section>
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

        <ProductSoldOut :product="product" />

        <!-- ProductDetailVariants.vue  -->

        <div v-if="isBuyable" class="flex flex-row gap-2 items-center mb-6">
            <div v-if="showQtySelect" class="basis-1/3">
                <LazyProductQtySelector
                    v-model:qty="quantity"
                    :min="product?.minPurchase || 1"
                    :max="product?.calculatedMaxPurchase || 100"
                    :input-disabled="false"
                />
            </div>
            <div :class="[showQtySelect ? 'basis-2/3' : 'w-full']">
                <FoundationButton
                    :text="$t('product.addToCart')"
                    size="medium"
                    color="primary"
                    class="w-full"
                    @click="handleAddToCart"
                />
            </div>
        </div>

        <!--  ProductWishlistToggle.vue  -->

        <!--  Product number / sku  -->

        <CartSidenav v-model="showCartSidenav" />

    </div>
</template>