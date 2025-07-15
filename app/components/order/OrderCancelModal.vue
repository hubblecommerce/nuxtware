<script setup lang="ts">
import type { Schemas } from '#shopware'

interface Props {
    order: Schemas['Order']
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm', orderId: string): void
}>()

const { t } = useI18n()
const { error: errorNotification } = useGlobalNotifications()
const { apiClient } = useShopwareContext()

// Modal controller
const modalController = useModal('order-cancel-modal')

const isLoading = ref(false)

const handleClose = () => {
    if (isLoading.value) return
    modalController.close()
    emit('close')
}

const handleConfirm = async () => {
    if (isLoading.value) return
    
    try {
        isLoading.value = true
        
        // Cancel the order using Shopware API client
        await apiClient.invoke('cancelOrder post /order/state/cancel', {
            body: {
                orderId: props.order.id
            }
        })
        
        // Emit success event
        emit('confirm', props.order.id)
        
        // Close the modal
        modalController.close()
        emit('close')
    } catch (error) {
        console.error('Error cancelling order:', error)
        errorNotification(t('orders.cancel.error'))
    } finally {
        isLoading.value = false
    }
}

// Expose modal controller for parent components
defineExpose({
    modalController
})
</script>

<template>
    <ComponentModal
        :controller="modalController"
        :modal-headline="t('orders.cancel.modalTitle')"
        :close-on-click-outside="false"
    >
        <div class="bg-error/10 p-4 space-y-4 rounded-lg">
            <!-- Order Information -->
            <div class="bg-error-content rounded border border-red-200 p-4">
                <div class="space-y-2">
                    <p class="text-sm text-error">
                        {{ t('orders.cancel.orderNumber') }}
                    </p>
                    <p class="font-semibold font-mono text-error">
                        {{ order.orderNumber }}
                    </p>
                </div>
            </div>

            <!-- Confirmation Text -->
            <div class="space-y-3 text-sm">
                <p class="text-error">
                    {{ t('orders.cancel.confirmationText') }}
                </p>
                <p class="text-error">
                    {{ t('orders.cancel.warningText') }}
                </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
                <FoundationButton
                    variant="outline"
                    class="flex-1"
                    :disabled="isLoading"
                    @click="handleClose"
                >
                    {{ t('orders.cancel.keepOrder') }}
                </FoundationButton>
                
                <FoundationButton
                    class="flex-1"
                    color="primary"
                    :disabled="isLoading"
                    @click="handleConfirm"
                >
                    <FoundationIcon 
                        v-if="isLoading" 
                        name="loading" 
                        class="w-4 h-4 animate-spin mr-2" 
                    />
                    {{ t('orders.cancel.confirmCancel') }}
                </FoundationButton>
            </div>
        </div>
    </ComponentModal>
</template>