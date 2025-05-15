<script setup lang="ts">
import type { Schemas } from '#shopware';

interface ListingFilter {
    code: string;
    label: string;
}

const emits = defineEmits<(e: 'select-value', value: unknown) => void>();

const props = defineProps<{
    filter: ListingFilter;
    selectedFilters: Schemas['ProductListingResult']['currentFilters'];
}>();

// Handle shipping-free toggle change
const onToggleChange = () => {
    // Directly update the selectedFilters object
    // Note: Parent component expects direct mutation of this reactive object
    // eslint-disable-next-line vue/no-mutating-props
    props.selectedFilters['shipping-free'] = !props.selectedFilters['shipping-free'];
    emits('select-value', {});
};

// Computed property to get current filter state
const isShippingFree = computed(() => !!props.selectedFilters['shipping-free']);
</script>

<template>
    <div class="shipping-free-filter py-2 px-4">
        <ComponentToggleSwitch
            :model-value="isShippingFree"
            :label="filter.label"
            theme="toggle-primary"
            @change="onToggleChange"
        />
    </div>
</template>