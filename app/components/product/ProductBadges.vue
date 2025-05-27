<script setup lang="ts">
import type { Schemas } from "#shopware"

interface ProductBadgesProps {
    product: Schemas["Product"]
    showTopSeller?: boolean
    showNew?: boolean
    variant?: 'default' | 'floating'
}

const props = withDefaults(defineProps<ProductBadgesProps>(), {
    showTopSeller: true,
    showNew: true,
    variant: 'default'
})

const badgeClasses = computed(() => ({
    'inline-flex items-center px-2.5 py-1.5 text-sm font-medium': true,
    'absolute -left-1': props.variant === 'floating',
    'rounded-md mr-2': props.variant === 'default',
    'z-10': true
}))

const topSellerBadgeClasses = computed(() => ({
    ...badgeClasses.value,
    'bg-[#FFBD5D] text-black': true
}))

const newBadgeClasses = computed(() => ({
    ...badgeClasses.value,
    'bg-primary-600 text-white': true
}))
</script>

<template>
    <div class="product-badges">
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