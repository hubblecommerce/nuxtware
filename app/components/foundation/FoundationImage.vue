<template>
    <div 
        :class="[
            containerClasses,
            aspectRatioClass,
            'relative overflow-hidden'
        ]"
    >
        <!-- Loading spinner (not shown for preloaded images) -->
        <div 
            v-if="shouldShowLoading" 
            class="absolute inset-0 flex items-center justify-center bg-muted/50 z-10"
            :aria-label="$t('image.loading')"
        >
            <FoundationIcon name="loading" class="animate-spin" />
        </div>
        
        <!-- Error state -->
        <div 
            v-else-if="hasError" 
            class="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground p-4 text-center z-10"
        >
            <FoundationIcon name="image" size="lg" class="mb-2" />
            <span class="text-sm">{{ errorText || $t('image.error') }}</span>
        </div>
        
        <!-- NuxtImg fills the aspect ratio container -->
        <NuxtImg
            v-bind="$attrs"
            class="w-full h-full object-cover"
            @load="handleLoad"
            @error="handleError"
        />
    </div>
</template>

<script setup lang="ts">
interface FoundationImageProps {
    containerClasses?: string | string[]
    aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'wide' | 'ultra-wide' | string
    errorText?: string
    showLoadingSpinner?: boolean
    preload?: boolean
}

const props = withDefaults(defineProps<FoundationImageProps>(), {
    containerClasses: undefined,
    aspectRatio: undefined,
    errorText: undefined,
    showLoadingSpinner: true,
    preload: false
})

// State management
const isLoading = ref(true)
const hasError = ref(false)

// Don't show loading spinner for preloaded images
const shouldShowLoading = computed(() => 
    props.showLoadingSpinner && isLoading.value && !props.preload
)

// Aspect ratio classes
const aspectRatioClass = computed(() => {
    if (!props.aspectRatio) return ''
    
    const ratios: Record<string, string> = {
        square: 'aspect-square',
        video: 'aspect-video',        // 16:9
        portrait: 'aspect-[3/4]',     // 3:4
        landscape: 'aspect-[4/3]',    // 4:3
        wide: 'aspect-[16/9]',        // 16:9 (same as video)
        'ultra-wide': 'aspect-[21/9]' // 21:9
    }
    
    return ratios[props.aspectRatio] || props.aspectRatio
})

const handleLoad = () => {
    isLoading.value = false
    hasError.value = false
}

const handleError = () => {
    isLoading.value = false
    hasError.value = true
}
</script>