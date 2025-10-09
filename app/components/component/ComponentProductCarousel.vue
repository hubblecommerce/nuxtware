<script setup lang="ts">
import type { Schemas } from '#shopware'
import type { BoxLayout } from '@shopware/composables'

interface ComponentProductCarouselProps {
    products: Schemas['Product'][]
    title?: string
    showTitle?: boolean
    layoutType?: BoxLayout
    showWishlist?: boolean
    showBadges?: boolean
    showDescription?: boolean
    descriptionLines?: number
    itemsPerSlide?: {
        default: number
        md?: number
        lg?: number
        xl?: number
    }
    gap?: number
    showNavigation?: 'inside' | 'outside' | '' | false
    showIndicators?: 'inside' | 'outside' | '' | false
    autoPlay?: boolean
    autoPlayInterval?: number
    loop?: boolean
    loading?: boolean
    skeletonItems?: number
    class?: string
}

const props = withDefaults(defineProps<ComponentProductCarouselProps>(), {
    title: '',
    showTitle: true,
    layoutType: 'standard',
    showWishlist: true,
    showBadges: true,
    showDescription: true,
    descriptionLines: 2,
    itemsPerSlide: () => ({ default: 1, md: 2, lg: 3, xl: 4 }),
    gap: 20,
    showNavigation: 'inside',
    showIndicators: false,
    autoPlay: false,
    autoPlayInterval: 5000,
    loop: true,
    loading: false,
    skeletonItems: 4,
    class: ''
})

// Transform products to carousel items
const carouselItems = computed(() => 
    props.products.map((product) => ({
        id: product.id,
        data: product
    } as { id: string; data: Schemas['Product'] }))
)

const { t } = useI18n()
</script>

<template>
    <div 
        :class="[
            'component-product-carousel',
            props.class
        ]"
    >
        <!-- Title -->
        <div 
            v-if="showTitle && title"
            class="mb-6"
        >
            <div class="text-xl font-bold text-primary">
                {{ title }}
            </div>
        </div>

        <!-- Product Carousel -->
        <ComponentCarousel
            ref="productSlider"
            :slides="carouselItems"
            :label="$t('carousel.label')"
            :breakpoints="{
                'default': {
                    slidesPerView: 2
                },
                sm: {
                    slidesPerView: 2
                },
                md: {
                    slidesPerView: 3
                },
                lg: {
                    slidesPerView: 4
                },
                xl: {
                    slidesPerView: 5
                },
                '2xl': {
                    slidesPerView: 6
                }
            }"
            :gap="gap"
            :enable-arrows="false"
            :enable-dots="false"
            :enable-autoplay="false"
            carousel-width="100%"
            left-arrow-class="btn btn-circle bg-transparent z-30 border-none"
            right-arrow-class="btn btn-circle bg-transparent z-30 border-none"
            dots-container-class="carousel__navdots flex justify-center gap-4 mt-4"
        >
            <template #default="{ index }">
                <ProductCard
                    :product="(carouselItems?.[index]?.data as Schemas['Product'])"
                    :layout-type="layoutType"
                    :show-wishlist="showWishlist"
                    :show-badges="showBadges"
                    :show-description="showDescription"
                    :description-lines="descriptionLines"
                />
            </template>

            <template #empty>
                <div class="text-center py-8">
                    <p class="text-gray-500">
                        {{ t('product.noProductsFound') }}
                    </p>
                </div>
            </template>
        </ComponentCarousel>
    </div>
</template>