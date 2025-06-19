<script setup lang="ts">
import type { Schemas } from "#shopware"

interface ProductSoldOutProps {
    product: Schemas['Product']
    version?: 'default' | 'minimal'
}
const props = withDefaults(defineProps<ProductSoldOutProps>(), {
    version: 'default'
})
</script>

<template>
    <template v-if="props.product.isCloseout && props.product.stock < (props.product.minPurchase || 1)">
        <div class="flex items-center gap-1 text-sm">
            <template v-if="props.version === 'minimal'">
                <FoundationIcon name="package-x" size="md" class="block text-error" aria-hidden="true" />
                <span class="sr-only">{{ $t('productSoldOut.soldOut') }}</span>
            </template>
            <template v-else>
                <div class="w-2 h-2 bg-error rounded-full" />
                <span>{{ $t('productSoldOut.soldOut') }}</span>
            </template>
        </div>
    </template>

    <template v-else-if="props.product.stock < (props.product.minPurchase || 1) && props.product.deliveryTime && props.product.restockTime">
        <div class="flex items-center gap-1 text-sm">
            <template v-if="props.version === 'minimal'">
                <FoundationIcon name="calendar-sync" size="md" class="block text-warning" aria-hidden="true" />
                <span class="sr-only">{{ $t('productSoldOut.restock', { days: props.product.restockTime }) }}</span>
            </template>
            <template v-else>
                <div class="w-2 h-2 bg-warning rounded-full" />
                <span>{{ $t('productSoldOut.restock', { days: props.product.restockTime }) }}</span>
            </template>
        </div>
    </template>
</template>