<script setup lang="ts">
import { navigateTo } from "#imports"
import type { Schemas } from "#shopware"
import type { BoxLayout } from "@shopware/composables"
import { getProductName, getProductRoute } from "@shopware/helpers"
import { useFocusWithin, breakpointsTailwind, useBreakpoints, useResizeObserver } from '@vueuse/core'

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
const { unitPrice, displayFromVariants, displayFrom } = useProductPrice(product)

const productCard = ref<HTMLElement>()
const initialProductCardHeight = ref(0)
const productCardContent = ref<HTMLElement>()
const initCardContentHeight = ref(0)
const productCardInteractive = ref<HTMLElement>()
const productCardInteractiveHeight = ref(0)
const cardActive = ref(false)
const { focused } = useFocusWithin(productCard)
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndLarger = breakpoints.greaterOrEqual('lg')

watch(focused, (focused) => {
    if (focused && lgAndLarger.value) {
        cardActive.value = true
    } else {
        cardActive.value = false
    }
})

onMounted(() => {
    initialProductCardHeight.value = productCard.value?.offsetHeight ?? 0
    initCardContentHeight.value = productCardContent.value?.offsetHeight ?? 0
    productCardInteractiveHeight.value = getChildHeightSum(productCardInteractive.value?.children)
})

useResizeObserver(productCard, () => {
    if (lgAndLarger.value) {
       productCardInteractiveHeight.value = getChildHeightSum(productCardInteractive.value?.children)
    }
})

function getChildHeightSum (children: HTMLElement["children"]) {
    return Array.from(children).reduce((sum, child) => {
        return sum + child.getBoundingClientRect()?.height
    }, 0)
}
</script>

<template>
    <div class="product-card-stage relative">
        <div class="product-card-placeholder" :style="`height: ${initialProductCardHeight}px;`" />

        <article 
            ref="productCard"
            class="
                product-card absolute top-0 left-0 border border-border cursor-pointer 
                transition-all 
                focus-style
                lg:focus-within-style
                lg:hover:ring-3 lg:hover:ring-offset-2
            " 
            data-testid="product-card"
            tabindex="0"
            @mouseover="lgAndLarger ? cardActive = true : null"
            @mouseleave="lgAndLarger? cardActive = false : null"
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
                class="w-full relative cursor-auto transition-all duration-500 bg-white/60 backdrop-blur-sm z-10 py-2"
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
                    class="transition-height ease-in duration-300 overflow-visible lg:overflow-hidden mt-2"
                    :style="`height: ${cardActive ? productCardInteractiveHeight : 0 }px;`"
                >
                    <div class="px-4 py-2 flex flex-col gap-2">
                        <ProductCardOptions 
                            v-if="showOptions && product.options && product.options.length"
                            :product="product"
                            class="hidden lg:flex justify-center items-center gap-2"
                        />

                        <FoundationButton 
                            color="primary" 
                            class="hidden lg:block w-full relative z-10"
                        >
                            Add to Cart
                        </FoundationButton>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>