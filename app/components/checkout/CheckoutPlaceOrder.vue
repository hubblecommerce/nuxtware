<script setup lang="ts">
interface ComponentCheckoutPlaceOrderProps {
    disabled?: boolean
    customerComment?: string
}

interface ComponentCheckoutPlaceOrderEmits {
    (e: 'order-placed', orderId: string): void
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    (e: 'order-error', error: string): void
}

const props = withDefaults(defineProps<ComponentCheckoutPlaceOrderProps>(), {
    disabled: false,
    customerComment: ''
})

const emit = defineEmits<ComponentCheckoutPlaceOrderEmits>()

const { refreshCart } = useCart()
const { createOrder } = useCheckout()
const { handlePayment } = usePayment()
const { isLoggedIn, isGuestSession } = useUser()
const { refreshSessionContext } = useSessionContext()
const { success, error: notifyError } = useGlobalNotifications()
const { t } = useI18n()
const { push } = useRouter()

const isPlacingOrder = ref(false)
const isInitializing = ref(true)

const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value)

const isButtonDisabled = computed(() => {
    return isInitializing.value ||
           !isUserSession.value ||
           props.disabled ||
           isPlacingOrder.value
})

const handlePlaceOrder = async () => {
    if (isButtonDisabled.value) return

    isPlacingOrder.value = true

    try {
        const order = await createOrder({
            customerComment: props.customerComment
        })

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
                await push(`/checkout/success/${order.id}`)
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
    <FoundationButton
        :disabled="isButtonDisabled"
        :loading="isPlacingOrder || isInitializing"
        @click="handlePlaceOrder"
    >
        <span>{{ $t('checkout.placeOrder') }}</span>
    </FoundationButton>
</template>
