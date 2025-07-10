<script setup lang="ts">
import type { Schemas } from '#shopware'
import { getSmallestThumbnailUrl } from '@shopware/helpers'

interface Props {
    lineItems: Schemas['OrderLineItem'][]
    showImages?: boolean
    showDescription?: boolean
    compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showImages: true,
    showDescription: true,
    compact: false
})

const { t } = useI18n()
const { getFormattedPrice } = usePrice()

const productLineItems = computed(() => {
    return props.lineItems.filter(item => item.type === 'product')
})

const hasLineItems = computed(() => productLineItems.value.length > 0)

const getItemImage = (lineItem: Schemas['OrderLineItem']) => {
    if (!props.showImages || !lineItem.cover) return null
    return getSmallestThumbnailUrl(lineItem.cover)
}

const getItemPrice = (lineItem: Schemas['OrderLineItem']) => {
    return getFormattedPrice(lineItem.unitPrice)
}

const getItemTotal = (lineItem: Schemas['OrderLineItem']) => {
    return getFormattedPrice(lineItem.totalPrice)
}

const formatItemDescription = (description: string | undefined) => {
    if (!description || !props.showDescription) return ''
    
    // Truncate long descriptions
    const maxLength = props.compact ? 60 : 120
    return description.length > maxLength 
        ? `${description.substring(0, maxLength)}...` 
        : description
}
</script>

<template>
    <div class="space-y-4">
        <!-- Line Items Table -->
        <div v-if="hasLineItems" class="overflow-hidden rounded-lg border border-border">
            <!-- Table Header -->
            <div class="bg-muted/50 px-6 py-3 border-b border-border">
                <div class="grid gap-4 text-sm font-medium text-muted-foreground" :class="compact ? 'grid-cols-4' : 'grid-cols-6'">
                    <div :class="compact ? 'col-span-2' : 'col-span-3'">
                        {{ t('orders.lineItems.product') }}
                    </div>
                    <div class="text-center">
                        {{ t('orders.lineItems.quantity') }}
                    </div>
                    <div class="text-right">
                        {{ t('orders.lineItems.price') }}
                    </div>
                    <div class="text-right">
                        {{ t('orders.lineItems.total') }}
                    </div>
                </div>
            </div>

            <!-- Line Items List -->
            <ul class="divide-y divide-border">
                <li 
                    v-for="lineItem in productLineItems" 
                    :key="lineItem.id"
                    class="px-6 py-4"
                >
                    <div class="grid gap-4 items-start" :class="compact ? 'grid-cols-4' : 'grid-cols-6'">
                        <!-- Product Info -->
                        <div :class="compact ? 'col-span-2' : 'col-span-3'" class="flex gap-3">
                            <!-- Product Image -->
                            <div 
                                v-if="showImages" 
                                class="flex-shrink-0"
                                :class="compact ? 'w-12 h-12' : 'w-16 h-16'"
                            >
                                <img
                                    v-if="getItemImage(lineItem)"
                                    :src="getItemImage(lineItem)"
                                    :alt="lineItem.label"
                                    class="w-full h-full object-cover rounded border border-border"
                                >
                                <div 
                                    v-else
                                    class="w-full h-full bg-muted rounded border border-border flex items-center justify-center"
                                >
                                    <FoundationIcon name="image" class="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>

                            <!-- Product Details -->
                            <div class="min-w-0 flex-1 space-y-1">
                                <div class="font-medium text-foreground">
                                    {{ lineItem.label }}
                                </div>
                                <div 
                                    v-if="lineItem.description && showDescription" 
                                    class="text-sm text-muted-foreground"
                                >
                                    {{ formatItemDescription(lineItem.description) }}
                                </div>
                                <div 
                                    v-if="lineItem.payload?.productNumber" 
                                    class="text-xs text-muted-foreground font-mono"
                                >
                                    {{ t('orders.lineItems.productNumber') }}: {{ lineItem.payload.productNumber }}
                                </div>
                            </div>
                        </div>

                        <!-- Quantity -->
                        <div class="text-center">
                            <span class="text-sm font-medium">{{ lineItem.quantity }}</span>
                        </div>

                        <!-- Unit Price -->
                        <div class="text-right">
                            <span class="text-sm font-medium">{{ getItemPrice(lineItem) }}</span>
                        </div>

                        <!-- Total Price -->
                        <div class="text-right">
                            <span class="text-sm font-semibold">{{ getItemTotal(lineItem) }}</span>
                        </div>
                    </div>

                    <!-- Child Line Items (variants, customizations, etc.) -->
                    <div v-if="lineItem.children && lineItem.children.length > 0" class="mt-3 ml-6 space-y-2">
                        <div 
                            v-for="child in lineItem.children" 
                            :key="child.id"
                            class="flex justify-between items-center text-sm text-muted-foreground bg-muted/25 rounded p-2"
                        >
                            <div class="flex items-center gap-2">
                                <FoundationIcon name="corner-down-right" class="w-3 h-3" />
                                <span>{{ child.label }}</span>
                                <span v-if="child.quantity > 1">({{ child.quantity }}x)</span>
                            </div>
                            <div class="font-medium">
                                {{ getFormattedPrice(child.totalPrice) }}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8 text-muted-foreground">
            <FoundationIcon name="shopping-cart" class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p class="text-sm">{{ t('orders.lineItems.empty') }}</p>
        </div>
    </div>
</template>