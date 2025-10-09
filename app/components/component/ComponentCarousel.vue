<script setup lang="ts">
export interface CarouselSlide {
    id?: string | number
    title?: string
    description?: string
    image?: string
    alt?: string
    width?: number
    height?: number
    [key: string]: unknown
}

export interface CarouselResponsiveConfig {
    slidesPerView: number
    slidesToScroll?: number
}

export interface CarouselBreakpoints {
    default: CarouselResponsiveConfig
    sm?: CarouselResponsiveConfig
    md?: CarouselResponsiveConfig
    lg?: CarouselResponsiveConfig
    xl?: CarouselResponsiveConfig
    '2xl'?: CarouselResponsiveConfig
}

export interface ComponentCarouselNewProps {
    slides: CarouselSlide[]
    label: string
    autoplayInterval?: number
    enableAutoplay?: boolean
    enableInfiniteScroll?: boolean
    respectReducedMotion?: boolean
    carouselWidth?: string
    gap?: number
    enableDots?: boolean
    dotsContainerClass?: string
    enableArrows?: boolean
    leftArrowClass?: string
    rightArrowClass?: string
    breakpoints?: CarouselBreakpoints
}

const props = withDefaults(defineProps<ComponentCarouselNewProps>(), {
    autoplayInterval: 2500,
    enableAutoplay: true,
    enableInfiniteScroll: true,
    respectReducedMotion: true,
    carouselWidth: '991px',
    gap: 20,
    enableDots: true,
    dotsContainerClass: 'carousel__navdots absolute bottom-0 left-0 right-0 flex justify-center gap-4',
    enableArrows: false,
    leftArrowClass: 'absolute left-2 top-1/2 -translate-y-1/2 z-10',
    rightArrowClass: 'absolute right-2 top-1/2 -translate-y-1/2 z-10',
    breakpoints: () => ({ default: { slidesPerView: 1, slidesToScroll: 1 } })
})

const emit = defineEmits<{
    slideChange: [index: number]
}>()

// Template refs
const carouselContainer = ref<HTMLElement>()
const slideWrapper = ref<HTMLElement>()

// Reactive state
const currentSlideIndex = ref(0)
const enableSmoothScroll = ref(false)
const isAutoPlaying = ref(false)

// Computed
const ariaLive = computed(() => isAutoPlaying.value ? 'off' : 'polite')
const slides = computed(() => props.slides)

// Responsive configuration
const currentBreakpoint = ref('default')
const currentConfig = computed(() => {
    const config = props.breakpoints[currentBreakpoint.value as keyof CarouselBreakpoints]
    return config || props.breakpoints.default
})

// CSS variables for responsive slides
const carouselCSSVars = computed(() => {
    const vars: Record<string, string> = {}
    const currentSlides = currentConfig.value.slidesPerView
    
    // Set the base variables
    vars['--slides-per-view'] = currentSlides.toString()
    vars['--gap'] = `${props.gap}px`
    
    // Generate CSS variables for each defined breakpoint
    Object.entries(props.breakpoints).forEach(([breakpoint, config]) => {
        if (breakpoint !== 'default') {
            vars[`--slides-per-view-${breakpoint}`] = config.slidesPerView.toString()
        }
    })
    
    // For missing breakpoints at current size, use the current config value
    const allBreakpoints = ['sm', 'md', 'lg', 'xl', '2xl'] as const
    allBreakpoints.forEach(breakpoint => {
        if (!props.breakpoints[breakpoint]) {
            vars[`--slides-per-view-${breakpoint}`] = currentSlides.toString()
        }
    })
    
    return vars
})

// Pages calculation for dots
const totalPages = computed(() => {
    const slidesToScroll = currentConfig.value.slidesToScroll || Math.floor(currentConfig.value.slidesPerView)
    return Math.ceil(nSlides / slidesToScroll)
})

const currentPage = computed(() => {
    const slidesToScroll = currentConfig.value.slidesToScroll || Math.floor(currentConfig.value.slidesPerView)
    const currentIndex = currentSlideIndex.value

    // If we're showing the last possible slides, we're on the last page
    const lastPageStartIndex = Math.max(0, nSlides - slidesToScroll)
    if (currentIndex >= lastPageStartIndex && totalPages.value > 1) {
        return totalPages.value - 1
    }

    return Math.floor(currentIndex / slidesToScroll)
})

