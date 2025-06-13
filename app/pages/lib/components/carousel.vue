<script setup lang="ts">
// Mock data for examples
const basicItems = ref([
    { id: 1, title: 'First Item', description: 'This is the first carousel item' },
    { id: 2, title: 'Second Item', description: 'This is the second carousel item' },
    { id: 3, title: 'Third Item', description: 'This is the third carousel item' },
    { id: 4, title: 'Fourth Item', description: 'This is the fourth carousel item' },
    { id: 5, title: 'Fifth Item', description: 'This is the fifth carousel item' }
])

const mockProducts = ref([
    {
        id: 'prod-1',
        name: 'Wireless Headphones',
        price: { totalPrice: 99.99 },
        color: 'bg-blue-500',
        category: 'Electronics'
    },
    {
        id: 'prod-2',
        name: 'Smart Watch',
        price: { totalPrice: 199.99 },
        color: 'bg-green-500',
        category: 'Electronics'
    },
    {
        id: 'prod-3',
        name: 'Laptop Bag',
        price: { totalPrice: 49.99 },
        color: 'bg-red-500',
        category: 'Accessories'
    },
    {
        id: 'prod-4',
        name: 'Smartphone',
        price: { totalPrice: 699.99 },
        color: 'bg-purple-500',
        category: 'Electronics'
    },
    {
        id: 'prod-5',
        name: 'Bluetooth Speaker',
        price: { totalPrice: 79.99 },
        color: 'bg-orange-500',
        category: 'Electronics'
    },
    {
        id: 'prod-6',
        name: 'Gaming Mouse',
        price: { totalPrice: 39.99 },
        color: 'bg-cyan-500',
        category: 'Gaming'
    }
])

const imageGallery = ref([
    {
        id: 'img-1',
        color: 'bg-gradient-to-br from-blue-400 to-blue-600',
        caption: 'Mountain View'
    },
    {
        id: 'img-2',
        color: 'bg-gradient-to-br from-green-400 to-emerald-600',
        caption: 'Ocean Waves'
    },
    {
        id: 'img-3',
        color: 'bg-gradient-to-br from-red-400 to-rose-600',
        caption: 'Forest Path'
    },
    {
        id: 'img-4',
        color: 'bg-gradient-to-br from-purple-400 to-violet-600',
        caption: 'City Lights'
    }
])

const bannerSlides = ref([
    {
        id: 'banner-1',
        title: 'Summer Sale',
        subtitle: 'Up to 50% off on selected items',
        buttonText: 'Shop Now',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: 'white'
    },
    {
        id: 'banner-2',
        title: 'New Collection',
        subtitle: 'Discover our latest fashion trends',
        buttonText: 'Explore',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        textColor: 'white'
    },
    {
        id: 'banner-3',
        title: 'Free Shipping',
        subtitle: 'On orders over $50 worldwide',
        buttonText: 'Learn More',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        textColor: 'white'
    }
])

// Loading states for demonstration
const isLoadingProducts = ref(false)
const isLoadingImages = ref(false)

// Simulate loading
const simulateLoading = (loadingRef: Ref<boolean>, duration = 2000) => {
    loadingRef.value = true
    setTimeout(() => {
        loadingRef.value = false
    }, duration)
}

// Price formatting
const { getFormattedPrice } = usePrice()

// Page metadata
useHead({
    title: 'Carousel Component Examples',
    meta: [
        { name: 'description', content: 'Examples and demonstrations of the ComponentCarousel usage in various scenarios.' }
    ]
})
</script>

