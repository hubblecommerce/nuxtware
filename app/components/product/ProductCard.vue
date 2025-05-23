<script setup lang="ts">
import { navigateTo } from "#imports"
import type { Schemas } from "#shopware"
import type { BoxLayout } from "@shopware/composables"
import { getProductFromPrice, getProductName, getProductRoute } from "@shopware/helpers"
import { useFocusWithin } from '@vueuse/core'

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

const productCard = ref<HTMLElement>()
const initialProductCardHeight = ref(0)
const productCardContent = ref<HTMLElement>()
const initCardContentHeight = ref(0)
const productCardInteractive = ref<HTMLElement>()
const productCardInteractiveIsTransitioning = ref(false)
const productCardInteractiveHeight = ref(0)
const cardActive = ref(false)
const { focused } = useFocusWithin(productCard)

// Computed property for overflow management
const productCardInteractiveOverflow = computed(() => {
  if (productCardInteractiveIsTransitioning.value) {
    return 'hidden'
  }

  if (cardActive.value && !productCardInteractiveIsTransitioning.value) {
    return 'visible'
  }

  return 'hidden'
})

const onCardInteractiveTransitionStart = (event) => {
    if (event.propertyName === 'height') {
        productCardInteractiveIsTransitioning.value = true
    }
}

const onCardInteractiveTransitionEnd = (event) => {
    if (event.propertyName === 'height') {
        productCardInteractiveIsTransitioning.value = false
    }
}

watch(focused, (focused) => {
    if (focused) {
        cardActive.value = true
    } else {
        cardActive.value = false
    }
})

onMounted(() => {
    initialProductCardHeight.value = productCard.value?.offsetHeight ?? 0
    initCardContentHeight.value = productCardContent.value?.offsetHeight ?? 0
    productCardInteractiveHeight.value = Array.from(productCardInteractive.value?.children).reduce((sum, child) => {
        return sum + child.getBoundingClientRect()?.height
    }, 0)
})
</script>

<template>
    <div class="product-card-stage relative">
        <div 
            class="product-card-placeholder" 
            :style="`height: ${initialProductCardHeight}px;`"
        />

        <article 
            ref="productCard"
            class="product-card absolute top-0 left-0 border border-transparent transition-all cursor-pointer focus-style hover:ring-2 hover:ring-offset-2" 
            :style="cardActive ? `padding-bottom: ${initCardContentHeight};` : ''"
            data-testid="product-card"
            tabindex="0"
            @mouseover="cardActive = true"
            @mouseleave="cardActive = false"
            @click="navigateTo(formatLink(getProductRoute(product)))"
            @keydown.enter="navigateTo(formatLink(getProductRoute(product)))"
        >
            <RouterLink 
                :to="formatLink(getProductRoute(product))"
                class="sr-only"
                :aria-label="$t('product.view_details', { name: getProductName({ product }) })"
                tabindex="-1"
            >
                {{ $t('product.view_details', { name: getProductName({ product }) }) }}
            </RouterLink>

            <!-- Product image -->
            <ProductCardImage 
                :product="product"
                :layout-type="layoutType"
                class="relative"
            />

            <div 
                ref="productCardContent"
                class="w-full relative cursor-auto transition-all duration-500 bg-white/60 backdrop-blur-sm z-10 py-4"
                :class="{'-mt-20': cardActive}"
                @click.stop="() => null"
            >
                <!-- Product name -->
                <h2 
                    class="text-sm font-semibold text-center line-clamp-2 min-h-[40px]"
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
                <div 
                    ref="productCardInteractive"
                    class="transition-all duration-500"
                    :style="`
                        overflow: ${productCardInteractiveOverflow};
                        height: ${cardActive ? productCardInteractiveHeight : 0 }px;
                    `"
                    @transitionstart="onCardInteractiveTransitionStart"
                    @transitionend="onCardInteractiveTransitionEnd"
                >
                    <div class="px-4">
                        <ProductCardOptions 
                            v-if="showOptions && product.options && product.options.length"
                            :product="product"
                            class="flex justify-center items-center gap-2"
                        />

                        <FoundationButton 
                            color="primary" 
                            class="w-full relative z-10"
                        >
                            Add to Cart
                        </FoundationButton>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>