// Arrow state
const canGoPrevious = computed(() => {
    if (props.enableInfiniteScroll) return true
    return currentPage.value > 0
})

const canGoNext = computed(() => {
    if (props.enableInfiniteScroll) return true
    return currentPage.value < totalPages.value - 1
})

// Variables for carousel logic
const nSlides = props.slides.length
let slideWidth = 0
let spaceBetweenSlides = 0

// Timers and observers
let autoplayTimer: NodeJS.Timeout | null = null
let resizeTimer: NodeJS.Timeout | null = null
let intersectionObserver: IntersectionObserver | null = null

// Helper functions (direct translation from original JS)
const getCurrentSlideIndex = (): number => {
    if (!slideWrapper.value) return 0
    return Math.round(slideWrapper.value.scrollLeft / (slideWidth + spaceBetweenSlides))
}

const goTo = (index: number) => {
    if (!slideWrapper.value) return

    // Temporarily disable scroll snap during programmatic scrolling
    slideWrapper.value.style.scrollSnapType = 'none'
    slideWrapper.value.scrollTo((slideWidth + spaceBetweenSlides) * index, 0)

    // Re-enable scroll snap after a short delay
    setTimeout(() => {
        if (slideWrapper.value) {
            slideWrapper.value.style.scrollSnapType = 'x mandatory'
        }
    }, 100)
}

const goToPage = (pageIndex: number) => {
    const slidesToScroll = currentConfig.value.slidesToScroll || Math.floor(currentConfig.value.slidesPerView)
    const slideIndex = pageIndex * slidesToScroll

    // For the last page, ensure we show the remaining slides properly
    if (pageIndex === totalPages.value - 1) {
        // Position so the last slides fill the viewport
        const lastPageStartIndex = Math.max(0, nSlides - slidesToScroll)
        goTo(lastPageStartIndex)
    } else {
        goTo(slideIndex)
    }
}

const markNavdot = (index: number) => {
    // Update reactive state
    currentSlideIndex.value = index
    // Emit to parent
    emit('slideChange', index)
}

const updateNavdot = () => {
    const c = getCurrentSlideIndex()
    if (c < 0 || c >= nSlides) return
    markNavdot(c)
}

// Detect current breakpoint based on window width (mobile-first)
const updateBreakpoint = () => {
    if (typeof window === 'undefined') return
    
    const width = window.innerWidth
    let selectedBreakpoint = 'default'
    
    // Mobile-first approach: find the largest available breakpoint that applies
    const breakpointOrder = ['default', 'sm', 'md', 'lg', 'xl', '2xl'] as const
    const breakpointWidths = [0, 640, 768, 1024, 1280, 1536]
    
    // Find the highest breakpoint that applies and exists in config
    for (let i = breakpointOrder.length - 1; i >= 0; i--) {
        const breakpoint = breakpointOrder[i]
        const minWidth = breakpointWidths[i] ?? 0
        
        if (breakpoint && width >= minWidth && props.breakpoints[breakpoint as keyof CarouselBreakpoints]) {
            selectedBreakpoint = breakpoint
            break
        }
    }
    
    currentBreakpoint.value = selectedBreakpoint
}

const next = () => {
    const slidesToScroll = currentConfig.value.slidesToScroll || Math.floor(currentConfig.value.slidesPerView)
    const slidesPerView = currentConfig.value.slidesPerView
    const currentIndex = currentSlideIndex.value
    const nextIndex = currentIndex + Math.floor(slidesToScroll)

    if (props.enableInfiniteScroll && nextIndex >= nSlides) {
        // Jump to first slide
        goTo(0)
    } else if (nextIndex < nSlides) {
        // Calculate the maximum starting index where we can still show the required slidesPerView
        // For floating slidesPerView, we need at least Math.floor(slidesPerView) slides remaining
        const maxStartIndex = Math.max(0, nSlides - Math.floor(slidesPerView))
        goTo(Math.min(nextIndex, maxStartIndex))
    }
}

