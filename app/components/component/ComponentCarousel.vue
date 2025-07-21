<script setup lang="ts">
export interface ComponentCarouselProps {
    readonly items?: CarouselItem[]
    readonly itemsPerSlide?: ResponsiveConfig
    readonly gap?: number
    readonly showNavigation?: 'inside' | 'outside' | '' | false
    readonly showIndicators?: 'inside' | 'outside' | '' | false
    readonly autoPlay?: boolean
    readonly autoPlayInterval?: number
    readonly loop?: boolean
    readonly transitionDuration?: number
    readonly height?: string | number
    readonly aspectRatio?: string
    readonly loading?: boolean
    readonly skeletonItems?: number
    readonly preserveAspectRatio?: boolean
    readonly enableTouch?: boolean
    readonly navigationLabels?: {
        readonly previous?: string
        readonly next?: string
    }
    readonly class?: string
    readonly initialSlide?: number
    readonly reserveSpace?: boolean
    readonly showScrollbar?: boolean
}

interface NavigationLabels {
    readonly previous: string
    readonly next: string
}

interface SlideData {
    readonly items: CarouselItem[]
    readonly index: number
}

interface SkeletonSlideData {
    readonly items: { readonly index: number }[]
    readonly index: number
}

const props = withDefaults(defineProps<ComponentCarouselProps>(), {
    items: () => [],
    itemsPerSlide: () => ({ default: 1, md: 2, lg: 3 }),
    gap: 16,
    showNavigation: 'inside',
    showIndicators: 'inside',
    autoPlay: false,
    autoPlayInterval: 3000,
    loop: true,
    transitionDuration: 300,
    height: '',
    aspectRatio: '',
    loading: false,
    skeletonItems: 3,
    preserveAspectRatio: true,
    enableTouch: true,
    navigationLabels: () => ({}),
    class: '',
    initialSlide: 0,
    reserveSpace: false,
    showScrollbar: false
})

// Define emits for slide changes
const emit = defineEmits<{
    'slide-change': [currentSlide: number]
    'change-slide': [index: number]
}>()

// Initialize carousel composable with optimized configuration
const carousel = useCarousel({
    itemsPerSlide: props.itemsPerSlide,
    gap: props.gap,
    autoPlay: props.autoPlay,
    autoPlayInterval: props.autoPlayInterval,
    loop: props.loop,
    transitionDuration: props.transitionDuration,
    containerHeight: props.height,
    aspectRatio: props.aspectRatio,
    reserveSpace: props.reserveSpace,
    skeletonItems: props.skeletonItems,
    enableTouch: props.enableTouch
})

// Destructure carousel for template usage
const {
    currentSlide,
    canGoNext,
    canGoPrevious,
    isPlaying,
    isLoading,
    currentItemsPerSlide,
    visibleSlides,
    next,
    previous,
    goToSlide,
    play,
    pause,
    setItems,
    setSlideElements,
    containerRef,
    itemsRef,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    containerStyle
} = carousel

const { t } = useI18n()

// Computed properties for navigation and indicators
const navigationConfig = computed(() => {
    if (props.showNavigation === false || props.showNavigation === '' || !props.showNavigation) return { show: false }
    if (props.showNavigation === 'inside') return { show: true, position: 'inside' }
    if (props.showNavigation === 'outside') return { show: true, position: 'outside' }
    return { show: false }
})

const indicatorConfig = computed(() => {
    if (props.showIndicators === false || props.showIndicators === '' || !props.showIndicators) return { show: false }
    if (props.showIndicators === 'inside') return { show: true, position: 'inside' }
    if (props.showIndicators === 'outside') return { show: true, position: 'outside' }
    return { show: false }
})

// Computed classes for navigation positioning
const navigationClasses = computed(() => {
    const isOutside = navigationConfig.value.position === 'outside'
    return {
        prev: isOutside 
            ? 'carousel-nav carousel-nav-prev absolute left-1 top-1/2 transform -translate-y-1/2 z-10'
            : 'carousel-nav carousel-nav-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10',
        next: isOutside 
            ? 'carousel-nav carousel-nav-next absolute right-1 top-1/2 transform -translate-y-1/2 z-10'
            : 'carousel-nav carousel-nav-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10'
    }
})

// Computed classes for indicator positioning
const indicatorClasses = computed(() => {
    const isOutside = indicatorConfig.value.position === 'outside'
    return {
        container: isOutside 
            ? 'flex justify-center'
            : 'carousel-indicators absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10',
        inner: isOutside 
            ? 'carousel-indicators flex justify-center mt-4'
            : '',
        buttonWrapper: 'flex gap-2'
    }
})

