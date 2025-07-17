<script setup lang="ts">
import type { Schemas } from '#shopware'

interface Props {
    order: Schemas['Order']
    showTaxes?: boolean
    showTracking?: boolean
    showAddresses?: boolean
    layout?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), {
    showTaxes: true,
    showTracking: true,
    showAddresses: false,
    layout: 'horizontal'
})

const { t } = useI18n()
const { getFormattedPrice } = usePrice()

const orderDate = computed(() => {
    const date = props.order.orderDateTime || props.order.orderDate
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
})

const paymentMethod = computed(() => {
    const transaction = props.order.transactions?.at(-1)
    return transaction?.paymentMethod?.translated?.name || transaction?.paymentMethod?.name
})

const shippingMethod = computed(() => {
    const delivery = props.order.deliveries?.[0]
    return delivery?.shippingMethod?.translated?.name || delivery?.shippingMethod?.name
})

const paymentStatus = computed(() => {
    const transaction = props.order.transactions?.at(-1)
    return transaction?.stateMachineState?.technicalName || 'unknown'
})

const shippingStatus = computed(() => {
    const delivery = props.order.deliveries?.[0]
    return delivery?.stateMachineState?.technicalName || 'unknown'
})

const trackingCodes = computed(() => {
    if (!props.showTracking) return []
    
    const delivery = props.order.deliveries?.[0]
    return delivery?.trackingCodes || []
})

const hasTrackingUrl = computed(() => {
    const delivery = props.order.deliveries?.[0]
    return delivery?.shippingMethod?.trackingUrl
})

const getTrackingUrl = (trackingCode: string) => {
    const delivery = props.order.deliveries?.[0]
    const trackingUrl = delivery?.shippingMethod?.trackingUrl
    return trackingUrl ? trackingUrl.replace('%s', trackingCode) : null
}

const calculatedTaxes = computed(() => {
    if (!props.showTaxes) return []
    return props.order.price?.calculatedTaxes || []
})

const shippingCosts = computed(() => {
    return getFormattedPrice(props.order.shippingTotal || 0)
})

const orderTotal = computed(() => {
    const total = props.order.amountTotal ?? props.order.price?.totalPrice ?? 0
    return getFormattedPrice(total)
})

const netTotal = computed(() => {
    const net = props.order.amountNet ?? props.order.price?.netPrice ?? 0
    return getFormattedPrice(net)
})

const isTaxFree = computed(() => {
    // Shopware TAX_STATE_FREE constant check
    return props.order.price?.taxStatus === 'tax-free'
})

const billingAddress = computed(() => {
    return props.order.billingAddress
})

const shippingAddress = computed(() => {
    return props.order.deliveries?.[0]?.shippingOrderAddress
})

const formatAddress = (address: Schemas['OrderAddress']) => {
    if (!address) return ''
    
    const parts = [
        [address.firstName, address.lastName].filter(Boolean).join(' '),
        address.company,
        address.street,
        [address.zipcode, address.city].filter(Boolean).join(' '),
        address.country?.translated?.name || address.country?.name
    ].filter(Boolean)
    
    return parts.join('\n')
}
</script>

