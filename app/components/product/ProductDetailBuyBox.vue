<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers"
import type { Schemas } from "#shopware"

const props = defineProps<{
    product: Schemas["Product"],
}>()

const { addToCart, quantity, isInCart, count } = useAddToCart(ref(props.product))

const cartItemCount = computed(() => count.value || 0)

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
            <LazyProductQtySelector
                v-if="showQtySelect"
                v-model:qty="quantity"
                class="basis-1/3"
                :min="product?.minPurchase || 1"
                :max="product?.calculatedMaxPurchase || 100"
                :input-disabled="false"
            />
            <FoundationButton
                size="medium"
                color="primary"
                class="w-full flex items-center justify-center gap-2"
                :class="[showQtySelect ? 'basis-2/3' : 'w-full']"
                @click="handleAddToCart"
            >
                <span>{{ $t("product.addToCart") }}</span>
                <template v-if="isInCart">
                    <FoundationIcon 
                        name="cart" 
                        class="w-4 h-4" 
                        aria-hidden="true" 
                    />
                    <span class="font-semibold">{{ cartItemCount }}</span>
                </template>
            </FoundationButton>
        </div>

        <!--  ProductWishlistToggle.vue  -->

        <!--  Product number / sku  -->

        <CartSidenav v-model="showCartSidenav" />

    </div>
</template>