<script setup lang="ts">
interface FoundationPriceProps {
    value: number | undefined
    variant?: 'default' | 'compact' | 'large'
}

const props = withDefaults(defineProps<FoundationPriceProps>(), {
    variant: 'default'
})

const { getFormattedPrice } = usePrice()
const formattedPrice = computed<string>(() => getFormattedPrice(props.value))

// Class variations based on variant
const priceClasses = computed(() => ({
    'text-sm': props.variant === 'default',
    'text-xs': props.variant === 'compact',
    'text-lg font-bold': props.variant === 'large'
}))
</script>

<template>
    <span :class="priceClasses">
        <slot name="beforePrice" />
        {{ formattedPrice }}
        <slot name="afterPrice" />
    </span>
</template>