<template>
    <div class="space-y-6">
        <div class="grid gap-6" :class="layout === 'horizontal' ? 'lg:grid-cols-2' : 'grid-cols-1'">
            <!-- Order Information -->
            <div class="space-y-4">
                <FoundationHeadline tag="h5" class="text-base font-medium text-muted-foreground">
                    {{ t('orders.summary.orderInformation') }}
                </FoundationHeadline>
                
                <dl class="space-y-2 text-sm">
                    <!-- Order Date -->
                    <div class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.orderDate') }}</dt>
                        <dd class="font-medium">{{ orderDate }}</dd>
                    </div>

                    <!-- Order Number -->
                    <div class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.orderNumber') }}</dt>
                        <dd class="font-medium font-mono">{{ order.orderNumber }}</dd>
                    </div>

                    <!-- Payment Method -->
                    <div v-if="paymentMethod" class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.paymentMethod') }}</dt>
                        <dd class="font-medium">{{ paymentMethod }}</dd>
                    </div>

                    <!-- Payment Status -->
                    <div class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.paymentStatus') }}</dt>
                        <dd class="text-sm">{{ t(`orders.paymentStatus.${paymentStatus}`) }}</dd>
                    </div>

                    <!-- Shipping Method -->
                    <div v-if="shippingMethod" class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.shippingMethod') }}</dt>
                        <dd class="font-medium">{{ shippingMethod }}</dd>
                    </div>

                    <!-- Shipping Status -->
                    <div class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.shippingStatus') }}</dt>
                        <dd class="text-sm">{{ t(`orders.shippingStatus.${shippingStatus}`) }}</dd>
                    </div>

                    <!-- Tracking Information -->
                    <div v-if="trackingCodes.length > 0" class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.tracking') }}</dt>
                        <dd class="space-y-1">
                            <div v-for="code in trackingCodes" :key="code" class="font-medium">
                                <a 
                                    v-if="hasTrackingUrl && getTrackingUrl(code)"
                                    :href="getTrackingUrl(code) as string"
                                    target="_blank"
                                    rel="noopener"
                                    class="text-primary hover:underline"
                                >
                                    {{ code }}
                                    <FoundationIcon name="external-link" class="w-3 h-3 inline ml-1" />
                                </a>
                                <span v-else class="font-mono">{{ code }}</span>
                            </div>
                        </dd>
                    </div>

                    <!-- No Tracking Available -->
                    <div v-else-if="showTracking" class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.tracking') }}</dt>
                        <dd class="text-muted-foreground">{{ t('orders.summary.trackingNotAvailable') }}</dd>
                    </div>
                </dl>
            </div>

            <!-- Order Totals -->
            <div class="space-y-4">
                <FoundationHeadline tag="h5" class="text-base font-medium text-muted-foreground">
                    {{ t('orders.summary.orderTotals') }}
                </FoundationHeadline>
                
                <dl class="space-y-2 text-sm">
                    <!-- Shipping Costs -->
                    <div class="flex justify-between">
                        <dt class="text-muted-foreground">{{ t('orders.summary.shippingCosts') }}</dt>
                        <dd class="font-medium">{{ shippingCosts }}</dd>
                    </div>

                    <!-- Tax Breakdown -->
                    <template v-if="showTaxes && calculatedTaxes.length > 0">
                        <div 
                            v-for="tax in calculatedTaxes" 
                            :key="tax.taxRate"
                            class="flex justify-between"
                        >
                            <dt class="text-muted-foreground">
                                {{ t('orders.summary.tax', { rate: tax.taxRate }) }}
                            </dt>
                            <dd class="font-medium">
                                {{ getFormattedPrice(tax.tax) }}
                            </dd>
                        </div>
                    </template>

                    <!-- Divider -->
                    <div class="border-t border-border my-2" />

                    <!-- Net Total (for tax-free orders) -->
                    <div v-if="isTaxFree" class="flex justify-between font-semibold">
                        <dt>{{ t('orders.summary.netTotal') }}</dt>
                        <dd>{{ netTotal }}</dd>
                    </div>

                    <!-- Grand Total -->
                    <div v-else class="flex justify-between font-semibold text-lg">
                        <dt>{{ t('orders.summary.total') }}</dt>
                        <dd>{{ orderTotal }}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <!-- Addresses Section -->
        <div v-if="showAddresses && (billingAddress || shippingAddress)" class="space-y-4 pt-4 border-t border-border">
            <FoundationHeadline tag="h5" class="text-base font-medium text-muted-foreground">
                {{ t('orders.summary.addresses') }}
            </FoundationHeadline>
            
            <div class="grid gap-6 md:grid-cols-2">
                <!-- Billing Address -->
                <div v-if="billingAddress" class="space-y-2">
                    <div class="text-sm font-medium">{{ t('orders.summary.billingAddress') }}</div>
                    <address class="text-sm text-muted-foreground not-italic whitespace-pre-line">
                        {{ formatAddress(billingAddress) }}
                    </address>
                </div>

                <!-- Shipping Address -->
                <div v-if="shippingAddress" class="space-y-2">
                    <div class="text-sm font-medium">{{ t('orders.summary.shippingAddress') }}</div>
                    <address class="text-sm text-muted-foreground not-italic whitespace-pre-line">
                        {{ formatAddress(shippingAddress) }}
                    </address>
                </div>
            </div>
        </div>
    </div>
</template>