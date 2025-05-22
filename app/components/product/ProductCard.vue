<script setup lang="ts">
import type { Schemas } from "#shopware"
import type { BoxLayout } from "@shopware/composables"
import { getProductFromPrice, getProductName, getProductRoute } from "@shopware/helpers"

interface ProductCardProps {
    product: Schemas["Product"]
    layoutType?: BoxLayout
    showOptions?: boolean
    showWishlist?: boolean
    showBadges?: boolean
}

const props = withDefaults(defineProps<ProductCardProps>(), {
    layoutType: 'standard',
    showOptions: true,
    showWishlist: true,
    showBadges: true
})

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

const { product } = toRefs(props)

// Get price display data from Shopware
const { unitPrice, displayFromVariants, displayFrom } = useProductPrice(product)

// Check if product has variants that require configuration
const fromPrice = getProductFromPrice(props.product)
</script>

<template>
    <article class="product-card relative group max-w-full inline-block" data-testid="product-card">
        <!-- Overlay link for whole-card clickability -->
        <RouterLink 
            :to="formatLink(getProductRoute(product))"
            class="absolute inset-0 z-10"
            :aria-label="$t('product.view_details', { name: getProductName({ product }) })"
        >
            <span class="sr-only">
                {{ $t('product.view_details', { name: getProductName({ product }) }) }}
            </span>
        </RouterLink>
        
        <!-- Card content (lower z-index) -->
        <div class="relative z-0">
            <!-- Product image -->
            <ProductCardImage 
                :product="product"
                :layout-type="layoutType"
            />

            <!-- Product badges -->
            <ProductBadges 
                v-if="showBadges"
                :product="product" 
                variant="floating"
                class="absolute top-5 -left-1"
            />

            <!-- Wishlist button -->
            <ProductWishlist 
                v-if="showWishlist"
                :product-id="product.id"
                variant="icon"
                class="absolute top-2 right-2"
            />
            
            <!-- Product info -->
            <div class="product-card-content px-4 pb-4 flex flex-col justify-center items-center gap-2">
                <!-- Product name -->
                <h2 
                    class="text-sm font-semibold text-center line-clamp-2 min-h-60px"
                    data-testid="product-card-name"
                >
                    {{ getProductName({ product }) }}
                </h2>
                
                <!-- Price section -->
                <div class="flex items-center justify-center">
                    <div class="product-card-price">
                        <!-- Variant prices (if applicable) -->
                        <div v-if="displayFromVariants" class="flex items-center gap-1">
                            <span class="text-xs">{{ $t("product.variantsFrom") }}</span>
                            <FoundationPrice 
                                :value="displayFromVariants" 
                                variant="compact"
                                data-testid="product-variant-price"
                            />
                        </div>
                        
                        <!-- Main product price -->
                        <div class="flex items-center gap-1">
                            <span v-if="displayFrom" class="text-sm">{{ $t("product.price.from") }}</span>
                            <FoundationPrice 
                                :value="unitPrice"
                                data-testid="product-price"
                            />
                        </div>
                    </div>
                </div>

                <!-- Product options -->
                <ProductCardOptions 
                    v-if="showOptions && product.options && product.options.length"
                    :product="product"
                    class="flex justify-center items-center gap-2 transition-all scale-y-0 group-hover:scale-y-100"
                />
            </div>
        </div>
        
        <!-- Interactive elements (higher z-index) -->
        <div class="relative z-20">
            <!-- Product actions -->
            <ProductCardActions 
                :product="product" 
                :from-price="fromPrice"
                class=""
            />
        </div>
    </article>
</template>