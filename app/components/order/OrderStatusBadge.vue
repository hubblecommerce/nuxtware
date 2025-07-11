<script setup lang="ts">
import type { Schemas } from '#shopware'

interface Props {
    order: Schemas['Order']
    showPaymentIndicator?: boolean
    variant?: 'badge' | 'text'
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    showPaymentIndicator: true,
    variant: 'badge',
    size: 'md'
})

const { t } = useI18n()

// Order states mapping
const ORDER_STATE_CANCELLED = 'cancelled'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ORDER_TRANSACTION_STATE_OPEN = 'open'
const ORDER_TRANSACTION_STATE_FAILED = 'failed'
const ORDER_TRANSACTION_STATE_REMINDED = 'reminded'
const ORDER_TRANSACTION_STATE_UNCONFIRMED = 'unconfirmed'
const ORDER_TRANSACTION_STATE_CANCELLED = 'cancelled'

const PAYMENT_NEEDED_STATES = [
    ORDER_TRANSACTION_STATE_FAILED,
    ORDER_TRANSACTION_STATE_REMINDED,
    ORDER_TRANSACTION_STATE_UNCONFIRMED,
    ORDER_TRANSACTION_STATE_CANCELLED
]

const orderState = computed(() => props.order.stateMachineState?.technicalName || 'unknown')
const orderPaymentState = computed(() => props.order.transactions?.at(-1)?.stateMachineState?.technicalName || 'unknown')

const isPaymentNeeded = computed(() => {
    return props.showPaymentIndicator && 
           PAYMENT_NEEDED_STATES.includes(orderPaymentState.value) && 
           orderState.value !== ORDER_STATE_CANCELLED
})

const statusConfig = computed(() => {
    if (isPaymentNeeded.value) {
        return {
            label: t('orders.status.paymentNeeded'),
            colorClass: 'bg-red-500 text-white',
            textColorClass: 'text-red-600',
            icon: 'alert-circle'
        }
    }

    const status = orderState.value
    switch (status) {
        case 'open':
            return {
                label: props.order.stateMachineState?.translated?.name || t('orders.status.open'),
                colorClass: 'bg-info text-info-content',
                textColorClass: 'text-info',
                icon: 'clock'
            }
        case 'in_progress':
            return {
                label: props.order.stateMachineState?.translated?.name || t('orders.status.inProgress'),
                colorClass: 'bg-warning text-warning-content',
                textColorClass: 'text-warning', 
                icon: 'loading'
            }
        case 'completed':
            return {
                label: props.order.stateMachineState?.translated?.name || t('orders.status.completed'),
                colorClass: 'bg-success text-success-content',
                textColorClass: 'text-success',
                icon: 'check'
            }
        case 'cancelled':
            return {
                label: props.order.stateMachineState?.translated?.name || t('orders.status.cancelled'),
                colorClass: 'bg-error text-error-content',
                textColorClass: 'text-error',
                icon: 'x'
            }
        default:
            return {
                label: props.order.stateMachineState?.translated?.name || t('orders.status.unknown'),
                colorClass: 'bg-neutral text-white',
                textColorClass: 'text-neutral',
                icon: 'info'
            }
    }
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return {
                badge: 'px-2 py-1 text-xs',
                icon: 'w-3 h-3',
                text: 'text-sm'
            }
        case 'lg':
            return {
                badge: 'px-4 py-2 text-base',
                icon: 'w-5 h-5',
                text: 'text-lg'
            }
        default:
            return {
                badge: 'px-3 py-1 text-sm',
                icon: 'w-4 h-4',
                text: 'text-base'
            }
    }
})
</script>

<template>
    <div class="flex items-center gap-2">
        <!-- Badge Variant -->
        <span 
            v-if="variant === 'badge'"
            class="inline-flex items-center gap-1.5 rounded-full font-medium"
            :class="[statusConfig.colorClass, sizeClasses.badge]"
        >
            <FoundationIcon 
                :name="statusConfig.icon" 
                :class="sizeClasses.icon"
            />
            {{ statusConfig.label }}
        </span>

        <!-- Text Variant -->
        <span 
            v-else
            class="inline-flex items-center gap-1.5 font-medium"
            :class="[statusConfig.textColorClass, sizeClasses.text]"
        >
            <FoundationIcon 
                :name="statusConfig.icon" 
                :class="sizeClasses.icon"
            />
            {{ statusConfig.label }}
        </span>

        <!-- Payment Needed Indicator Dot -->
        <span 
            v-if="isPaymentNeeded && variant === 'text'"
            class="w-2 h-2 bg-error text-error-content rounded-full animate-pulse"
            :title="t('orders.status.paymentNeeded')"
        />
    </div>
</template>