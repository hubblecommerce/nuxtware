<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
    filter: {
        code: string;
        min?: number;
        max?: number;
        label: string;
    };
    selectedFilters: {
        'min-price': string | number | undefined;
        'max-price': string | number | undefined;
    };
}>()

const emit = defineEmits<{
    'select-filter-value': [value: { code: string; value: string | number | undefined }]
}>()

const { getFormattedPrice } = usePrice();

// Default limits - ensure they're numbers
const minLimit = props.filter.min ? Number(props.filter.min) : 0
const maxLimit = props.filter.max ? Number(props.filter.max) : 1000

// Min/max values with defaults
const minPrice = ref(
    props.selectedFilters['min-price'] !== undefined
        ? Number(props.selectedFilters['min-price'])
        : minLimit
)

const maxPrice = ref(
    props.selectedFilters['max-price'] !== undefined
        ? Number(props.selectedFilters['max-price'])
        : maxLimit
)

// Handle price changes
function onMinPriceChange(newPrice: number) {
    if (typeof newPrice !== 'number') return

    emit('select-filter-value', {
        code: 'min-price',
        value: newPrice === minLimit ? undefined : newPrice
    })
}

function onMaxPriceChange(newPrice: number) {
    if (typeof newPrice !== 'number') return

    emit('select-filter-value', {
        code: 'max-price',
        value: newPrice === maxLimit ? undefined : newPrice
    })
}

// Apply debounce to avoid too many filter changes while sliding
const debouncedMinPriceUpdate = useDebounceFn(onMinPriceChange, 300)
const debouncedMaxPriceUpdate = useDebounceFn(onMaxPriceChange, 300)

// Watch for changes and emit events
watch(minPrice, debouncedMinPriceUpdate)
watch(maxPrice, debouncedMaxPriceUpdate)

// Watch for prop changes to update local refs
watch(() => props.selectedFilters['min-price'], (newValue) => {
    if (newValue !== undefined && newValue !== minPrice.value) {
        minPrice.value = Number(newValue)
    } else if (newValue === undefined) {
        minPrice.value = minLimit
    }
})

watch(() => props.selectedFilters['max-price'], (newValue) => {
    if (newValue !== undefined && newValue !== maxPrice.value) {
        maxPrice.value = Number(newValue)
    } else if (newValue === undefined) {
        maxPrice.value = maxLimit
    }
})

// Format price with currency
function formatPrice(value: number): string {
    return getFormattedPrice(value)
}

// Step size for the slider (dynamic based on range)
const priceStep = computed(() => {
    const range = maxLimit - minLimit
    if (range > 10000) return 100
    if (range > 1000) return 50
    if (range > 500) return 10
    return 5
})
</script>

<template>
    <div class="price-filter py-2 px-4">
        <ComponentRangeSlider 
            :min-value="minPrice" 
            :max-value="maxPrice" 
            :min-limit="minLimit" 
            :max-limit="maxLimit"
            :step="priceStep" 
            :format-value="formatPrice" 
            active-track-color="bg-secondary"
            @update:min-value="minPrice = $event" 
            @update:max-value="maxPrice = $event" 
        />
    </div>
</template>
