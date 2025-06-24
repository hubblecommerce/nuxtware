<script setup lang="ts">
import { navigateTo } from "#imports"
import type { Schemas } from "#shopware"
import type { BoxLayout } from "@shopware/composables"
import { getProductName, getProductRoute, getProductFromPrice } from "@shopware/helpers"
import { useFocusWithin, breakpointsTailwind, useBreakpoints, useResizeObserver, useWindowSize } from '@vueuse/core'

interface ProductCardProps {
    product: Schemas["Product"]
    layoutType?: BoxLayout
    showOptions?: boolean
    showWishlist?: boolean
    showBadges?: boolean
    showDescription?: boolean
    descriptionLines?: number
}

const props = withDefaults(defineProps<ProductCardProps>(), {
    layoutType: 'standard',
    showOptions: true,
    showWishlist: true,
    showBadges: true,
    showDescription: true,
    descriptionLines: 2
})

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

const { product } = toRefs(props)

// Check if product has variants that require configuration
const fromPrice = computed(() => getProductFromPrice(props.product))

// Additional information on hover
const productCard = ref<HTMLElement>()
const initialProductCardHeight = ref<number>(0)
const productCardContent = ref<HTMLElement>()
const productCardInteractive = ref<HTMLElement>()
const productCardInteractiveHeight = ref<number>(0)
const cardActive = ref<boolean>(false)
const { focused } = useFocusWithin(productCard)
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndLarger = breakpoints.greaterOrEqual('lg')
const isTransitioning = ref(false)
const mounted = ref(false)
const { width } = useWindowSize()

watch(focused, (focused) => {
    if (focused && lgAndLarger.value) {
        cardActive.value = true
    } else {
        cardActive.value = false
    }
})

watch(width, () => {
    initialProductCardHeight.value = productCard.value?.offsetHeight ?? 0
})

onMounted(() => {
    try {
        initialProductCardHeight.value = productCard.value?.offsetHeight ?? 0
        productCardInteractiveHeight.value = getChildHeightSum(productCardInteractive.value?.children)
    } catch (error) {
        console.warn('Error calculating card dimensions:', error)
        // Set fallback values
        initialProductCardHeight.value = 300
        productCardInteractiveHeight.value = 60
    } finally {
        mounted.value = true
    }
})

useResizeObserver(productCard, () => {
    try {
        productCardInteractiveHeight.value = getChildHeightSum(productCardInteractive.value?.children)
    } catch (error) {
        console.warn('Error recalculating card dimensions:', error)
    }
})

function getChildHeightSum(children: HTMLCollection | undefined): number {
    if (!children) return 0
    
    try {
        return Array.from(children).reduce((sum, child) => {
            const height = child.getBoundingClientRect()?.height || 0
            return sum + height
        }, 0)
    } catch (error) {
        console.warn('Error calculating child heights:', error)
        return 0
    }
}

function onTransitionRun () {
    if (cardActive.value) {
        isTransitioning.value = true
    }
}

function onTransitionEnd () {
     if (cardActive.value) {
        isTransitioning.value = true
     } else {
        isTransitioning.value = false
     }
}
</script>

<template>
    <div class="product-card-stage relative">
        <div v-if="mounted" class="product-card-placeholder" :style="`height: ${initialProductCardHeight}px;`" />

        <article 
            ref="productCard"
            class="
                product-card w-full top-0 left-0 border border-border cursor-pointer 
                transition-all 
                focus-style
                lg:hover:shadow-lg
            "
            :class="mounted ? 'absolute' : 'relative'" 
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
                :aria-label="$t('product.viewDetailsFor', { name: getProductName({ product }) })"
                tabindex="-1"
            >
                {{ $t('product.viewDetailsFor', { name: getProductName({ product }) }) }}
            </RouterLink>

            <div class="relative">
                <ProductCardImage 
                    :product="product"
                    :layout-type="layoutType"
                    class="relative -z-10"
                />

                <ComponentReviewStars 
                    v-if="product.ratingAverage"
                    v-model="product.ratingAverage" 
                    :interactive="false" 
                    size="sm"
                    class="absolute w-[100px] bottom-0 left-0 right-0 mx-auto"
                />
            </div>

            <ProductBadges 
                v-if="showBadges"
                :product="product" 
                variant="floating"
                class="absolute top-5 -left-1"
            />

            <ProductWishlistToggle 
                v-if="showWishlist"
                :product="product"
                variant="icon"
                class="absolute top-2 right-2 z-10"
            />

            <!-- Show info if product is out of stock or sold out -->
            <ProductSoldOut
                :product="product"
                version="minimal"
                class="absolute top-2 left-2 z-10"
            />

            <div 
                ref="productCardContent"
                class="w-full relative cursor-auto transition-all duration-500 p-2 bg-white"
                :class="{ 'z-20': isTransitioning }"
                @click.stop="() => null"
            >
                <!-- Product name -->
                <h2 
                    class="text-sm font-semibold text-center line-clamp-2 min-h-[40px] mb-2"
                    data-testid="product-card-name"
                >
                    {{ getProductName({ product }) }}
                </h2>

                <!-- Price section -->
                <ProductPrice
                    :product="product"
                    size="small"
                    class="min-h-[50px]"
                />

                <div 
                    ref="productCardInteractive"
                    class="transition-all duration-300 ease-in-out overflow-visible lg:overflow-hidden mt-2"
                    :style="`height: ${cardActive ? productCardInteractiveHeight : 0 }px;`"
                    @transitionrun="onTransitionRun"
                    @transitionend="onTransitionEnd"
                >
                    <div class="px-4 py-2 flex flex-col gap-2">
                        <ProductCardOptions 
                            v-if="showOptions && product.options && product.options.length"
                            :product="product"
                            class="hidden lg:flex justify-center items-center gap-2"
                        />

                        <!-- Product description - standard layout only -->
                        <ProductDescription
                            v-if="showDescription && layoutType === 'standard'"
                            :product="product"
                            :lines="descriptionLines"
                            variant="compact"
                            class="hidden lg:block"
                        />

                        <!-- TODO: displaying view details button based on fromPrice doesn't work, find another way -->
                        <ProductCardActions 
                            :product="product" 
                            :has-variants="!!fromPrice"
                            class="hidden lg:flex w-full relative z-10"
                            @show-details="navigateTo(formatLink(getProductRoute(product)))"
                        />
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>