const previous = () => {
    const slidesToScroll = currentConfig.value.slidesToScroll || Math.floor(currentConfig.value.slidesPerView)
    const currentIndex = currentSlideIndex.value
    const prevIndex = Math.max(0, currentIndex - Math.floor(slidesToScroll))

    if (props.enableInfiniteScroll && currentIndex === 0) {
        // Jump to last valid position
        const slidesPerView = Math.floor(currentConfig.value.slidesPerView)
        const lastIndex = Math.max(0, nSlides - slidesPerView)
        goTo(lastIndex)
    } else {
        goTo(prevIndex)
    }
}

const play = () => {
    if (!props.enableAutoplay) return
    
    // Early return if user prefers reduced motion
    if (props.respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
    }
    
    if (autoplayTimer) {
        clearInterval(autoplayTimer)
    }
    
    if (slideWrapper.value) {
        slideWrapper.value.setAttribute('aria-live', 'off')
    }
    
    isAutoPlaying.value = true
    autoplayTimer = setInterval(next, props.autoplayInterval)
}

const stop = () => {
    if (autoplayTimer) {
        clearInterval(autoplayTimer)
        autoplayTimer = null
    }
    
    if (slideWrapper.value) {
        slideWrapper.value.setAttribute('aria-live', 'polite')
    }
    
    isAutoPlaying.value = false
}

const updateDimensions = () => {
    if (!slideWrapper.value) return
    
    const slides = slideWrapper.value.querySelectorAll('.carousel__slide')
    if (slides.length === 0) return
    
    slideWidth = (slides[0] as HTMLElement).offsetWidth
    spaceBetweenSlides = props.gap
    
    // Update breakpoint on dimension changes
    updateBreakpoint()
}

const handleScroll = () => {
    // Update nav dot
    updateNavdot()
}

const handleResize = () => {
    updateDimensions()
    
    if (resizeTimer) {
        clearTimeout(resizeTimer)
    }
    
    stop()
    
    resizeTimer = setTimeout(() => {
        play()
    }, 400)
}


const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            play()
        } else {
            stop()
        }
    })
}

// Expose methods to parent
defineExpose({
    goToSlide: goTo,
    goToPage,
    getCurrentSlide: getCurrentSlideIndex,
    getCurrentPage: () => currentPage.value,
    getTotalPages: () => totalPages.value,
    nextSlide: next,
    previousSlide: previous
})

// Lifecycle
onMounted(() => {
    nextTick(() => {
        updateDimensions()
        
        // Initialize and emit initial state
        markNavdot(0)
        
        // Enable smooth scroll after initial setup
        setTimeout(() => {
            enableSmoothScroll.value = true
        }, 100)
        
        // Set up intersection observer with proper error handling
        if (props.enableAutoplay && carouselContainer.value && carouselContainer.value instanceof Element) {
            intersectionObserver = new IntersectionObserver(intersectionCallback, { threshold: 0.99 })
            intersectionObserver.observe(carouselContainer.value)
        }
        
        // Event listeners
        if (carouselContainer.value) {
            // Mouse events
            carouselContainer.value.addEventListener('pointerenter', stop)
            carouselContainer.value.addEventListener('pointerleave', play)
            
            // Keyboard events
            carouselContainer.value.addEventListener('focus', stop, true)
            carouselContainer.value.addEventListener('blur', () => {
                if (carouselContainer.value?.matches(':hover')) return
                play()
            }, true)
            
            // Touch events
            carouselContainer.value.addEventListener('touchstart', stop)
        }
        
        // Window resize
        window.addEventListener('resize', handleResize)
    })
})