// Computed classes for container positioning
const containerClasses = computed(() => {
    const hasOutsideNav = navigationConfig.value.show && navigationConfig.value.position === 'outside' && props.items && props.items.length > (currentItemsPerSlide.value || 1)
    const hasOutsideIndicators = indicatorConfig.value.show && indicatorConfig.value.position === 'outside' && visibleSlides.value > 1
    
    return [
        'carousel-container',
        'relative',
        'overflow-hidden',
        {
            'px-12': hasOutsideNav,
            'pb-12': hasOutsideIndicators
        }
    ]
})

const carouselStyles = computed(() => ({
    ...containerStyle.value,
    ...(props.height && { 
        height: typeof props.height === 'number' ? `${props.height}px` : props.height 
    }),
    ...(props.aspectRatio && { aspectRatio: props.aspectRatio })
}))

const createSlides = (items: CarouselItem[], itemsPerSlide: number): SlideData[] => {
    const slides: SlideData[] = []
    
    for (let i = 0; i < items.length; i += itemsPerSlide) {
        slides.push({
            items: items.slice(i, i + itemsPerSlide),
            index: Math.floor(i / itemsPerSlide)
        })
    }
    
    return slides
}

const createSkeletonSlides = (
    totalItems: number, 
    itemsPerSlide: number
): SkeletonSlideData[] => {
    const slides: SkeletonSlideData[] = []
    
    for (let i = 0; i < totalItems; i += itemsPerSlide) {
        const itemsInSlide = Math.min(itemsPerSlide, totalItems - i)
        slides.push({
            items: Array.from({ length: itemsInSlide }, (_, idx) => ({ index: i + idx })),
            index: Math.floor(i / itemsPerSlide)
        })
    }
    
    return slides
}

const slidesData = computed((): SlideData[] => {
    if (!props.items?.length) return []
    return createSlides(props.items, currentItemsPerSlide.value)
})

const skeletonSlides = computed((): SkeletonSlideData[] => 
    createSkeletonSlides(props.skeletonItems, currentItemsPerSlide.value)
)

const itemStyle = computed(() => {
    const itemsCount = currentItemsPerSlide.value
    const itemWidth = `calc(100% / ${itemsCount})`
    const itemPadding = props.gap / 2
    
    return {
        flex: `0 0 ${itemWidth}`,
        width: itemWidth,
        paddingLeft: `${itemPadding}px`,
        paddingRight: `${itemPadding}px`,
        boxSizing: 'border-box'
    } as const
})

const navigationLabels = computed((): NavigationLabels => ({
    previous: props.navigationLabels?.previous ?? t('carousel.previous'),
    next: props.navigationLabels?.next ?? t('carousel.next')
}))

// Slide element management
const slideRefs = ref<HTMLElement[]>([])

const setSlideRef = (el: HTMLElement | null, index: number): void => {
    if (el) {
        slideRefs.value[index] = el
    }
}

const updateSlideElements = (): void => {
    slideRefs.value = []
    setTimeout(() => {
        setSlideElements(slideRefs.value.filter(Boolean))
    }, 0)
}

// Watchers
watch([slidesData, skeletonSlides], updateSlideElements, { 
    flush: 'post', 
    immediate: true 
})

// Watchers for props changes
watch(() => props.items, (newItems) => {
    setItems(newItems ?? [])
}, { immediate: true })

watch(() => props.loading, (newLoading) => {
    if (!newLoading && props.items?.length) {
        setItems(props.items)
    }
})

// Watch for slide changes and emit events
watch(currentSlide, (newSlide) => {
    emit('slide-change', newSlide)
    emit('change-slide', newSlide)
})

// Event handlers
const handleMouseEnter = (): void => {
    if (props.autoPlay) pause()
}

const handleMouseLeave = (): void => {
    if (props.autoPlay && props.items?.length) play()
}

const handleKeyDown = (event: KeyboardEvent): void => {
    const keyActions: Record<string, () => void> = {
        ArrowLeft: previous,
        ArrowRight: next,
        Home: () => goToSlide(0),
        End: () => goToSlide(visibleSlides.value - 1)
    }

    const action = keyActions[event.key]
    if (action) {
        event.preventDefault()
        action()
    }
}

// Expose methods for parent components
defineExpose({
    goToSlide,
    next,
    previous
})
</script>