<template>
    <div class="container mx-auto px-4 py-8 space-y-12">
        <!-- Page Header -->
        <header class="text-center space-y-4">
            <h1 class="text-4xl font-bold text-gray-900">
                Carousel Component Examples
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                Demonstrations of the ComponentCarousel component in various use cases including products, images, and marketing banners.
            </p>
        </header>

        <!-- Example 1: Basic Text Carousel -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold text-gray-900">Basic Text Carousel</h2>
                <div class="text-sm text-gray-500">
                    Single item per slide, navigation enabled
                </div>
            </div>
            
            <ComponentCarousel
                :items="basicItems"
                :items-per-slide="{ default: 1 }"
                :height="200"
                :reserve-space="true"
                :auto-play="false"
                class="border border-gray-200 rounded-lg"
            >
                <template #default="{ item }">
                    <div class="h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 flex flex-col justify-center items-center text-center">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
                        <p class="text-gray-600">{{ item.description }}</p>
                    </div>
                </template>
            </ComponentCarousel>
        </section>

        <!-- Example 2: Product Carousel -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold text-gray-900">Product Carousel</h2>
                <div class="flex gap-2">
                    <FoundationButton 
                        size="small" 
                        color="secondary"
                        @click="simulateLoading(isLoadingProducts)"
                    >
                        Simulate Loading
                    </FoundationButton>
                    <div class="text-sm text-gray-500 self-center">
                        Responsive: 1/2/3 items per slide
                    </div>
                </div>
            </div>

            <ComponentCarousel
                :items="mockProducts"
                :items-per-slide="{ default: 1, md: 2, lg: 3 }"
                :gap="20"
                :loading="isLoadingProducts"
                :skeleton-items="3"
                :auto-play="true"
                :auto-play-interval="4000"
                :min-height="{ sm: 899, md: 650, lg: 400 }"
                :reserve-space="true"
                class="border border-gray-200 rounded-lg"
            >
                <template #default="{ item }">
                    <div class="h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div :class="['aspect-square flex items-center justify-center', item.color]">
                            <span class="text-white font-semibold text-lg">{{ item.name }}</span>
                        </div>
                        <div class="p-4 space-y-2">
                            <div class="text-xs text-gray-500 uppercase tracking-wide">
                                {{ item.category }}
                            </div>
                            <h3 class="font-semibold text-gray-900 truncate">{{ item.name }}</h3>
                            <div class="text-lg font-bold text-primary">
                                {{ getFormattedPrice(item.price?.totalPrice) }}
                            </div>
                            <FoundationButton size="small" class="w-full">
                                Add to Cart
                            </FoundationButton>
                        </div>
                    </div>
                </template>
            </ComponentCarousel>
        </section>

        <!-- Example 3: Image Gallery Carousel -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold text-gray-900">Image Gallery Carousel</h2>
                <div class="flex gap-2">
                    <FoundationButton 
                        size="small" 
                        color="secondary"
                        @click="simulateLoading(isLoadingImages)"
                    >
                        Simulate Loading
                    </FoundationButton>
                    <div class="text-sm text-gray-500 self-center">
                        Aspect ratio 16:9, single image
                    </div>
                </div>
            </div>

            <ComponentCarousel
                :items="imageGallery"
                :items-per-slide="{ default: 1 }"
                aspect-ratio="16/9"
                :loading="isLoadingImages"
                :skeleton-items="1"
                :auto-play="false"
                :loop="true"
                :gap="0"
                :reserve-space="true"
                class="border border-gray-200 rounded-lg overflow-hidden"
            >
                <template #default="{ item }">
                    <div :class="['relative h-full w-full flex items-center justify-center', item.color]">
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <h3 class="text-white text-lg font-semibold">{{ item.caption }}</h3>
                        </div>
                    </div>
                </template>
            </ComponentCarousel>
        </section>

        <!-- Example 4: Marketing Banner Carousel -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold text-gray-900">Marketing Banner Carousel</h2>
                <div class="text-sm text-gray-500">
                    Auto-play with custom styling
                </div>
            </div>

            <ComponentCarousel
                :items="bannerSlides"
                :items-per-slide="{ default: 1 }"
                :height="300"
                :auto-play="true"
                :auto-play-interval="5000"
                :loop="true"
                :show-indicators="true"
                :reserve-space="true"
                class="rounded-lg overflow-hidden"
            >
                <template #default="{ item }">
                    <div 
                        class="h-full w-full flex items-center justify-center relative"
                        :style="{ background: item.background }"
                    >
                        <div class="text-center space-y-4 px-8">
                            <h3 
                                class="text-3xl md:text-4xl font-bold"
                                :style="{ color: item.textColor }"
                            >
                                {{ item.title }}
                            </h3>
                            <p 
                                class="text-lg md:text-xl opacity-90"
                                :style="{ color: item.textColor }"
                            >
                                {{ item.subtitle }}
                            </p>
                            <FoundationButton 
                                size="large"
                                color="secondary"
                                class="mt-4"
                            >
                                {{ item.buttonText }}
                            </FoundationButton>
                        </div>
                    </div>
                </template>
            </ComponentCarousel>
        </section>

        <!-- Example 5: Multiple Items Responsive Carousel -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold text-gray-900">Multi-Item Responsive Carousel</h2>
                <div class="text-sm text-gray-500">
                    2/3/4 items per slide, no auto-play
                </div>
            </div>

            <ComponentCarousel
                :items="mockProducts.slice(0, 8)"
                :items-per-slide="{ default: 2, md: 3, lg: 4 }"
                :gap="16"
                :auto-play="false"
                :show-indicators="false"
                :min-height="{ sm: 200, md: 220, lg: 250 }"
                :max-height="{ sm: 280, md: 300, lg: 320 }"
                :reserve-space="true"
                class="border border-gray-200 rounded-lg"
            >
                <template #default="{ item }">
                    <div class="h-full bg-white rounded border border-gray-100 p-3 flex flex-col">
                        <div :class="['aspect-square rounded mb-2 flex items-center justify-center flex-shrink-0 text-white font-medium text-xs', item.color]">
                            {{ item.name }}
                        </div>
                        <div class="flex-grow flex flex-col">
                            <h4 class="font-medium text-sm text-gray-900 truncate mb-1">{{ item.name }}</h4>
                            <div class="text-sm font-semibold text-primary mt-auto">
                                {{ getFormattedPrice(item.price?.totalPrice) }}
                            </div>
                        </div>
                    </div>
                </template>
            </ComponentCarousel>
        </section>

        <!-- Example 6: Custom Styled Minimal Carousel -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold text-gray-900">Minimal Style Carousel</h2>
                <div class="text-sm text-gray-500">
                    No indicators, custom gap, touch enabled
                </div>
            </div>

            <ComponentCarousel
                :items="basicItems.slice(0, 3)"
                :items-per-slide="{ default: 1, md: 2 }"
                :gap="24"
                :height="150"
                :show-indicators="false"
                :auto-play="false"
                :enable-touch="true"
                :reserve-space="true"
                class="bg-gray-50 rounded-lg p-4"
            >
                <template #default="{ item, index }">
                    <div
