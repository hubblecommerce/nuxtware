<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <FoundationHeadline level="h3" class="text-lg font-medium text-primary">
                {{ $t('orders.paymentChange.title') }}
            </FoundationHeadline>
            <FoundationButton
                variant="ghost"
                size="small"
                @click="handleClose"
            >
                <FoundationIcon name="x" class="w-4 h-4" />
                <span class="sr-only">{{ $t('common.close') }}</span>
            </FoundationButton>
        </div>

        <CheckoutPayment
            mode="order"
            :order-id="orderId"
            @payment-changed="handlePaymentChanged"
        />

        <div v-if="error" class="p-4 border-l-4 border-error bg-error text-error-content" role="alert">
            <p class="font-medium">{{ $t('orders.paymentChange.error') }}</p>
            <p class="text-sm mt-1">{{ error }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    orderId: string
    currentPaymentMethodId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'paymentChanged', orderId: string, paymentMethodId: string): void
    (e: 'paymentCompleted', orderId: string): void
    (e: 'close'): void
}>()

const error = ref('')

// Handle payment method selection from CheckoutPayment component
const handlePaymentChanged = (paymentMethodId: string) => {
    // The payment method change is handled immediately by CheckoutPayment
    // Just emit the success event to parent
    emit('paymentChanged', props.orderId, paymentMethodId)
}

const handleClose = () => {
    emit('close')
}
</script>