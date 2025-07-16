<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import type { CmsElementImageGallery } from '@shopware/composables'

interface ComponentThumbnailCarouselProps {
    readonly items: CmsElementImageGallery['data']['sliderItems']
    readonly selectedIndex: number
    readonly vertical?: boolean
    readonly thumbnailSize?: number
    readonly gap?: number
    readonly showNavigation?: boolean
    readonly position?: 'left' | 'underneath'
    readonly loading?: boolean
    readonly skeletonItems?: number
}

const props = withDefaults(defineProps<ComponentThumbnailCarouselProps>(), {
    vertical: false,
    thumbnailSize: 80,
    gap: 0,
    showNavigation: true,
    position: 'underneath',
    loading: false,
    skeletonItems: 5
})

const emit = defineEmits<{
    'thumbnail-select': [index: number]
}>()

// Refs
const containerRef = ref<HTMLElement>()
const scrollContainerRef = ref<HTMLElement>()

// Number of visible thumbnails based on position
const visibleThumbnailCount = computed(() => {
    if (props.position === 'left') {
        return 5 // Vertical left position shows 5 thumbnails
    } else {
        return 10 // Horizontal underneath position shows 10 thumbnails
    }
})

// Check if navigation arrows are needed
const needsNavigation = computed(() => {
    if (props.loading) return false // Don't show navigation during loading
    return props.showNavigation && props.items.length > visibleThumbnailCount.value
})

// Calculate total number of "pages" (slides of 5 items each)
const totalPages = computed(() => Math.ceil(props.items.length / visibleThumbnailCount.value))
const currentPage = ref(0)

// Navigation functions for page-based navigation
const canScrollPrevious = computed(() => currentPage.value > 0)
const canScrollNext = computed(() => currentPage.value < totalPages.value - 1)

function scrollToPrevious() {
    if (canScrollPrevious.value) {
        currentPage.value = Math.max(0, currentPage.value - 1)
        const newScrollIndex = currentPage.value * visibleThumbnailCount.value
        scrollToIndex(newScrollIndex)
        // Don't emit navigation-change - arrows only navigate thumbnails, don't update gallery
    }
}

function scrollToNext() {
    if (canScrollNext.value) {
        currentPage.value = Math.min(totalPages.value - 1, currentPage.value + 1)
        const newScrollIndex = currentPage.value * visibleThumbnailCount.value
        scrollToIndex(newScrollIndex)
        // Don't emit navigation-change - arrows only navigate thumbnails, don't update gallery
    }
}

function scrollToIndex(index: number) {
    if (!scrollContainerRef.value) return
    
    const itemSize = props.thumbnailSize + props.gap
    const scrollPosition = index * itemSize
    
    if (props.vertical) {
        scrollContainerRef.value.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        })
    } else {
        scrollContainerRef.value.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
    }
}

// Auto-scroll to keep selected thumbnail visible
function ensureSelectedVisible() {
    if (!needsNavigation.value) return
    
    const selectedIndex = props.selectedIndex
    const requiredPage = Math.floor(selectedIndex / visibleThumbnailCount.value)
    
    if (requiredPage !== currentPage.value) {
        currentPage.value = requiredPage
        const newScrollIndex = currentPage.value * visibleThumbnailCount.value
        scrollToIndex(newScrollIndex)
    }
}

// Watch for selected index changes
watch(() => props.selectedIndex, () => {
    nextTick(() => {
        ensureSelectedVisible()
    })
})

// Handle thumbnail click
function handleThumbnailClick(index: number) {
    emit('thumbnail-select', index)
}

// Container classes
const containerClasses = computed(() => ({
    'flex': true,
    'flex-col': props.vertical,
    'flex-row': !props.vertical,
    'relative': needsNavigation.value,
    'flex-shrink-0': true // Don't shrink the container
}))

// Container style to constrain size to show exact number of items
const containerStyle = computed(() => {
    const style: Record<string, string> = {}
    
    // Calculate size to show the correct number of thumbnails
    const itemSize = props.thumbnailSize + props.gap
    const totalSize = itemSize * visibleThumbnailCount.value - props.gap // Remove gap from last item
    
    if (props.vertical) {
        style.height = `${totalSize}px`
        style.overflow = 'hidden'
    } else {
        style.width = `${totalSize}px`
        style.overflow = 'hidden'
    }
    
    return style
})

