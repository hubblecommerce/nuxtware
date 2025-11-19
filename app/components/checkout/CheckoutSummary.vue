<script setup lang="ts">
interface ComponentCheckoutSummaryProps {
    disabled?: boolean,
    hideOrderButton?: boolean
}

interface ComponentCheckoutSummaryEmits {
    (e: 'order-placed', orderId: string): void
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    (e: 'order-error', error: string): void
}

const props = withDefaults(defineProps<ComponentCheckoutSummaryProps>(), {
    disabled: false,
    hideOrderButton: false
})

const emit = defineEmits<ComponentCheckoutSummaryEmits>()

const { 
    cartItems, 
    cart,
    refreshCart 
} = useCart()
const { createOrder } = useCheckout()
const { handlePayment } = usePayment()
const { isLoggedIn, isGuestSession } = useUser()
const { refreshSessionContext } = useSessionContext()
const { success, error: notifyError } = useGlobalNotifications()
const { t } = useI18n()

const isPlacingOrder = ref(false)
const isInitializing = ref(true)

const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value)

const handlePlaceOrder = async () => {
    if (!isUserSession.value || props.disabled || isPlacingOrder.value) return

    isPlacingOrder.value = true

    try {
        const order = await createOrder()
        
        if (order?.id) {
            // Handle payment after order creation
            const paymentResult = await handlePayment(order.id)
            
            if (paymentResult.redirectUrl) {
                // Redirect to payment provider for async payment
                window.location.href = paymentResult.redirectUrl
            } else {
                // Synchronous payment completed
                success(t('checkout.summary.orderSuccess', { orderId: order.id }))
                emit('order-placed', order.id)
                await refreshCart()
            }
        } else {
            throw new Error('Order creation failed')
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('checkout.summary.orderError')
        notifyError(errorMessage)
        emit('order-error', errorMessage)
    } finally {
        isPlacingOrder.value = false
    }
}

// Initialize session context on mount
onMounted(async () => {
    try {
        await refreshSessionContext()
    } catch (error) {
        console.warn('Failed to refresh session context:', error)
    } finally {
        isInitializing.value = false
    }
})
</script>

<template>
    <ComponentFieldset
        :headline="$t('checkout.orderSummary')"
        :description="$t('checkout.orderSummaryLabel')"
    >
        <!-- Cart Items -->
        <div v-if="cartItems.length > 0">
            <FoundationHeadline tag="h4" class="text-base font-medium mb-3">
                {{ $t('checkout.summary.items') }} ({{ cartItems.length }})
            </FoundationHeadline>
            
            <div class="max-h-64 overflow-y-auto border border-border rounded-lg px-4">
                <CartItem
                    v-for="item in cartItems"
                    :key="item.id"
                    :item="item"
                    :show-controls="false"
                />
            </div>
        </div>

        <!-- Cart Summary with Totals -->
        <div v-if="cart">
            <CartSummary
                :cart="cart"
                :show-checkout-button="false"
                :show-cart-button="false"
                class="p-2 rounded-lg"
            />
        </div>

        <!-- Order Actions -->
        <div class="space-y-3 pt-4">
            <!-- Login Required Message -->
            <div v-if="!isInitializing && !isUserSession" class="text-center">
                <p class="text-sm text-error mb-3">{{ $t('checkout.loginRequired') }}</p>
            </div>

            <!-- Place Order Button -->
            <FoundationButton
                v-if="!hideOrderButton"
                :disabled="isInitializing || !isUserSession || disabled || isPlacingOrder"
                color="tertiary"
                size="large"
                class="w-full"
                :loading="isPlacingOrder || isInitializing"
                @click="handlePlaceOrder"
            >
                {{ $t('checkout.placeOrder') }}
            </FoundationButton>

            <!-- Terms and Conditions -->
            <div class="text-center">
                <p class="text-xs">
                    {{ $t('checkout.summary.termsNotice') }}
                    <FoundationLink href="/terms">
                        {{ $t('checkout.summary.termsLink') }}
                    </FoundationLink>
                </p>
            </div>
        </div>
    </ComponentFieldset>
</template>