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
const displayedScore = computed(() => {
    return isHoverActive.value ? hoveredIndex.value : Number(props.modelValue) || 0
});

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

const onMouseOver = (i: number) => props.interactive && hoverRating(i);
const onClick = () => props.interactive && onChangeRating();
const onKeyDown = () => props.interactive && onChangeRating();
const onFocus = async (i: number) => setTimeout(() => props.interactive && hoverRating(i), 50); // Wait until element appears and receives focus
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
            @mouseover="onMouseOver(i)" 
            @click="onClick()" 
            @keydown.enter="onKeyDown()"
            @keydown.space.prevent="onKeyDown()"
            @focus="onFocus(i)"
        >
        <!-- show half filled star if score is float -->
            <div v-if="displayedScore >= i && displayedScore < i+1 && displayedScore % 1 != 0" class="relative">
                <FoundationIcon
                    name="star"
                    :class="props.color || 'text-yellow-400'"
                    :size="props.size || 'md'"
                />
                <FoundationIcon
                    name="star-filled"
                    class="[clip-path:inset(0 47% 0 0)] text-yellow-400 absolute top-0 left-0"
                    :class="getSizeClass(props.size)"
                    style="clip-path: inset(0 50% 0 0)"
                />
            </div>

            <FoundationIcon
                v-else
                :name="displayedScore >= i ? 'star-filled' : 'star'"
                :class="props.color || 'text-yellow-400'"
                :size="props.size || 'md'"
            />
        </div>
    </div>
</template>
