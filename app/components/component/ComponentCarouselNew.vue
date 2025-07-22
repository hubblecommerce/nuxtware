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
    rightArrowClass: 'absolute right-2 top-1/2 -translate-y-1/2 z-10'
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

// Arrow state
const canGoPrevious = computed(() => {
    if (props.enableInfiniteScroll) return true
    return currentSlideIndex.value > 0
})

const canGoNext = computed(() => {
    if (props.enableInfiniteScroll) return true
    return currentSlideIndex.value < nSlides - 1
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
    slideWrapper.value.scrollTo((slideWidth + spaceBetweenSlides) * index, 0)
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

const next = () => {
    const currentIndex = getCurrentSlideIndex()
    if (props.enableInfiniteScroll && currentIndex >= nSlides - 1) {
        // Jump to beginning
        goTo(0)
    } else {
        goTo(currentIndex + 1)
    }
}

const previous = () => {
    const currentIndex = getCurrentSlideIndex()
    if (props.enableInfiniteScroll && currentIndex <= 0) {
        // Jump to end
        goTo(nSlides - 1)
    } else {
        goTo(currentIndex - 1)
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
    getCurrentSlide: getCurrentSlideIndex,
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
        :style="{ width: carouselWidth }"
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
                :go-to-slide="goTo"
            >
                <!-- Default dots -->
                <button
                    v-for="(slide, index) in slides"
                    :key="`navdot-${index}`"
                    type="button"
                    class="appearance-none border-0 cursor-pointer bg-gray-400 rounded-full h-2.5 w-2.5 p-0 focus-style"
                    :class="{ 'is-active bg-primary': currentSlideIndex === index }"
                    :aria-label="`${index + 1} ${$t('carousel.of')} ${slides.length}`"
                    :aria-disabled="currentSlideIndex === index"
                    @click="goTo(index)"
                />
            </slot>
        </div>

        <!-- Slide wrapper -->
        <div
            ref="slideWrapper"
            class="carousel__slides w-full flex overflow-auto"
            :class="{ 'smooth-scroll': enableSmoothScroll }"
            :style="{ gap: `${gap}px` }"
            :aria-atomic="false"
            :aria-live="ariaLive"
            @scroll="handleScroll"
        >
            <!-- Original slides -->
            <div
                v-for="(slide, index) in slides"
                :key="slide.id || `slide-${index}`"
                class="carousel__slide w-full flex-none scroll-snap-align-center"
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
    scroll-snap-align: center;
}

.smooth-scroll {
    scroll-behavior: smooth;
}

.scroll-snap-align-center {
    scroll-snap-align: center;
}

.is-active {
    background-color: #cccccc;
}
</style>