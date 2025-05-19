<script setup lang="ts">
interface ListingFilter {
    code: string;
    label: string;
}

const emits = defineEmits<{
    'select-filter-value': [value: { code: string; value: boolean | undefined }];
}>();

const props = defineProps<{
    filter: ListingFilter;
    selectedFilters: {
        'shipping-free': boolean | undefined;
    };
}>();

// Handle shipping-free toggle change
const onToggleChange = () => {
    const newValue = !props.selectedFilters['shipping-free'];
    emits('select-filter-value', {
        code: 'shipping-free',
        value: newValue || undefined
    });
};

// Computed property to get current filter state
const isShippingFree = computed(() => !!props.selectedFilters['shipping-free']);
</script>

<template>
    <div class="shipping-free-filter py-2 px-4">
        <ComponentToggleSwitch
            :model-value="isShippingFree"
            :label="$t('listing.filter.shippingFreeLabel')"
            theme="toggle-primary"
            @change="onToggleChange"
        />
    </div>
</template>
