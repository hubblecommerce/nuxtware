<template>
    <div class="container mx-auto p-2">
        <!-- Current slide indicator -->
        <div class="mb-4 text-center">
            <p class="text-lg font-semibold">Current Slide: {{ currentSlide + 1 }} of {{ exampleSlides.length }}</p>
        </div>

        <!-- Main carousel with custom dots and arrows -->
        <ComponentCarouselNew
            ref="carouselRef"
            :slides="exampleSlides"
            label="Ryoan-ji Temple Seasonal Views"
            :autoplay-interval="3000"
            :enable-autoplay="false"
            :enable-infinite-scroll="true"
            :respect-reduced-motion="true"
            carousel-width="100%"
            :gap="40"
            :enable-dots="true"
            :enable-arrows="true"
            class="pb-8"
            @slide-change="onSlideChange"
        >
            <template #default="{ slide, index }">
                <div class="relative w-full h-[350px] bg-gray-100 rounded-lg overflow-hidden">
                    <FoundationImage
                        :src="slide.image"
                        :alt="slide.alt"
                        :intersection-lazy="index !== 0"
                        :width="slide.width"
                        :height="slide.height"
                        class="w-full h-full object-cover"
                    />
                    <div class="absolute bottom-4 left-4 text-white bg-gray-400 p-4">
                        <h3 class="text-xl font-bold mb-2">{{ slide.title }}</h3>
                        <p class="text-sm opacity-90">{{ slide.description }}</p>
                    </div>
                </div>
            </template>
            
            <!-- Custom dots slot -->
            <template #dots="{ slides, currentSlide: dotCurrentSlide, goToSlide: dotGoToSlide }">
                <div
                    v-for="(slide, index) in slides"
                    :key="`custom-dot-${index}`"
                    class="cursor-pointer transition-all duration-200"
                    @click="dotGoToSlide(index)"
                >
                    <div
                        class="w-12 h-3 rounded-full border-2"
                        :class="{
                            'bg-blue-500 border-blue-500': dotCurrentSlide === index,
                            'bg-gray-300 border-gray-300 hover:bg-gray-400': dotCurrentSlide !== index
                        }"
                    />
                    <span class="sr-only">{{ slide.title }}</span>
                </div>
            </template>
            
            <!-- Custom arrow slots -->
            <template #left-arrow="{ previous, canGoPrevious }">
                <FoundationButton
                    size="small"
                    circle
                    :disabled="!canGoPrevious"
                    class="bg-white/90 hover:bg-white"
                    aria-label="Previous slide"
                    @click="previous"
                >
                    <FoundationIcon name="chevron-left" />
                </FoundationButton>
            </template>
            
            <template #right-arrow="{ next, canGoNext }">
                <FoundationButton
                    size="small"
                    circle
                    :disabled="!canGoNext"
                    class="bg-white/90 hover:bg-white"
                    aria-label="Next slide"
                    @click="next"
                >
                    <FoundationIcon name="chevron-right" />
                </FoundationButton>
            </template>
        </ComponentCarouselNew>

        <!-- Thumbnail preview gallery -->
        <div class="mt-6">
            <h3 class="text-lg font-semibold mb-3">Thumbnail Gallery</h3>
            <div class="flex gap-2 overflow-x-auto">
                <button
                    v-for="(slide, index) in exampleSlides"
                    :key="`thumb-${index}`"
                    class="relative flex-shrink-0 w-24 h-16 rounded border-2 transition-all"
                    :class="{
                        'border-blue-500 ring-2 ring-blue-200': currentSlide === index,
                        'border-gray-300 hover:border-gray-400': currentSlide !== index
                    }"
                    @click="goToSlide(index)"
                >
                    <FoundationImage
                        :src="slide.image"
                        :alt="`Thumbnail ${index + 1}`"
                        :width="96"
                        :height="64"
                        class="w-full h-full object-cover rounded"
                    />
                    <div
                        v-if="currentSlide === index"
                        class="absolute inset-0 border border-blue-500 bg-opacity-20 rounded"
                    />
                </button>
            </div>
        </div>

        <!-- Control buttons -->
        <div class="mt-4 flex gap-2 justify-center">
            <FoundationButton
                color="primary"
                @click="previousSlide"
            >
                Previous
            </FoundationButton>
            <FoundationButton
                color="primary"
                @click="nextSlide"
            >
                Next
            </FoundationButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '../../../components/component/ComponentCarouselNew.vue'

// Template ref for carousel component
const carouselRef = ref()

// Current slide state
const currentSlide = ref(0)

// Handle slide change from carousel
const onSlideChange = (index: number) => {
    currentSlide.value = index
}

// Programmatic navigation methods
const goToSlide = (index: number) => {
    carouselRef.value?.goToSlide(index)
}

const nextSlide = () => {
    carouselRef.value?.nextSlide()
}

const previousSlide = () => {
    carouselRef.value?.previousSlide()
}

// Example slides data
const exampleSlides: CarouselSlide[] = [
    {
        id: 1,
        title: 'Spring at Ryoan-ji Temple',
        description: 'Cherry blossoms frame the famous rock garden in Kyoto',
        image: 'https://translating-japanese-gardens.pages.dev/ryoanji/ryoanji-banner-spring-1882.jpg',
        alt: 'Spring scene at Ryoan-ji Temple with cherry blossoms',
        width: 991,
        height: 702
    },
    {
        id: 2,
        title: 'Summer Serenity',
        description: 'Lush greenery surrounds the contemplative space',
        image: 'https://translating-japanese-gardens.pages.dev/ryoanji/ryoanji-banner-summer-1882.jpg',
        alt: 'Summer scene at Ryoan-ji Temple with green foliage',
        width: 991,
        height: 702
    },
    {
        id: 3,
        title: 'Autumn Colors',
        description: 'Golden maple leaves create a warm atmosphere',
        image: 'https://translating-japanese-gardens.pages.dev/ryoanji/ryoanji-banner-autumn-1882.jpg',
        alt: 'Autumn scene at Ryoan-ji Temple with golden maple leaves',
        width: 991,
        height: 702
    },
    {
        id: 4,
        title: 'Winter Stillness',
        description: 'Snow covers the temple grounds in peaceful silence',
        image: 'https://translating-japanese-gardens.pages.dev/ryoanji/ryoanji-banner-winter-1882.jpg',
        alt: 'Winter scene at Ryoan-ji Temple covered in snow',
        width: 991,
        height: 702
    }
]
</script>