<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers"
import type { Schemas } from "#shopware"
import { useProductReviews } from "#hubble/composables/useProductReviews";

const props = defineProps<{
    product: Schemas["Product"],
}>()

const { totalReviews } = useProductReviews({
    productId: props.product.id,
})

function scrollToAndOpenReviewsTab (anchor: string) {
    const el = document.getElementById(anchor)
    if (el) {
        el.click()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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

        <section
            v-if="product.ratingAverage && product.ratingAverage > 0 && totalReviews > 0"
            class="flex flex-col gap-1 justify-start items-start"
        >
            <div
                role="link"
                tabindex="0"
                :aria-label="$t('product.reviews.link', { rating: product.ratingAverage })"
                @click.prevent="scrollToAndOpenReviewsTab('tab-reviews')"
                @keydown.enter.prevent="scrollToAndOpenReviewsTab('tab-reviews')"
            >
                <ComponentReviewStars
                    v-if="product.ratingAverage"
                    v-model="product.ratingAverage"
                    :interactive="false"
                    size="sm"
                    class="cursor-pointer"
                />
            </div>
            <div class="text-sm">{{ $t('review.title', { count: totalReviews }) }}</div>
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

        <!-- ProductQtySelector.vue  -->

        <!--  Add to cart button  -->

        <!--  ProductWishlistToggle.vue  -->

        <!--  Product number / sku  -->
    </div>
</template>