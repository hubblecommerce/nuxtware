<script setup lang="ts">
import type { Schemas } from '#shopware';

interface ListingFilter {
    code: string;
    label: string;
}

const emits =
    defineEmits<
        (e: 'select-value', value: unknown) => void
    >();

const props = defineProps<{
    filter: ListingFilter;
    selectedFilters: Schemas['ProductListingResult']['currentFilters'];
}>();

// Handle rating change
const onRatingChange = (newRating: number | undefined) => {
    // Directly update the selectedFilters object
    // Note: Parent component expects direct mutation of this reactive object
    // eslint-disable-next-line vue/no-mutating-props
    props.selectedFilters.rating = newRating
    emits('select-value', {});
};
</script>

<template>
    <div class="price-filter py-2 px-4">
        <ComponentReviewStars :model-value="props.selectedFilters?.rating" interactive @update:model-value="onRatingChange" />
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
