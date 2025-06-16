<script setup lang="ts">
import type { Schemas } from "#shopware"

interface ProductBadgesProps {
    product: Schemas["Product"]
    showTopSeller?: boolean
    showNew?: boolean
    showSale?: boolean
    variant?: 'default' | 'floating'
}

const props = withDefaults(defineProps<ProductBadgesProps>(), {
    showTopSeller: true,
    showNew: true,
    showSale: true,
    variant: 'default'
})

const productRef = computed(() => props.product)
const {
    price,
    displayFrom,
    isListPrice
} = useProductPriceCustom(productRef)

const badgeClasses = computed(() => ({
    'inline-flex items-center px-2.5 py-1.5 text-sm font-medium': true,
    '': props.variant === 'floating',
    'rounded-md mr-2': props.variant === 'default',
    'z-10': true
}))

const topSellerBadgeClasses = computed(() => ({
    ...badgeClasses.value,
    'bg-secondary text-secondary-content': true
}))

const newBadgeClasses = computed(() => ({
    ...badgeClasses.value,
    'bg-primary text-primary-content': true
}))

const saleBadgeClasses = computed(() => ({
    ...badgeClasses.value,
    'bg-error text-error-light': true
}))
</script>

<template>
    <div class="product-badges absolute -left-1 flex flex-col items-start gap-2">
         <span 
            v-if="showSale && isListPrice && !displayFrom && price?.listPrice && price.listPrice.percentage"
            :class="saleBadgeClasses"
            data-testid="product-sale-badge"
        >
            -{{ Math.round(price.listPrice.percentage) }}%
        </span>

        <span
            v-if="showTopSeller && product.markAsTopseller"
            :class="topSellerBadgeClasses"
            data-testid="product-topseller-badge"
        >
            {{ $t("product.badges.topseller") }}
        </span>
        
        <span
            v-if="showNew && product.isNew"
            :class="newBadgeClasses"
            data-testid="product-new-badge"
        >
            {{ $t("product.badges.new") }}
        </span>
    </div>
</template>