// Scroll container classes
const scrollContainerClasses = computed(() => ({
    'flex': true,
    'flex-col': props.vertical,
    'flex-row': !props.vertical,
    'overflow-hidden': true,
    'h-full': props.vertical, // Take full height when vertical
    'w-full': !props.vertical // Take full width when horizontal
}))

// Scroll container style with dynamic gap
const scrollContainerStyle = computed(() => ({
    gap: `${props.gap}px`
}))

// Navigation button classes
const navigationClasses = computed(() => ({
    prev: props.vertical
        ? 'carousel-nav carousel-nav-prev absolute top-2 left-1/2 transform -translate-x-1/2 z-10'
        : 'carousel-nav carousel-nav-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10',
    next: props.vertical
        ? 'carousel-nav carousel-nav-next absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10'
        : 'carousel-nav carousel-nav-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10'
}))

// Resize observer to recalculate on container size changes
onMounted(() => {
    if (containerRef.value) {
        const resizeObserver = new ResizeObserver(() => {
            nextTick(() => {
                ensureSelectedVisible()
            })
        })
        resizeObserver.observe(containerRef.value)
        
        onUnmounted(() => {
            resizeObserver.disconnect()
        })
    }
})
</script>

<template>
    <div
        ref="containerRef"
        :class="containerClasses"
        :style="containerStyle"
    >
        <!-- ClientOnly wrapper to prevent hydration mismatches -->
        <ClientOnly>
            <!-- Scroll container -->
            <div
                ref="scrollContainerRef"
                :class="scrollContainerClasses"
                :style="scrollContainerStyle"
                role="group"
                :aria-label="$t('gallery.thumbnails')"
            >
            <!-- Loading skeleton -->
            <template v-if="loading">
                <div
                    v-for="index in skeletonItems"
                    :key="`skeleton-${index}`"
                    class="flex-shrink-0 p-1 border-border rounded"
                    :style="{ 
                        width: `${thumbnailSize}px`, 
                        height: `${thumbnailSize}px` 
                    }"
                >
                    <ComponentSkeleton 
                        preset="card" 
                        height="100%"
                        aspect-ratio="1/1"
                    />
                </div>
            </template>
            
            <!-- Actual thumbnail items -->
            <template v-else>
                <button
                    v-for="(item, index) in items"
                    :key="index"
                    class="flex-shrink-0 p-1 border-border rounded transition duration-150 ease-in-out focus:outline-none focus:border-primary focus:border-2"
                    :class="{
                        'border': index !== selectedIndex,
                        'border-primary border-2': index === selectedIndex
                    }"
                    :style="{ 
                        width: `${thumbnailSize}px`, 
                        height: `${thumbnailSize}px` 
                    }"
                    :aria-label="$t('gallery.selectThumbnail', { index: index + 1 })"
                    :aria-current="index === selectedIndex ? 'true' : 'false'"
                    @click="handleThumbnailClick(index)"
                >
                    <slot name="thumbnail" :item="item" :index="index" :selected="index === selectedIndex">
                        <!-- Default thumbnail content -->
                        <div class="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            <span class="text-gray-500 text-xs">{{ index + 1 }}</span>
                        </div>
                    </slot>
                </button>
            </template>
            </div>

            <!-- Navigation arrows -->
            <template v-if="needsNavigation">
            <!-- Previous button -->
            <FoundationButton
                v-if="canScrollPrevious"
                :class="navigationClasses.prev"
                size="small"
                color="secondary"
                square
                :aria-label="$t('carousel.previous')"
                @click="scrollToPrevious"
            >
                <FoundationIcon 
                    :name="vertical ? 'chevron-up' : 'chevron-left'" 
                    class="w-4 h-4 text-neutral" 
                />
            </FoundationButton>

            <!-- Next button -->
            <FoundationButton
                v-if="canScrollNext"
                :class="navigationClasses.next"
                size="small"
                color="secondary"
                square
                :aria-label="$t('carousel.next')"
                @click="scrollToNext"
            >
                <FoundationIcon 
                    :name="vertical ? 'chevron-down' : 'chevron-right'" 
                    class="w-4 h-4 text-neutral" 
                />
            </FoundationButton>
            </template>

            <!-- Fallback content for SSR -->
            <template #fallback>
                <div class="flex items-center justify-center h-20">
                    <div class="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                    <span class="sr-only text-sm">{{ $t('carousel.loading') }}</span>
                </div>
            </template>
        </ClientOnly>
    </div>
</template>