onBeforeUnmount(() => {
    // Cleanup
    if (autoplayTimer) {
        clearInterval(autoplayTimer)
    }
    if (resizeTimer) {
        clearTimeout(resizeTimer)
    }
    if (intersectionObserver) {
        intersectionObserver.disconnect()
    }

    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <div
        ref="carouselContainer"
        class="carousel relative"
        role="group"
        :aria-label="label"
        aria-roledescription="carousel"
        :style="{ width: carouselWidth, ...carouselCSSVars }"
    >
        <!-- Navigation arrows -->
        <div
            v-if="enableArrows"
            :class="leftArrowClass"
        >
            <slot
                name="left-arrow"
                :previous="previous"
                :can-go-previous="canGoPrevious"
                :current-slide="currentSlideIndex"
                :total-slides="nSlides"
            />
        </div>
        
        <div
            v-if="enableArrows"
            :class="rightArrowClass"
        >
            <slot
                name="right-arrow"
                :next="next"
                :can-go-next="canGoNext"
                :current-slide="currentSlideIndex"
                :total-slides="nSlides"
            />
        </div>

        <!-- Navigation dots - positioned first in DOM for accessibility -->
        <div
            v-if="enableDots"
            :class="dotsContainerClass"
            role="group"
            :aria-label="$t('carousel.chooseslide')"
        >
            <!-- Custom dots slot -->
            <slot
                name="dots"
                :slides="slides"
                :current-slide="currentSlideIndex"
                :current-page="currentPage"
                :total-pages="totalPages"
                :go-to-slide="goTo"
                :go-to-page="goToPage"
            >
                <!-- Default dots wrapped in ClientOnly -->
                <ClientOnly>
                    <button
                        v-for="page in totalPages"
                        :key="`navdot-${page - 1}`"
                        type="button"
                        class="appearance-none border-0 cursor-pointer bg-gray-400 rounded-full h-2.5 w-2.5 p-0 focus-style"
                        :class="{ 'is-active bg-primary': currentPage === page - 1 }"
                        :aria-label="`${page} ${$t('carousel.of')} ${totalPages}`"
                        :aria-disabled="currentPage === page - 1"
                        @click="goToPage(page - 1)"
                    />
                    
                    <template #fallback>
                        <div style="min-height: 2.5rem;" />
                    </template>
                </ClientOnly>
            </slot>
        </div>

        <!-- Slide wrapper -->
        <div
            ref="slideWrapper"
            class="carousel__slides w-full flex overflow-auto"
            :class="{
                'scroll-smooth': enableSmoothScroll,
            }"
            :style="{ gap: `${gap}px` }"
            :aria-atomic="false"
            :aria-live="ariaLive"
            @scroll="handleScroll"
        >
            <!-- Original slides -->
            <div
                v-for="(slide, index) in slides"
                :key="slide.id || `slide-${index}`"
                class="carousel__slide w-full flex-none snap-center"
                role="group"
                :aria-label="`${index + 1} ${$t('carousel.of')} ${slides.length}`"
                aria-roledescription="slide"
            >
                <slot :slide="slide" :index="index" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.carousel__slides {
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Firefox and latest Chromium */
}

.carousel__slides::-webkit-scrollbar {
    display: none; /* Safari and legacy Chromium */
}

.carousel__slide {
    /* Responsive width using CSS variables, accounting for gaps */
    width: calc((100% - (var(--slides-per-view, 1) - 1) * var(--gap, 0px)) / var(--slides-per-view, 1));
}

/* Responsive breakpoints matching Tailwind CSS */
@media (min-width: 640px) {
    .carousel__slide {
        width: calc((100% - (var(--slides-per-view-sm, var(--slides-per-view, 1)) - 1) * var(--gap, 0px)) / var(--slides-per-view-sm, var(--slides-per-view, 1)));
    }
}

@media (min-width: 768px) {
    .carousel__slide {
        width: calc((100% - (var(--slides-per-view-md, var(--slides-per-view, 1)) - 1) * var(--gap, 0px)) / var(--slides-per-view-md, var(--slides-per-view, 1)));
    }
}

@media (min-width: 1024px) {
    .carousel__slide {
        width: calc((100% - (var(--slides-per-view-lg, var(--slides-per-view, 1)) - 1) * var(--gap, 0px)) / var(--slides-per-view-lg, var(--slides-per-view, 1)));
    }
}

@media (min-width: 1280px) {
    .carousel__slide {
        width: calc((100% - (var(--slides-per-view-xl, var(--slides-per-view, 1)) - 1) * var(--gap, 0px)) / var(--slides-per-view-xl, var(--slides-per-view, 1)));
    }
}

@media (min-width: 1536px) {
    .carousel__slide {
        width: calc((100% - (var(--slides-per-view-2xl, var(--slides-per-view, 1)) - 1) * var(--gap, 0px)) / var(--slides-per-view-2xl, var(--slides-per-view, 1)));
    }
}

</style>