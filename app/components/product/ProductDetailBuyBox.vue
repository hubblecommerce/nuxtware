<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers"
import type { Schemas } from "#shopware"
import { useProductReviews } from "#nuxtware/composables/useProductReviews";

const product = defineModel<Schemas["Product"]>('product', { required: true })

const props = defineProps<{
    configurator: Schemas["PropertyGroup"][] | null
}>()

const { addToCart, quantity, isInCart, count } = useAddToCart(product)

const cartItemCount = computed(() => count.value || 0)
const variantNotFound = ref(false)

const showQtySelect = computed(() => {
    return product.value?.maxPurchase !== 1
})

const isBuyable = computed(() => {
    if (product.value?.calculatedMaxPurchase) {
        return product.value.available && (!product.value.childCount || product.value.childCount <= 0) && product.value.calculatedMaxPurchase > 0 && !variantNotFound.value
    } else return false
})

const { open } = useSidenav()

const handleAddToCart = async () => {
    await addToCart()
    open('cart')
}

const { totalReviews } = useProductReviews({
    productId: product.value?.id ?? '',
})

const rating = ref(product.value?.ratingAverage)

function openProductTab (anchor: string) {
    const el = document.getElementById(anchor)
    if (el) {
        el.click()
    }
}

function updateProduct (newProduct: Schemas["Product"]) {
    product.value = newProduct
    variantNotFound.value = false
}

function handleVariantNotFound () {
    variantNotFound.value = true
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
            <LazyProductPurchaseUnitAndInfos v-if="product?.purchaseUnit" :product="product" :show-product-info="true" />
        </section>

        <section
            v-if="product.ratingAverage && product.ratingAverage > 0 && totalReviews > 0"
            class="flex flex-col gap-1 justify-start items-start"
        >
            <FoundationLink
                href="#tab-reviews"
                type="external"
                :aria-label="$t('product.reviews.link', { rating: product.ratingAverage })"
                @click="openProductTab('tab-reviews')"
                @keydown="openProductTab('tab-reviews')"
            >
                <ComponentReviewStars
                    v-if="product.ratingAverage"
                    v-model="rating"
                    :interactive="false"
                    size="sm"
                    class="cursor-pointer"
                />
            </FoundationLink>
            <div class="text-sm">{{ $t('review.title', { count: totalReviews }) }}</div>
        </section>

        <!-- Delivery snippet by sales channel logic  -->

        <ProductDeliveryInformation :product="product" />

        <ProductDetailVariants
            :configurator="props.configurator"
            :parent-id="product?.parentId"
            @product-variant-changed="updateProduct"
            @variant-not-found="handleVariantNotFound"
        />

        <div v-if="isBuyable" class="flex flex-row gap-2 items-center">
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

        <ProductWishlistToggle
            :product="product"
            variant="button"
            class="w-auto mr-auto"
        />

        <span v-if="product.productNumber" class="text-sm">
            <strong>{{ $t('product.productNumber') }}:&nbsp;</strong>{{ product.productNumber }}
        </span>
    </div>
</template>