class="h-full bg-white rounded-lg shadow-sm p-6 flex items-center justify-center border-l-4"
                         :class="{
                             'border-blue-500': index % 3 === 0,
                             'border-green-500': index % 3 === 1,
                             'border-purple-500': index % 3 === 2
                         }"
                    >
                        <div class="text-center">
                            <div
class="w-8 h-8 rounded-full mx-auto mb-2"
                                 :class="{
                                     'bg-blue-100': index % 3 === 0,
                                     'bg-green-100': index % 3 === 1,
                                     'bg-purple-100': index % 3 === 2
                                 }"
                            />
                            <h4 class="font-semibold text-gray-900">{{ item.title }}</h4>
                        </div>
                    </div>
                </template>
            </ComponentCarousel>
        </section>

        <!-- Usage Instructions -->
        <section class="bg-gray-50 rounded-lg p-6 space-y-4">
            <h2 class="text-xl font-semibold text-gray-900">Usage Instructions</h2>
            <div class="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                    <h3 class="font-medium text-gray-900 mb-2">Basic Implementation</h3>
                    <pre class="bg-white p-3 rounded border text-xs overflow-x-auto"><code>&lt;!-- Fixed height approach --&gt;
&lt;ComponentCarousel
  :items="products"
  :items-per-slide="{ default: 1, md: 2, lg: 3 }"
  :height="300"
  :reserve-space="true"
&gt;
  &lt;template #default="{ item }"&gt;
    &lt;!-- Your item template --&gt;
  &lt;/template&gt;
&lt;/ComponentCarousel&gt;

&lt;!-- Responsive aspect ratio --&gt;
&lt;ComponentCarousel
  :items="banners"
  aspect-ratio="16/9"
  :reserve-space="true"
/&gt;

&lt;!-- Responsive height constraints --&gt;
&lt;ComponentCarousel
  :items="testimonials"
  :min-height="{ sm: 200, md: 250, lg: 300 }"
  :max-height="{ sm: 350, md: 400, lg: 450 }"
  :reserve-space="true"
/&gt;</code></pre>
                </div>
                <div>
                    <h3 class="font-medium text-gray-900 mb-2">Key Features</h3>
                    <ul class="space-y-1 text-gray-600">
                        <li>• Responsive breakpoint configuration</li>
                        <li>• Touch/swipe gesture support</li>
                        <li>• Auto-play with pause on hover</li>
                        <li>• Skeleton loading states</li>
                        <li>• Keyboard navigation support</li>
                        <li>• Full accessibility compliance</li>
                        <li>• Layout shift prevention with <code>reserveSpace</code></li>
                        <li>• Flexible height/aspect-ratio options</li>
                        <li>• Smooth loading transitions</li>
                    </ul>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* Custom styles for the examples page */
.container {
    max-width: 1200px;
}

/* Ensure code blocks don't break layout */
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
