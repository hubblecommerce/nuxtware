<script setup lang="ts">
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

const changeLimit = (limit: number) => {
    if (limit !== props.currentLimit) {
        emit('update:limit', limit)
    }
}
</script>

<template>
    <div 
        :id="limiterId"
        class="product-listing-limiter flex items-center justify-end gap-2 text-sm my-4"
        :aria-label="$t('limiter.items_per_page')"
    >
        <span class="hidden sm:inline">{{ $t('limiter.show') }}:</span>
        
        <div class="flex flex-wrap gap-2">
            <FoundationButton
                v-for="limit in availableLimits"
                :key="`${limiterId}-${limit}`"
                :aria-label="$t('limiter.change_items_per_page', { limit })"
                :aria-current="limit === currentLimit ? 'true' : undefined"
                :class="[
                    'px-3 py-1 min-w-[2.5rem] border',
                    limit === currentLimit 
                        ? 'border-primary bg-primary-light font-bold' 
                        : 'border-border hover:border-primary'
                ]"
                @click="changeLimit(limit)"
            >
                {{ limit }}
            </FoundationButton>
        </div>
        
        <span class="hidden sm:inline">{{ $t('limiter.items') }}</span>
    </div>
</template>
