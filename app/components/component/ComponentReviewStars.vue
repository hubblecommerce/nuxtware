<script setup lang="ts">
import type { IconSize } from '#imports'

const props = defineProps<{
    // The current rating value (1-5, or undefined/0 for no rating)
    modelValue: number | undefined;
    // Whether the stars are interactive (can be clicked/hovered)
    interactive?: boolean;
    // Optional size for the stars
    size?: IconSize;
    // Optional color class for the stars
    color?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number | undefined): void;
}>();

// Map the IconSize to Tailwind CSS classes
const getSizeClass = (size?: IconSize): string => {
    const sizeClasses = {
        'xs': 'w-4 h-4',
        'sm': 'w-5 h-5',
        'md': 'w-6 h-6',
        'lg': 'w-8 h-8',
        'xl': 'w-10 h-10',
        '2xl': 'w-12 h-12'
    };
    
    return sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
};

const isHoverActive = ref(false);
const hoveredIndex = ref(0);

// The rating to display (either the hovered rating or the actual rating)
const displayedScore = computed(() =>
    isHoverActive.value ? hoveredIndex.value : Number(props.modelValue) || 0
);

// Handle hovering over a star
const hoverRating = (rating: number) => {
    if (!props.interactive) return;

    hoveredIndex.value = rating;
    isHoverActive.value = true;
};

// Clear hover state when mouse leaves the component
const clearHover = () => {
    if (!props.interactive) return;

    isHoverActive.value = false;
};

// Handle clicking on a star
const onChangeRating = () => {
    if (!props.interactive) return;

    // Toggle the rating off if clicking the same value
    const newValue = Number(props.modelValue) !== hoveredIndex.value
        ? hoveredIndex.value
        : undefined;

    emit('update:modelValue', newValue);
};
</script>

<template>
    <div 
        class="flex" 
        role="group" 
        aria-label="Rating"
        @mouseleave="clearHover" 
    >
        <div 
            v-for="i in 5" 
            :key="i" 
            :class="[
                getSizeClass(props.size),
                {
                    'cursor-pointer': props.interactive,
                    'focus-style': props.interactive
                }
            ]"
            :tabindex="props.interactive ? 0 : -1"
            role="radio"
            :aria-checked="displayedScore >= i ? 'true' : 'false'"
            :aria-label="`${i} star${i === 1 ? '' : 's'}`"
            :aria-setsize="5"
            :aria-posinset="i"
            @mouseover="props.interactive && hoverRating(i)" 
            @click="props.interactive && onChangeRating()" 
            @keydown.enter="props.interactive && onChangeRating()"
            @keydown.space.prevent="props.interactive && onChangeRating()"
            @focus="props.interactive && hoverRating(i)"
        >
            <FoundationIcon 
                :name="displayedScore >= i ? 'star-filled' : 'star'" 
                :class="props.color || 'text-yellow-400'" 
                :size="props.size || 'md'"
            />
        </div>
    </div>
</template>
