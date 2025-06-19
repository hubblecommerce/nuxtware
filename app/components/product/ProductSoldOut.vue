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
        <!-- min-height for accessible hover target -->
        <div class="flex items-center gap-1 text-sm min-w-[24px] min-h-[24px]">
            <template v-if="props.version === 'minimal'">
                <ComponentToolTip :label="$t('productSoldOut.soldOut')" position-desktop="top" position-mobile="right" >
                    <FoundationIcon name="package-x" size="md" class="block text-error" aria-hidden="true" />
                </ComponentToolTip>
            </template>
            <template v-else>
                <div class="w-2 h-2 bg-error rounded-full" />
                <span>{{ $t('productSoldOut.soldOut') }}</span>
            </template>
        </div>
    </template>

    <template v-else-if="props.product.stock < (props.product.minPurchase || 1) && props.product.deliveryTime && props.product.restockTime">
        <div class="flex items-center gap-1 text-sm min-w-[24px] min-h-[24px]">
            <template v-if="props.version === 'minimal'">
                <ComponentToolTip :label="$t('productSoldOut.restock', { days: props.product.restockTime })" position-desktop="top" position-mobile="right" >
                    <FoundationIcon name="calendar-sync" size="md" class="block text-warning" aria-hidden="true" />
                </ComponentToolTip>
            </template>
            <template v-else>
                <div class="w-2 h-2 bg-warning rounded-full" />
                <span>{{ $t('productSoldOut.restock', { days: props.product.restockTime }) }}</span>
            </template>
        </div>
    </template>
</template>