<script setup lang="ts">
import type { Schemas } from "#shopware"

interface ProductSoldOutProps {
    product: Schemas['Product']
    version?: 'default' | 'minimal'
}
const props = withDefaults(defineProps<ProductSoldOutProps>(), {
    version: 'default'
})

const isStockFewerMinPurchase = computed (() => {
    return props.product.stock < (props.product.minPurchase || 1)
})
</script>

<template>
    <div v-if="isStockFewerMinPurchase">
        <!-- min-height for accessible hover target -->
        <div v-if="props.product.isCloseout" class="flex items-center gap-1 text-sm min-w-[24px] min-h-[24px]">
            <template v-if="props.version === 'minimal'">
                <ComponentToolTip
                    :label="$t('productSoldOut.soldOut')"
                    :breakpoints="{
                        base: 'left',
                        '640': 'left',
                        '768': 'top',
                        '1024': 'top',
                        '1280': 'top',
                        '1536': 'top',
                    }"
                >
                    <FoundationIcon name="package-x" size="md" class="block text-error" aria-hidden="true" />
                </ComponentToolTip>
            </template>
            <template v-else>
                <div class="w-2 h-2 bg-error rounded-full" />
                <span>{{ $t('productSoldOut.soldOut') }}</span>
            </template>
        </div>

        <div v-else-if="props.product.deliveryTime && props.product.restockTime" class="flex items-center gap-1 text-sm min-w-[24px] min-h-[24px]">
            <template v-if="props.version === 'minimal'">
                <ComponentToolTip
                    :label="$t('productSoldOut.restock', { days: props.product.restockTime })"
                    :breakpoints="{
                        base: 'left',
                        '640': 'left',
                        '768': 'top',
                        '1024': 'top',
                        '1280': 'top',
                        '1536': 'top',
                    }"
                >
                    <FoundationIcon name="calendar-sync" size="md" class="block text-warning" aria-hidden="true" />
                </ComponentToolTip>
            </template>
            <template v-else>
                <div class="w-2 h-2 bg-warning rounded-full" />
                <span>{{ $t('productSoldOut.restock', { days: props.product.restockTime }) }}</span>
            </template>
        </div>
    </div>
</template>