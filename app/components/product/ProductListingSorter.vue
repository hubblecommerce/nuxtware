<script setup lang="ts">
import type { Schemas } from "#shopware";

interface ProductListingSorterProps {
    currentSorting?: string
    availableSortings?: Schemas["ProductSorting"][] | { key: string; label: string }[] | undefined
    /**
     * Optional instance ID for multiple sorter instances
     */
    instanceId?: string
}

const props = withDefaults(defineProps<ProductListingSorterProps>(), {
    currentSorting: undefined,
    instanceId: '',
    availableSortings: () => []
})

const emit = defineEmits<{
    (e: 'update:sorting', sorting: string): void
}>()

const uniqueId = useId()
const sorterId = computed(() => props.instanceId || `sorter-${uniqueId}`)

const changeSorting = (event: Event) => {
    const select = event.target as HTMLSelectElement
    const value = select.value
    
    if (value !== props.currentSorting) {
        emit('update:sorting', value)
    }
}

const getSortingLabel = (sorting: any) => {
    return sorting.translated?.label || sorting.label || sorting.key || sorting
}
</script>

<template>
    <div class="product-listing-sorter relative" :aria-label="$t('sorter.sort_by')">
        <label 
            :for="`${sorterId}-select`" 
            class="block text-sm font-medium text-gray-700 mr-2"
        >
            {{ $t('sorter.sort_by') }}:
        </label>
        
        <div class="relative mt-1">
            <select
                :id="`${sorterId}-select`"
                class="block w-full pl-3 pr-10 py-2 text-base border-border rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                @change="changeSorting"
            >
                <option
                    v-for="sorting in availableSortings"
                    :key="sorting.key"
                    :value="sorting.key"
                    :selected="sorting.key === currentSorting"
                    :aria-label="$t('sorter.sort_by_option', { option: getSortingLabel(sorting) })"
                >
                    {{ getSortingLabel(sorting) }}
                </option>
            </select>
        </div>
    </div>
</template>