<template>
    <div 
        :class="containerClasses"
        :style="carouselStyles"
        tabindex="0"
        role="region"
        :aria-label="$t('carousel.label')"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @keydown="handleKeyDown"
    >
        <!-- ClientOnly wrapper to prevent hydration mismatches -->
        <ClientOnly>
        <!-- Main carousel content -->
        <div
            ref="containerRef"
            :class="[
                'carousel-track h-full relative overflow-x-auto scroll-smooth',
                { 'show-scrollbar': props.showScrollbar }
            ]"
            role="tabpanel"
            :aria-live="isPlaying ? 'off' : 'polite'"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseLeave"
        >
            <!-- Loading skeleton -->
            <div 
                v-if="loading || isLoading"
                :class="['carousel-slides', 'flex']"
            >
                <div
                    v-for="(slide, slideIndex) in skeletonSlides"
                    :key="`skeleton-slide-${slideIndex}`"
                    :ref="(el) => setSlideRef(el as HTMLElement, slideIndex)"
                    :class="['carousel-slide', 'flex-shrink-0', 'flex', 'w-full']"
                >
                    <div 
                        v-for="item in slide.items"
                        :key="`skeleton-${item.index}`"
                        :style="itemStyle"
                        class="carousel-item-skeleton"
                    >
                        <ComponentSkeleton 
                            preset="card" 
                            :height="height || '200px'"
                            :aspect-ratio="aspectRatio"
                        />
                    </div>
                </div>
            </div>

            <!-- Actual carousel items -->
            <div 
                v-else-if="items && items.length > 0"
                :class="['carousel-slides', 'flex', 'flex-row']"
                role="group"
                :aria-label="$t('carousel.items', { current: currentSlide + 1, total: visibleSlides })"
            >
                <div
                    v-for="slide in slidesData"
                    :key="`slide-${slide.index}`"
                    :ref="(el) => setSlideRef(el as HTMLElement, slide.index)"
                    :class="['carousel-slide', 'flex-shrink-0', 'flex', 'w-full']"
                    role="tabpanel"
                    :aria-label="$t('carousel.slide', { index: slide.index + 1 })"
                >
                    <div
                        v-for="(item, itemIndex) in slide.items"
                        :key="`${slide.index}-${itemIndex}`"
                        :ref="(el) => itemsRef[slide.index * currentItemsPerSlide + itemIndex] = el as HTMLElement"
                        :style="itemStyle"
                        class="carousel-item"
                        role="tabpanel"
                        :aria-label="$t('carousel.item', { index: slide.index * currentItemsPerSlide + itemIndex + 1 })"
                    >
                        <div class="carousel-item-content w-full h-full">
                            <slot name="default" :item="item" :index="slide.index * currentItemsPerSlide + itemIndex">
                                <!-- Default slot content if no custom template provided -->
                                <div class="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                    <span class="text-gray-500">{{ $t('carousel.noTemplate') }}</span>
                                </div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div 
                v-else
                class="carousel-empty flex items-center justify-center h-full"
            >
                <slot name="empty">
                    <div class="text-center text-gray-500">
                        <p>{{ $t('carousel.empty') }}</p>
                    </div>
                </slot>
            </div>
        </div>

        <!-- Navigation buttons -->
        <template v-if="navigationConfig.show && items && visibleSlides > 1">
            <!-- Previous button -->
            <FoundationButton
                v-if="canGoPrevious || props.loop"
                :class="navigationClasses.prev"
                size="small"
                color="secondary"
                square
                :aria-label="navigationLabels.previous"
                :disabled="!canGoPrevious && !props.loop"
                @click="previous"
            >
                <FoundationIcon 
                    name="chevron-left" 
                    class="w-4 h-4 text-neutral" 
                    aria-hidden="true" 
                />
            </FoundationButton>

            <!-- Next button -->
            <FoundationButton
                v-if="canGoNext || props.loop"
                :class="navigationClasses.next"
                size="small"
                color="secondary"
                square
                :aria-label="navigationLabels.next"
                :disabled="!canGoNext && !props.loop"
                @click="next"
            >
                <FoundationIcon 
                    name="chevron-right" 
                    class="w-4 h-4 text-neutral" 
                    aria-hidden="true" 
                />
            </FoundationButton>
        </template>

        <!-- Indicators -->
        <div 
            v-if="indicatorConfig.show && visibleSlides > 1"
            :class="indicatorClasses.container"
            role="tablist"
            :aria-label="$t('carousel.indicatorsLabel')"
        >
            <div :class="indicatorClasses.inner">
                <div :class="indicatorClasses.buttonWrapper">
                    <button
                        v-for="slideIndex in visibleSlides"
                        :key="slideIndex - 1"
                        class="carousel-indicator w-2 h-2 rounded-full transition-colors duration-200"
                        :class="{
                            'bg-primary': currentSlide === slideIndex - 1,
                            'bg-gray-300 hover:bg-gray-400': currentSlide !== slideIndex - 1
                        }"
                        role="tab"
                        :aria-selected="currentSlide === slideIndex - 1"
                        :aria-label="$t('carousel.goToSlide', { slide: slideIndex })"
                        @click="goToSlide(slideIndex - 1)"
                    />
                </div>
            </div>
        </div>

        <!-- Screen reader announcements -->
        <div 
            class="sr-only" 
            aria-live="polite" 
            aria-atomic="true"
        >
            {{ $t('carousel.currentSlide', { current: currentSlide + 1, total: visibleSlides }) }}
        </div>
        
        <!-- Fallback content for SSR -->
        <template #fallback>
            <div class="h-full flex items-center justify-center">
                <div class="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                <span class="sr-only text-sm">{{ $t('carousel.loading') }}</span>
            </div>
        </template>
        </ClientOnly>
    </div>
</template>