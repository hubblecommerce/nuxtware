<script setup lang="ts">
import type { Schemas } from "#shopware"
import { getProductRoute } from "@shopware/helpers"

interface ProductCardActionsProps {
    product: Schemas["Product"]
    fromPrice: number | undefined
}

const props = defineProps<ProductCardActionsProps>()

const { t } = useI18n()
const { pushSuccess, pushError } = useNotifications()
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
const { getErrorsCodes } = useCartNotification()
const { resolveCartError } = useCartErrorParamsResolver()

const { product } = toRefs(props)
const { addToCart, isInCart, count } = useAddToCart(product)

// Button classes for add to cart
const addToCartClasses = computed(() => ({
    'justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 flex': true,
    'text-white bg-primary-600 hover:bg-primary-700': !isInCart.value,
    'text-secondary-600 bg-secondary-100': isInCart.value,
    'opacity-50 cursor-not-allowed': !product.value.available
}))

// Button classes for details link
const detailsClasses = computed(() => 
    'justify-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500'
)

const addToCartProxy = async () => {
    await addToCart()
    const errors = getErrorsCodes()

    for (const element of errors ?? []) {
        const { messageKey, params } = resolveCartError(element)
        pushError(t(`errors.${messageKey}`, params as Record<string, unknown>))
    }

    if (!errors.length) {
        pushSuccess(
            t("cart.messages.addedToCart", { p: product.value?.translated.name })
        )
    }
}
</script>

<template>
    <div class="product-card-actions">
        <button
            v-if="!fromPrice"
            type="button"
            :class="addToCartClasses"
            data-testid="product-add-to-cart-button"
            :disabled="!product.available"
            @click="addToCartProxy"
        >
            {{ $t("product.addToCart") }}
            <div v-if="isInCart" class="flex ml-2">
                <div class="w-5 h-5 i-carbon-shopping-bag text-secondary-600" />
                {{ count }}
            </div>
        </button>
        
        <RouterLink
            v-else
            :to="formatLink(getProductRoute(product))"
            :class="detailsClasses"
            data-testid="product-details-link"
        >
            <span>{{ $t("product.details") }}</span>
        </RouterLink>
    </div>
</template>