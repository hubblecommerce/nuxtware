<script setup lang="ts">
interface ListingFilter {
    code: string;
    label: string;
}

const emits = defineEmits<{
    'select-filter-value': [value: { code: string; value: string | number | undefined }];
}>();

const props = defineProps<{
    filter: ListingFilter;
    selectedFilters: {
        rating: string | number | undefined;
    };
}>();

// Handle rating change
const onRatingChange = (newRating: number | undefined) => {
    emits('select-filter-value', {
        code: 'rating',
        value: newRating
    });
};
</script>

<template>
    <div class="price-filter py-2 px-4">
        <ComponentReviewStars 
            :model-value="Number(props.selectedFilters?.rating)" 
            interactive 
            @update:model-value="onRatingChange" 
        />
    </div>
</template>
