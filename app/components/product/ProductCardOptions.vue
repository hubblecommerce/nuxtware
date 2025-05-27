<script setup lang="ts">
import type { Schemas } from "#shopware"

interface ProductCardOptionsProps {
    product: Schemas["Product"]
    variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<ProductCardOptionsProps>(), {
    variant: 'default'
})

const optionClasses = computed(() => ({
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset mr-1 mb-1': true,
    'bg-secondary-50 text-secondary-600 ring-secondary-500/10': props.variant === 'default',
    'bg-secondary-100 text-secondary-700 ring-secondary-500/20': props.variant === 'compact'
}))
</script>

<template>
    <div class="product-card-options">
        <span
            v-for="option in product?.options"
            :key="option.id"
            :class="optionClasses"
            data-testid="product-option"
        >
            {{ option.group.name }}:
            {{ option.name }}
        </span>
    </div>
</template>