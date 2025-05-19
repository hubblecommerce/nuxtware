<script setup lang="ts">
import type { Schemas } from '#shopware';
import { getTranslatedProperty } from '@shopware/helpers'

interface ListingFilter {
    code: string;
    label: string;
    name: string;
    options: Array<Schemas['PropertyGroupOption'] & { count: number }>;
    entities: Array<Schemas['ProductManufacturer'] & { count: number }>;
}

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    manufacturer: Set<string>;
    properties: Set<string>;
  };
}>();

const emits = defineEmits<{
  'select-filter-value': [value: { code: string; value: string }];
}>();

// Determine if this is a manufacturer or properties filter
const filterType = computed(() => props.filter.options ? 'properties' : 'manufacturer');

// Get the current selected values for this filter type
const currentlySelected = computed(() => props.selectedFilters[filterType.value]);

// Handle checkbox change
function handleCheckboxChange(optionId: string) {
    emits('select-filter-value', {
        code: props.filter.code,
        value: optionId,
    });
}

// Check if an option is selected
function isOptionSelected(optionId: string) {
    return currentlySelected.value.has(optionId);
}
</script>

<template>
    <div class="flex flex-col">
        <FoundationLabel v-for="option in filter.options || filter.entities" :key="option.id">
            <FoundationCheckbox
                :model-value="isOptionSelected(option.id)"
                type="checkbox"
                :value="option.id"
                @update:model-value="() => handleCheckboxChange(option.id)"
            />
            {{ getTranslatedProperty(option, 'name') }}
        </FoundationLabel>
    </div>
</template>
