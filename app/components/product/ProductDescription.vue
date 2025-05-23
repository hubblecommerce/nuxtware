<script setup lang="ts">
import type { Schemas } from "#shopware"
import { getTranslatedProperty } from '@shopware/helpers'

interface ProductDescriptionProps {
    product: Schemas["Product"]
    lines?: number
    variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<ProductDescriptionProps>(), {
    lines: 2,
    variant: 'default'
})

const description = computed(() => getTranslatedProperty(props.product, 'description'))

// Dynamic line-clamp classes
const descriptionClasses = computed(() => ({
    'text-sm text-center leading-relaxed': props.variant === 'default',
    'text-xs text-center leading-tight': props.variant === 'compact',
    [`line-clamp-${props.lines}`]: true,
    'min-h-[32px]': props.lines === 2,
    'min-h-[24px]': props.lines === 1,
    'min-h-[48px]': props.lines === 3
}))
</script>

<template>
    <div 
        v-if="description"
        class="product-description"
        data-testid="product-description"
    >
        <p :class="descriptionClasses">
            {{ description }}
        </p>
    </div>
</template>
