<template>
    <div 
        v-for="i in repeat"
        :key="i"
        :class="[
            'skeleton-container',
            'skeleton-' + preset,
            {
                'skeleton-pulse': animation === 'pulse',
                'skeleton-wave': animation === 'wave',
                'skeleton-circle': circle,
                'skeleton-rounded': rounded && !circle,
                'skeleton-inline': inline
            }
        ]"  
        :style="skeletonStyles" 
        :aria-hidden="true"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
export interface SkeletonProps {
    /**
     * Predefined layouts for common UI elements
     */
    preset?: 'text' | 'card' | 'button' | 'image' | 'heading' | 'line' | 'avatar' | 'custom';
    /**
     * Width of the skeleton (CSS value)
     */
    width?: string | number;
    /**
     * Height of the skeleton (CSS value)
     */
    height?: string | number;
    /**
     * Animation type
     */
    animation?: 'pulse' | 'wave' | 'none';
    /**
     * Rounded corners
     */
    rounded?: boolean;
    /**
     * Circle shape (overrides rounded)
     */
    circle?: boolean;
    /**
     * Display as inline element
     */
    inline?: boolean;
    /**
     * Repeat skeleton multiple times (for lists/paragraphs)
     */
    repeat?: number;
    /**
     * Custom CSS class
     */
    class?: string;
}

const props = withDefaults(defineProps<SkeletonProps>(), {
    preset: 'custom',
    width: '',
    height: '',
    animation: 'pulse',
    rounded: true,
    circle: false,
    inline: false,
    repeat: 1,
    class: '',
});

// Compute styles based on props
const skeletonStyles = computed(() => {
    const styles: Record<string, string> = {};

    // Handle width and height if specified
    if (props.width) {
        styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
    }

    if (props.height) {
        styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
    }

    return styles;
});
</script>