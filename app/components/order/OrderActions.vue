<script setup lang="ts">
import type { Schemas } from '#shopware'

interface Props {
    order: Schemas['Order']
    showChangePayment?: boolean
    showReorder?: boolean
    showCancelOrder?: boolean
    showViewDetails?: boolean
    isDetailsExpanded?: boolean
    layout?: 'horizontal' | 'vertical'
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    showChangePayment: true,
    showReorder: true,
    showCancelOrder: true,
    showViewDetails: true,
    isDetailsExpanded: false,
    layout: 'horizontal',
    size: 'md'
})

const emit = defineEmits<{
    (e: 'reorder', orderId: string): void
    (e: 'changePayment', orderId: string): void
    (e: 'cancelOrder', orderId: string): void
    (e: 'toggleDetails'): void
}>()

const { t } = useI18n()

// Order state constants
const ORDER_STATE_CANCELLED = 'cancelled'
const ORDER_TRANSACTION_STATE_OPEN = 'open'
const ORDER_TRANSACTION_STATE_FAILED = 'failed'
const ORDER_TRANSACTION_STATE_REMINDED = 'reminded'
const ORDER_TRANSACTION_STATE_UNCONFIRMED = 'unconfirmed'
const ORDER_TRANSACTION_STATE_CANCELLED = 'cancelled'

const ALLOWED_TRANSACTION_STATES = [
    ORDER_TRANSACTION_STATE_OPEN,
    ORDER_TRANSACTION_STATE_FAILED,
    ORDER_TRANSACTION_STATE_REMINDED,
    ORDER_TRANSACTION_STATE_UNCONFIRMED
]

const PAYMENT_NEEDED_STATES = [
    ORDER_TRANSACTION_STATE_FAILED,
    ORDER_TRANSACTION_STATE_REMINDED,
    ORDER_TRANSACTION_STATE_UNCONFIRMED,
    ORDER_TRANSACTION_STATE_CANCELLED
]

const orderState = computed(() => props.order.stateMachineState?.technicalName || 'unknown')
const orderPaymentState = computed(() => props.order.transactions?.at(-1)?.stateMachineState?.technicalName || 'unknown')

const isPaymentNeeded = computed(() => {
    return PAYMENT_NEEDED_STATES.includes(orderPaymentState.value) && 
           orderState.value !== ORDER_STATE_CANCELLED
})

const canChangePayment = computed(() => {
    return props.showChangePayment &&
           orderState.value !== ORDER_STATE_CANCELLED &&
           ALLOWED_TRANSACTION_STATES.includes(orderPaymentState.value)
})

const canCancelOrder = computed(() => {
    return props.showCancelOrder && orderState.value !== ORDER_STATE_CANCELLED
})

const canReorder = computed(() => {
    return props.showReorder && props.order.lineItems && props.order.lineItems.length > 0
})

const containerClasses = computed(() => {
    const base = 'flex gap-2 w-full'
    return props.layout === 'vertical' ? `${base} flex-col` : `${base} flex-wrap justify-start`
})

const handleReorder = () => {
    emit('reorder', props.order.id)
}

const handleChangePayment = () => {
    emit('changePayment', props.order.id)
}

const handleCancelOrder = () => {
    emit('cancelOrder', props.order.id)
}

const handleToggleDetails = () => {
    emit('toggleDetails')
}

const viewDetailsButtonText = computed(() => {
    return props.isDetailsExpanded ? t('orders.details.hide') : t('orders.actions.viewDetails')
})

</script>

<template>
    <div :class="containerClasses">
        <!-- View Details Action -->
        <FoundationButton
            v-if="showViewDetails"
            variant="outline"
            color="secondary"
            class="flex items-center gap-1 mr-auto"
            @click="handleToggleDetails"
        >
            <span>{{ viewDetailsButtonText }}</span>
            <FoundationIcon 
                :name="isDetailsExpanded ? 'chevron-up' : 'chevron-down'" 
                class="w-4 h-4 transition-transform duration-200"
            />
        </FoundationButton>

        <!-- Change Payment Action (Priority for payment needed orders) -->
        <FoundationButton
            v-if="canChangePayment"
            variant="outline"
            @click="handleChangePayment"
        >
            <FoundationIcon 
                :name="isPaymentNeeded ? 'credit-card' : 'edit-3'" 
                class="w-4 h-4" 
            />
            {{ isPaymentNeeded ? t('orders.actions.completePayment') : t('orders.actions.changePayment') }}
        </FoundationButton>

        <!-- Reorder Action -->
        <FoundationButton
            v-if="canReorder"
            variant="outline"
            color="secondary"
            @click="handleReorder"
        >
            <FoundationIcon name="repeat" class="w-4 h-4 mr-1" />
            {{ t('orders.actions.reorder') }}
        </FoundationButton>

        <!-- Cancel Order Action -->
        <FoundationButton
            v-if="canCancelOrder"
            variant="ghost"
            class="text-red-600 hover:text-red-700 hover:bg-red-50"
            @click="handleCancelOrder"
        >
            <FoundationIcon name="x" class="w-4 h-4 mr-1" />
            {{ t('orders.actions.cancelOrder') }}
        </FoundationButton>
    </div>
</template>