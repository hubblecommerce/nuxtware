<script setup lang="ts">
import type { Schemas } from '#shopware'

interface Props {
    order: Schemas['Order']
    expanded?: boolean
    sections?: OrderSection[]
}

type OrderSection = 'documents' | 'lineItems' | 'summary' | 'metadata'

const props = withDefaults(defineProps<Props>(), {
    expanded: false,
    sections: () => ['documents', 'lineItems', 'summary', 'metadata'],
})

const { t } = useI18n()

const isExpanded = ref(props.expanded)

watch(() => props.expanded, (newValue) => {
    isExpanded.value = newValue
})

const showDocuments = computed(() => props.sections.includes('documents'))
const showLineItems = computed(() => props.sections.includes('lineItems'))
const showSummary = computed(() => props.sections.includes('summary'))

const hasDocuments = computed(() => props.order.documents && props.order.documents.length > 0)
const hasLineItems = computed(() => props.order.lineItems && props.order.lineItems.length > 0)
</script>

<template>
    <div :class="{ 'border-t border-border p-2 md:p-6': isExpanded }">
        <!-- Expandable Content -->
        <div 
            v-if="isExpanded"
            class="space-y-6"
        >
            <!-- Documents Section -->
            <div v-if="showDocuments && hasDocuments" class="space-y-4">
                <FoundationHeadline tag="h4" class="text-lg font-semibold">
                    {{ t('orders.details.documents') }}
                </FoundationHeadline>
                <OrderDocumentsList 
                    :documents="order.documents || []"
                    :order-id="order.id"
                />
            </div>

            <!-- Line Items Section -->
            <div v-if="showLineItems && hasLineItems" class="space-y-4">
                <FoundationHeadline tag="h4" class="text-lg font-semibold">
                    {{ t('orders.details.items') }}
                </FoundationHeadline>
                <OrderLineItemsTable 
                    :line-items="order.lineItems || []"
                    :currency="order.currency"
                />
            </div>

            <!-- Customer Comment Section -->
            <div v-if="order.customerComment" class="space-y-4">
                <FoundationHeadline tag="h4" class="text-lg font-semibold">
                    {{ t('orders.details.customerComment') }}
                </FoundationHeadline>
                <div class="bg-muted/50 rounded-lg p-4">
                    <p class="text-sm text-muted-foreground whitespace-pre-wrap">
                        {{ order.customerComment }}
                    </p>
                </div>
            </div>

            <!-- Order Summary Section -->
            <div v-if="showSummary" class="space-y-4">
                <FoundationHeadline tag="h4" class="text-lg font-semibold">
                    {{ t('orders.details.summary') }}
                </FoundationHeadline>
                <OrderSummary 
                    :order="order"
                    :show-taxes="true"
                    :show-tracking="true"
                    :show-addresses="true"
                />
            </div>
        </div>
    </div>
</template>