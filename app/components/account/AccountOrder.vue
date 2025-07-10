<script setup lang="ts">
import type { Schemas } from '#shopware'

interface Props {
    order: Schemas['Order']
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'reorder', orderId: string): void
}>()

const { getFormattedPrice } = usePrice()
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

const orderDate = computed(() => {
    return new Date(props.order.orderDate).toLocaleDateString()
})

const orderTotal = computed(() => {
    return getFormattedPrice(props.order.price.totalPrice)
})

const orderStatusColor = computed(() => {
    const status = props.order.stateMachineState?.technicalName
    switch (status) {
        case 'open':
            return 'text-blue-600'
        case 'in_progress':
            return 'text-yellow-600'
        case 'completed':
            return 'text-green-600'
        case 'cancelled':
            return 'text-red-600'
        default:
            return 'text-gray-600'
    }
})

const orderItemsCount = computed(() => {
    return props.order.lineItems?.length || 0
})
</script>

<template>
    <div class="border border-border rounded-lg p-4 md:p-6 mb-4 bg-card">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <!-- Order Number -->
            <div class="space-y-1">
                <div class="text-sm font-medium text-muted-foreground">
                    {{ $t('orders.orderNumber') }}
                </div>
                <div class="font-semibold">
                    {{ order.orderNumber }}
                </div>
            </div>

            <!-- Order Date -->
            <div class="space-y-1">
                <div class="text-sm font-medium text-muted-foreground">
                    {{ $t('orders.orderDate') }}
                </div>
                <div class="font-semibold">
                    {{ orderDate }}
                </div>
            </div>

            <!-- Order Total -->
            <div class="space-y-1">
                <div class="text-sm font-medium text-muted-foreground">
                    {{ $t('orders.orderTotal') }}
                </div>
                <div class="font-semibold">
                    {{ orderTotal }}
                </div>
            </div>

            <!-- Order Status -->
            <div class="space-y-1">
                <div class="text-sm font-medium text-muted-foreground">
                    {{ $t('orders.orderStatus') }}
                </div>
                <div class="font-semibold" :class="orderStatusColor">
                    {{ order.stateMachineState?.name || 'Unknown' }}
                </div>
            </div>
        </div>

        <!-- Order Items Summary -->
        <div class="mt-4 pt-4 border-t border-border">
            <div class="text-sm text-muted-foreground mb-2">
                {{ $t('orders.orderItems') }}: {{ orderItemsCount }}
            </div>
            
            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2">
                <FoundationLink
                    :href="formatLink(`/account/orders/${order.id}`)"
                    class="btn btn-outline btn-sm"
                >
                    {{ $t('orders.viewOrderDetails') }}
                </FoundationLink>
                
                <FoundationButton
                    variant="ghost"
                    @click="emit('reorder', order.id)"
                >
                    {{ $t('orders.reorder') }}
                </FoundationButton>
            </div>
        </div>
    </div>
</template>