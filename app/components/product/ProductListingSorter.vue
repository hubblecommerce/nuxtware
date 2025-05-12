<script setup lang="ts">
import type { Schemas } from "#shopware";
import type { SelectOption } from "#imports";

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

const model = ref(props.currentSorting)
watch(model, (newValue) => {
    if (newValue !== props.currentSorting) {
        emit('update:sorting', newValue as string)
    }
})

watch(() => props.currentSorting, (newValue) => {
    model.value = newValue
})

const getSortingLabel = (sorting: any) => {
    return sorting.translated?.label || sorting.label || sorting.key || sorting
}

const sortingOptions = computed<SelectOption[]>(() => {
    return props.availableSortings.map(sorting => ({
        value: sorting.key,
        label: getSortingLabel(sorting)
    }))
})
</script>

<template>
    <div class="product-listing-sorter relative" :aria-label="$t('sorter.sort_by')">
        <label 
            :for="`${sorterId}-select`" 
            class="sr-only"
        >
            {{ $t('sorter.sort_by') }}:
        </label>
        
        <div class="relative mt-1">
            <FoundationSelect
                v-model="model"
                :name="`${sorterId}-select`"
                :options="sortingOptions"
                class="min-w-[200px]"
                size="small"
            >
                <template #icon>
                    <FoundationIcon name="arrow-up-down" />
                </template>
            </FoundationSelect>
        </div>
    </div>
</template>
