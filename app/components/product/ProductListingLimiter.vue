<script setup lang="ts">
import type { SelectOption } from "#imports";

interface ProductListingLimiterProps {
    currentLimit: number
    availableLimits?: number[]
    /**
     * Optional instance ID for multiple limiter instances
     */
    instanceId?: string
}

const props = withDefaults(defineProps<ProductListingLimiterProps>(), {
    availableLimits: () => [1, 12, 24, 36, 48],
    instanceId: ''
})

const emit = defineEmits<{
    (e: 'update:limit', limit: number): void
}>()

// Generate unique ID for the component
const uniqueId = useId()
const limiterId = computed(() => props.instanceId || `limiter-${uniqueId}`)

const model = ref(props.currentLimit)

watch(model, (newValue) => {
    if (newValue !== props.currentLimit) {
        emit('update:limit', Number(newValue))
    }
})

watch(() => props.currentLimit, (newValue) => {
    model.value = newValue
})

const limitOptions = computed<SelectOption[]>(() => {
    return props.availableLimits.map(limit => ({
        value: limit,
        label: limit.toString()
    }))
})
</script>

<template>
    <div 
        :id="limiterId"
        class="product-listing-limiter flex items-center justify-end gap-2 text-sm"
        :aria-label="$t('limiter.items_per_page')"
    >
        <span class="hidden sm:inline">{{ $t('limiter.show') }}:</span>
        
        <div class="w-24">
            <FoundationSelect
                v-model="model"
                :options="limitOptions"
                size="small"
                :name="`${limiterId}-select`"
                :aria-label="$t('limiter.items_per_page')"
            />
        </div>
        
        <span class="hidden sm:inline">{{ $t('limiter.items') }}</span>
    </div>
</template>
