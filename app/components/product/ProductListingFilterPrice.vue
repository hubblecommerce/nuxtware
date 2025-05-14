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
        [key: string]: any;
    };
}>()

const emit = defineEmits<{
    'select-value': [value?: any]
}>()

const { t } = useI18n()
const { getFormattedPrice } = usePrice();

// Min/max values with defaults
const minPrice = ref(
    props.selectedFilters['min-price'] !== undefined
        ? Number(props.selectedFilters['min-price'])
        : props.filter.min ? Number(props.filter.min) : 0
)

const maxPrice = ref(
    props.selectedFilters['max-price'] !== undefined
        ? Number(props.selectedFilters['max-price'])
        : props.filter.max ? Number(props.filter.max) : 1000
)

// Default limits - ensure they're numbers
const minLimit = props.filter.min ? Number(props.filter.min) : 0
const maxLimit = props.filter.max ? Number(props.filter.max) : 1000

// Handle price changes with debounce
function onMinPriceChange(newPrice: number) {
    if (typeof newPrice !== 'number' || newPrice === Number(props.selectedFilters['min-price'])) return

    // Directly update the selectedFilters object
    props.selectedFilters['min-price'] = newPrice

    // Then emit the event to trigger search
    emit('select-value', {})
}

function onMaxPriceChange(newPrice: number) {
    if (typeof newPrice !== 'number' || newPrice === Number(props.selectedFilters['max-price'])) return

    // Directly update the selectedFilters object
    props.selectedFilters['max-price'] = newPrice

    // Then emit the event to trigger search
    emit('select-value', {})
}

// Apply debounce to avoid too many filter changes while sliding
const debouncedMinPriceUpdate = useDebounceFn(onMinPriceChange, 300)
const debouncedMaxPriceUpdate = useDebounceFn(onMaxPriceChange, 300)

// Watch for changes and emit events
watch(minPrice, debouncedMinPriceUpdate)
watch(maxPrice, debouncedMaxPriceUpdate)

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