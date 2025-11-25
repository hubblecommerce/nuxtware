<script setup lang="ts">
const { params } = useRoute()
const { getFormattedPrice } = usePrice()

type OrderSection = 'documents' | 'lineItems' | 'summary' | 'metadata'

const orderId = params.id as string
const {
    loadOrderDetails,
    order,
} = useOrderDetails(orderId)

const isLoading = ref(true)
const detailSections = ['documents', 'lineItems', 'summary', 'metadata'] as OrderSection[]
onMounted(async () => {
    try {
        await loadOrderDetails()
    } catch (error) {
        console.error('Failed to load order details:', error)
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div class="min-h-screen bg-surface-secondary">
        <div class="mx-auto w-full max-w-8xl px-2 py-8">
            <div class="mx-auto">
                <!-- Success Content -->
                <div class="max-w-2xl mx-auto">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="p-8 border border-border rounded-lg bg-surface text-center">
                        <div class="animate-pulse space-y-4">
                            <div class="h-8 bg-border rounded w-1/2 mx-auto"/>
                            <div class="h-4 bg-border rounded w-3/4 mx-auto"/>
                            <div class="h-4 bg-border rounded w-1/2 mx-auto"/>
                        </div>
                    </div>

                    <!-- Order Success Info -->
                    <div v-else-if="order" class="p-8 border border-border rounded-lg bg-surface text-center">
                        <div class="mb-6">
                            <FoundationIcon name="check" class="block w-16 h-16 text-success mx-auto mb-4" />
                            <FoundationHeadline tag="h2" class="text-2xl font-bold mb-3">
                                {{ $t('checkout.success.orderConfirmed') }}
                            </FoundationHeadline>
                            <p class="text-lg mb-6">
                                {{ $t('checkout.success.thankYou') }}
                            </p>
                        </div>

                        <div class="space-y-6">
                            <OrderDetails
                                :order="order"
                                :sections="detailSections"
                                expanded
                            />
                        </div>
                        <!-- Order Details -->
                        <div class="space-y-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                                <div class="p-4 bg-surface-secondary rounded-lg">
                                    <p class="text-sm font-medium  mb-2">
                                        {{ $t('checkout.success.orderNumber') }}
                                    </p>
                                    <p class="text-xl font-bold text-primary">
                                        {{ order.orderNumber }}
                                    </p>
                                </div>
                                <div class="p-4 bg-surface-secondary rounded-lg">
                                    <p class="text-sm font-medium  mb-2">
                                        {{ $t('checkout.success.orderTotal') }}
                                    </p>
                                    <p class="text-xl font-bold text-primary">
                                        {{ getFormattedPrice(order.amountTotal) }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="order.orderCustomer?.email" class="p-4 bg-surface-secondary rounded-lg">
                                <p class="text-sm font-medium  mb-2">
                                    {{ $t('checkout.success.confirmationEmail') }}
                                </p>
                                <p class="text-lg font-medium text-primary">
                                    {{ order.orderCustomer.email }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else class="p-8 border border-error rounded-lg bg-error/5 text-center">
                        <FoundationIcon name="alert-triangle" class="w-16 h-16 text-error mx-auto mb-4" />
                        <FoundationHeadline tag="h3" class="text-xl font-bold text-error mb-3">
                            {{ $t('checkout.success.orderNotFound') }}
                        </FoundationHeadline>
                        <p class="">
                            {{ $t('checkout.success.orderNotFoundDescription') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
