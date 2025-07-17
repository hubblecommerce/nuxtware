// Core types
export interface ResponsiveConfig {
    readonly default: number
    readonly sm?: number
    readonly md?: number
    readonly lg?: number
    readonly xl?: number
    readonly '2xl'?: number
}

export interface CarouselItem {
    readonly id?: string | number
    readonly [key: string]: unknown
}

export interface CarouselOptions {
    readonly itemsPerSlide?: ResponsiveConfig
    readonly gap?: number
    readonly autoPlay?: boolean
    readonly autoPlayInterval?: number
    readonly loop?: boolean
    readonly transitionDuration?: number
    readonly containerHeight?: string | number
    readonly aspectRatio?: string
    readonly reserveSpace?: boolean
    readonly skeletonItems?: number
    readonly enableTouch?: boolean
    readonly swipeThreshold?: number
}

// Internal state interfaces
interface TouchState {
    isDragging: boolean
    startX: number
    startY: number
    currentX: number
    currentY: number
    initialOffset: number
}

// Return type interface
export interface UseCarouselReturn {
    // State (readonly)
    readonly currentSlide: Readonly<Ref<number>>
    readonly totalSlides: Readonly<Ref<number>>
    readonly canGoNext: ComputedRef<boolean>
    readonly canGoPrevious: ComputedRef<boolean>
    readonly isPlaying: Readonly<Ref<boolean>>
    readonly isLoading: Readonly<Ref<boolean>>
    readonly currentItemsPerSlide: Readonly<Ref<number>>
    readonly visibleSlides: ComputedRef<number>
    
    // Methods
    readonly next: () => void
    readonly previous: () => void
    readonly goToSlide: (index: number) => void
    readonly play: () => void
    readonly pause: () => void
    readonly setItems: (items: CarouselItem[]) => void
    readonly setSlideElements: (elements: HTMLElement[]) => void
    
    // Refs
    readonly containerRef: Ref<HTMLElement | null>
    readonly itemsRef: Ref<HTMLElement[]>
    readonly slideElements: Ref<HTMLElement[]>
    
    // Event handlers
    readonly onTouchStart: (event: TouchEvent) => void
    readonly onTouchMove: (event: TouchEvent) => void
    readonly onTouchEnd: () => void
    readonly onMouseDown: (event: MouseEvent) => void
    readonly onMouseMove: () => void
    readonly onMouseUp: () => void
    readonly onMouseLeave: () => void
    
    // Computed
    readonly containerStyle: ComputedRef<Record<string, string>>
    readonly skeletonArray: ComputedRef<readonly number[]>
}

// Constants
const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
} as const

const DEFAULT_OPTIONS: Required<CarouselOptions> = {
    itemsPerSlide: { default: 1, md: 2, lg: 3 },
    gap: 16,
    autoPlay: false,
    autoPlayInterval: 3000,
    loop: true,
    transitionDuration: 300,
    containerHeight: '',
    aspectRatio: '',
    reserveSpace: true,
    skeletonItems: 3,
    enableTouch: true,
    swipeThreshold: 50
}

// Utility functions
const calculateResponsiveItems = (
    config: ResponsiveConfig, 
    width?: number
): number => {
    if (!import.meta.client || !width) {
        // SSR fallback: use default (mobile-first) to prevent hydration mismatch
        return config.default
    }

    const sortedBreakpoints = Object.entries(BREAKPOINTS)
        .sort(([, a], [, b]) => b - a)

    for (const [key, breakpointWidth] of sortedBreakpoints) {
        if (width >= breakpointWidth && config[key as keyof ResponsiveConfig]) {
            return config[key as keyof ResponsiveConfig]!
        }
    }

    return config.default
}

const createContainerStyle = (
    height?: string | number,
    aspectRatio?: string
): Record<string, string> => {
    const styles: Record<string, string> = {}

    if (height) {
        styles.height = typeof height === 'number' ? `${height}px` : height
    }

    if (aspectRatio) {
        styles.aspectRatio = aspectRatio
    }

    return styles
}

/**
 * Carousel composable providing scroll-snap based carousel functionality
 * with improved performance and type safety
 */
