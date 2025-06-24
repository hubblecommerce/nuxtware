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
    showNavigation?: boolean
    showIndicators?: boolean
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
    showNavigation: true,
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
            :items="carouselItems"
            :items-per-slide="itemsPerSlide"
            :gap="gap"
            :show-navigation="showNavigation"
            :show-indicators="showIndicators"
            :auto-play="autoPlay"
            :auto-play-interval="autoPlayInterval"
            :loop="loop"
            :loading="loading"
            :skeleton-items="skeletonItems"
            height="auto"
            :reserve-space="true"
            class="product-carousel"
        >
            <template #default="{ item }">
                <ProductCard
                    :product="(item.data as Schemas['Product'])"
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