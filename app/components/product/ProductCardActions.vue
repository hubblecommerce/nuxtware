<script setup lang="ts">
import type { Schemas } from "#shopware"
import { getProductRoute, getTranslatedProperty } from "@shopware/helpers"

interface ProductCardActionsProps {
    product: Schemas["Product"]
    hasVariants?: boolean
    loading?: boolean
}

const props = withDefaults(defineProps<ProductCardActionsProps>(), {
    hasVariants: false,
    loading: false
})

const emit = defineEmits<{
    'add-to-cart': [product: Schemas["Product"]]
    'show-details': [product: Schemas["Product"]]
}>()

const { t } = useI18n()
const { success, error } = useGlobalNotifications()
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
const { getErrorsCodes } = useCartNotification()
const { resolveCartError } = useCartErrorParamsResolver()
const { product } = toRefs(props)
const { addToCart, isInCart, count } = useAddToCart(product)

// Loading state for add to cart action
const isAddingToCart = ref(false)

const isAvailable = computed(() => product.value.available && !props.loading)
const showAddToCart = computed(() => !props.hasVariants && product.value.available)
const cartItemCount = computed(() => count.value || 0)

// Button variant based on cart state
const addToCartButtonVariant = computed(() => 
    isInCart.value ? 'outline' : 'default'
)

const addToCartButtonColor = computed(() => 
    isInCart.value ? 'secondary' : 'primary'
)

const addToCartAriaLabel = computed(() => {
    if (isInCart.value) {
        return t('cart.addMoreToCart', { 
            product: getTranslatedProperty(product.value, 'name'),
            count: cartItemCount.value 
        })
    }
    return t('cart.addToCart', { product: getTranslatedProperty(product.value, 'name') })
})

const detailsAriaLabel = computed(() => 
    t('product.viewDetailsFor', { product: getTranslatedProperty(product.value, 'name') })
)

const handleAddToCart = async () => {
    if (!isAvailable.value || isAddingToCart.value) return
    
    isAddingToCart.value = true
    
    try {
        await addToCart()
        
        const errors = getErrorsCodes()
        
        if (errors && errors.length > 0) {
            for (const errorCode of errors) {
                const { messageKey, params } = resolveCartError(errorCode)
                error(t(`errors.${messageKey}`, params as Record<string, unknown>))
            }
        } else {
            success(
                t("cart.messages.addedToCart", { 
                    product: getTranslatedProperty(product.value, 'name')
                })
            )
            
            emit('add-to-cart', product.value)
        }
    } catch (e) {
        // Fallback for unexpected errors
        console.error('Unexpected error adding to cart:', e)
        error(t('cart.messages.addToCartError'))
    } finally {
        isAddingToCart.value = false
    }
}

const handleShowDetails = () => {
    emit('show-details', product.value)
}
</script>

<template>
    <div class="product-card-actions w-full flex flex-col gap-2">
        <!-- Add to Cart Button -->
        <FoundationButton
            v-if="showAddToCart"
            :variant="addToCartButtonVariant"
            :color="addToCartButtonColor"
            size="small"
            :disabled="!isAvailable"
            :loading="isAddingToCart"
            :aria-label="addToCartAriaLabel"
            data-testid="product-add-to-cart-button"
            class="w-full flex items-center justify-center gap-2"
            @click.stop="handleAddToCart"
        >
            <span>{{ $t("cart.addToCart") }}</span>
            <template v-if="isInCart">
                <FoundationIcon 
                    name="cart" 
                    class="w-4 h-4" 
                    aria-hidden="true" 
                />
                <span class="font-semibold">{{ cartItemCount }}</span>
            </template>
        </FoundationButton>
        
        <!-- View Details Button -->
        <FoundationButton
            v-else
            tag="RouterLink"
            :to="formatLink(getProductRoute(product))"
            variant="outline"
            color="secondary"
            size="small"
            :disabled="props.loading"
            :aria-label="detailsAriaLabel"
            data-testid="product-details-link"
            class="w-full flex items-center justify-center gap-2"
            @click.stop="handleShowDetails"
        >
            <span>{{ $t("product.viewDetails") }}</span>
        </FoundationButton>
        
        <!-- Unavailable State -->
        <FoundationButton 
            v-if="!product.available && !props.loading"
            :variant="addToCartButtonVariant"
            :color="addToCartButtonColor"
            size="small"
            disabled
            role="status"
            class="w-full flex items-center justify-center gap-2"
            :aria-label="$t('product.unavailable', { product: getTranslatedProperty(product, 'name') })"
        >
            <span>{{ $t("product.unavailable") }}</span>
            <FoundationIcon 
                name="cart" 
                class="w-4 h-4 mr-2" 
                aria-hidden="true" 
            />
        </FoundationButton>
    </div>
</template>