export function useCarousel(options: CarouselOptions = {}): UseCarouselReturn {
    const config = { ...DEFAULT_OPTIONS, ...options }

    // Core reactive state  
    const currentSlide = ref(0)
    const totalSlides = ref(0)
    const isPlaying = ref(false)
    const isLoading = ref(config.reserveSpace)
    const items = ref<CarouselItem[]>([])
    
    // Initialize with responsive calculation since we're using ClientOnly
    const currentItemsPerSlide = ref(calculateResponsiveItems(config.itemsPerSlide, import.meta.client ? window.innerWidth : undefined))

    // DOM references
    const containerRef = ref<HTMLElement | null>(null)
    const itemsRef = ref<HTMLElement[]>([])
    const slideElements = ref<HTMLElement[]>([])

    // Internal state
    const touchState = reactive<TouchState>({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        initialOffset: 0
    })
    

    // Timers and observers
    let autoPlayTimer: ReturnType<typeof setInterval> | null = null
    let intersectionObserver: IntersectionObserver | null = null

    // Computed properties  
    const visibleSlides = computed((): number => {
        if (!items.value.length) return 0
        return Math.ceil(items.value.length / currentItemsPerSlide.value)
    })

    const canGoNext = computed((): boolean => {
        if (config.loop) return items.value.length > 0
        return currentSlide.value < visibleSlides.value - 1
    })

    const canGoPrevious = computed((): boolean => {
        if (config.loop) return items.value.length > 0
        return currentSlide.value > 0
    })

    const containerStyle = computed((): Record<string, string> => 
        createContainerStyle(config.containerHeight, config.aspectRatio)
    )

    const skeletonArray = computed((): readonly number[] => 
        Array.from({ length: config.skeletonItems }, (_, index) => index) as readonly number[]
    )

    // Responsive calculation
    const updateItemsPerSlide = (): void => {
        if (!import.meta.client) return

        const newItemsCount = calculateResponsiveItems(config.itemsPerSlide, window.innerWidth)
        currentItemsPerSlide.value = newItemsCount
        totalSlides.value = Math.ceil(items.value.length / newItemsCount)

        // Adjust current slide if out of bounds
        if (currentSlide.value >= totalSlides.value && totalSlides.value > 0) {
            currentSlide.value = Math.max(0, totalSlides.value - 1)
        }
    }

    // Navigation methods
    const scrollToSlide = (index: number, behavior: ScrollBehavior = 'smooth'): void => {
        if (!containerRef.value || index < 0 || index >= visibleSlides.value) return
        
        const slideWidth = containerRef.value.clientWidth
        const scrollLeft = index * slideWidth
        
        // Use transform method since scroll isn't working properly
        const slidesContainer = containerRef.value.querySelector('.carousel-slides')
        if (slidesContainer) {
            const element = slidesContainer as HTMLElement
            // Add transition for smooth animation
            element.style.transition = behavior === 'smooth' ? 'transform 0.3s ease-in-out' : 'none'
            element.style.transform = `translateX(-${scrollLeft}px)`
        }
    }

    const getNextSlideIndex = (): number => {
        if (config.loop && currentSlide.value >= visibleSlides.value - 1) {
            return 0
        }
        return Math.min(currentSlide.value + 1, visibleSlides.value - 1)
    }

    const getPreviousSlideIndex = (): number => {
        if (config.loop && currentSlide.value <= 0) {
            return visibleSlides.value - 1
        }
        return Math.max(currentSlide.value - 1, 0)
    }

    const next = (): void => {
        const nextSlide = getNextSlideIndex()
        currentSlide.value = nextSlide
        scrollToSlide(nextSlide)
    }

    const previous = (): void => {
        const prevSlide = getPreviousSlideIndex()
        currentSlide.value = prevSlide
        scrollToSlide(prevSlide)
    }

    const goToSlide = (index: number): void => {
        if (index < 0 || index >= visibleSlides.value) return
        currentSlide.value = index
        scrollToSlide(index)
    }

    // Auto-play methods
    const play = (): void => {
        if (isPlaying.value || !config.autoPlay || !items.value.length || !import.meta.client) return

        isPlaying.value = true
        autoPlayTimer = setInterval(next, config.autoPlayInterval)
    }

    const pause = (): void => {
        if (!isPlaying.value) return

        isPlaying.value = false
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer)
            autoPlayTimer = null
        }
    }

    // Scroll tracking
    const handleScroll = (): void => {
        if (!containerRef.value) return
        
        const { scrollLeft, clientWidth } = containerRef.value
        const newSlideIndex = Math.round(scrollLeft / clientWidth)
        
        if (newSlideIndex !== currentSlide.value && 
            newSlideIndex >= 0 && 
            newSlideIndex < visibleSlides.value) {
            currentSlide.value = newSlideIndex
        }
    }

    const _findMostVisibleSlide = (entries: IntersectionObserverEntry[]): number => {
        let mostVisibleSlide = -1
        let highestRatio = 0
        
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const slideIndex = slideElements.value.indexOf(entry.target as HTMLElement)
                if (slideIndex !== -1 && entry.intersectionRatio > highestRatio) {
                    highestRatio = entry.intersectionRatio
                    mostVisibleSlide = slideIndex
                }
            }
        }
        
        return mostVisibleSlide
    }

    const cleanupObserver = (): void => {
        if (intersectionObserver) {
            intersectionObserver.disconnect()
            intersectionObserver = null
        }
        
        if (containerRef.value) {
            containerRef.value.removeEventListener('scroll', handleScroll)
        }
    }

    const setupIntersectionObserver = (): void => {
        if (!import.meta.client || !containerRef.value) return

        cleanupObserver()

        // Skip intersection observer since we're using transform-based navigation
        // The carousel state is managed programmatically via goToSlide()
        return
    }

    // Items management
    const setItems = (newItems: CarouselItem[]): void => {
        items.value = newItems
        isLoading.value = false
        
        // Update responsive layout and setup observer after DOM updates
        nextTick(() => {
            updateItemsPerSlide()
            setupIntersectionObserver()
            
            // Auto-play if enabled and items exist (client-side only)
            if (config.autoPlay && newItems.length > 0 && import.meta.client) {
                play()
            }
        })
    }

    const setSlideElements = (elements: HTMLElement[]): void => {
        slideElements.value = elements
        nextTick(setupIntersectionObserver)
    }

    // Touch event handlers (optimized for scroll-based approach)
    const resumeAutoPlayDelayed = (): void => {
        if (config.autoPlay && items.value.length > 0 && import.meta.client) {
            setTimeout(play, 100) // Allow scroll to settle
        }
    }

    const onTouchStart = (event: TouchEvent): void => {
        if (!config.enableTouch) return
        
        const touch = event.touches[0]
        if (!touch) return
        
        touchState.startX = touch.clientX
        touchState.startY = touch.clientY
        touchState.isDragging = true
        
        pause()
    }

    const onTouchMove = (event: TouchEvent): void => {
        if (!config.enableTouch || !touchState.isDragging) return
        
        const touch = event.touches[0]
        if (!touch) return
        
        const deltaX = Math.abs(touch.clientX - touchState.startX)
        const deltaY = Math.abs(touch.clientY - touchState.startY)
        
        // Prevent vertical scrolling for horizontal gestures
        if (deltaX > deltaY && deltaX > 10) {
            event.preventDefault()
        }
    }

    const onTouchEnd = (): void => {
        if (!config.enableTouch) return
        
        touchState.isDragging = false
        resumeAutoPlayDelayed()
    }

    // Mouse event handlers (simplified for scroll-based approach)
    const onMouseDown = (): void => {
        if (config.enableTouch) pause()
    }

    const onMouseMove = (): void => {
        // No action needed for scroll-based approach
    }

    const onMouseUp = (): void => {
        if (config.enableTouch) resumeAutoPlayDelayed()
    }

    const onMouseLeave = (): void => {
        if (config.enableTouch) resumeAutoPlayDelayed()
    }

    // Lifecycle management
    const initializeCarousel = (): void => {
        if (!import.meta.client) return
        
        updateItemsPerSlide()
        nextTick(setupIntersectionObserver)
        window.addEventListener('resize', updateItemsPerSlide)
    }

    const cleanupCarousel = (): void => {
        pause()
        cleanupObserver()
        
        if (import.meta.client) {
            window.removeEventListener('resize', updateItemsPerSlide)
        }
    }


    // Lifecycle hooks
    onBeforeMount(() => {
        if (import.meta.client) {
            updateItemsPerSlide()
        }
    })
    
    onMounted(initializeCarousel)
    onBeforeUnmount(cleanupCarousel)

    // Watchers
    watch(currentItemsPerSlide, () => {
        totalSlides.value = Math.ceil(items.value.length / currentItemsPerSlide.value)
        nextTick(setupIntersectionObserver)
    })

    // Return API
    return {
        // State (readonly)
        currentSlide: readonly(currentSlide),
        totalSlides: readonly(totalSlides),
        canGoNext,
        canGoPrevious,
        isPlaying: readonly(isPlaying),
        isLoading: readonly(isLoading),
        currentItemsPerSlide: readonly(currentItemsPerSlide),
        visibleSlides,
        
        // Methods
        next,
        previous,
        goToSlide,
        play,
        pause,
        setItems,
        setSlideElements,
        
        // Refs
        containerRef,
        itemsRef,
        slideElements,
        
        // Event handlers
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
        
        // Computed
        containerStyle,
        skeletonArray
    } as const
}
