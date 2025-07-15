<script setup lang="ts">
import type { Schemas } from '#shopware'

interface Props {
    order: Schemas['Order']
    showExpandableDetails?: boolean
    detailSections?: ('documents' | 'lineItems' | 'summary' | 'metadata')[]
    actionsLayout?: 'horizontal' | 'vertical'
    statusVariant?: 'badge' | 'text'
}

const props = withDefaults(defineProps<Props>(), {
    showExpandableDetails: true,
    detailSections: () => ['documents', 'lineItems', 'summary', 'metadata'],
    actionsLayout: 'horizontal',
    statusVariant: 'badge'
})

const emit = defineEmits<{
    (e: 'reorder' | 'changePayment' | 'cancelOrder', orderId: string): void
}>()

const { t } = useI18n()
const { getFormattedPrice } = usePrice()
const { error: errorNotification } = useGlobalNotifications()

// Order data computeds
const orderDate = computed(() => {
    return new Date(props.order.orderDate).toLocaleDateString()
})

const orderTotal = computed(() => {
    return getFormattedPrice(props.order.price.totalPrice)
})

// Expandable details state
const isDetailsExpanded = ref(false)
const showCancelModal = ref(false)
const cancelModal = ref<{ modalController: ReturnType<typeof useModal> } | null>(null)

// Action handlers
const handleReorder = (orderId: string) => {
    emit('reorder', orderId)
}

const handleChangePayment = (orderId: string) => {
    emit('changePayment', orderId)
}

const handleCancelOrder = () => {
    showCancelModal.value = true
    // Wait for next tick to ensure component is mounted before opening modal
    nextTick(() => {
        cancelModal.value?.modalController.open()
    })
}

const handleToggleDetails = () => {
    isDetailsExpanded.value = !isDetailsExpanded.value
}

const handleCancelModalConfirm = async (orderId: string) => {
    try {
        emit('cancelOrder', orderId)
    } catch (error) {
        console.error('Error cancelling order:', error)
        errorNotification(t('orders.cancel.error'))
    }
}

const handleCancelModalClose = () => {
    showCancelModal.value = false
}
</script>

<template>
    <div class="border border-border rounded-lg bg-card overflow-hidden">
        <!-- Order Header -->
        <div class="p-4 md:p-6">
            <!-- Order Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4">
                <!-- Order Number -->
                <div class="space-y-1">
                    <div class="text-sm font-medium text-muted-foreground">
                        {{ t('orders.orderNumber') }}
                    </div>
                    <div class="font-semibold">
                        {{ order.orderNumber }}
                    </div>
                </div>

                <!-- Order Date -->
                <div class="space-y-1">
                    <div class="text-sm font-medium text-muted-foreground">
                        {{ t('orders.orderDate') }}
                    </div>
                    <div class="font-semibold">
                        {{ orderDate }}
                    </div>
                </div>

                <!-- Order Total -->
                <div class="space-y-1">
                    <div class="text-sm font-medium text-muted-foreground">
                        {{ t('orders.orderTotal') }}
                    </div>
                    <div class="font-semibold">
                        {{ orderTotal }}
                    </div>
                </div>

                <!-- Order Status -->
                <div class="space-y-1">
                    <div class="text-sm font-medium text-muted-foreground">
                        {{ t('orders.orderStatus') }}
                    </div>
                    <OrderStatusBadge 
                        :order="order" 
                        :variant="statusVariant"
                        size="md"
                    />
                </div>
            </div>

            <!-- Order Items Summary and Actions -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-border">
                <!-- Order Actions -->
                <OrderActions
                    :order="order"
                    :layout="actionsLayout"
                    :is-details-expanded="isDetailsExpanded"
                    size="md"
                    @reorder="handleReorder"
                    @change-payment="handleChangePayment"
                    @cancel-order="handleCancelOrder"
                    @toggle-details="handleToggleDetails"
                />
            </div>
        </div>

        <!-- Cancel Order Modal -->
        <OrderCancelModal
            v-if="showCancelModal"
            ref="cancelModal"
            :order="order"
            @confirm="handleCancelModalConfirm"
            @close="handleCancelModalClose"
        />

        <!-- Expandable Order Details -->
        <OrderDetails
            v-if="showExpandableDetails"
            :order="order"
            :expanded="isDetailsExpanded"
            :sections="detailSections"
        />
    </div>
</template>