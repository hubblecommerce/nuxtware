<script setup lang="ts">
import type { Schemas } from '#shopware'
import { ApiClientError } from '@shopware/api-client'

const { getWishlistProducts, items, count, clearWishlist } = useWishlist()
const { apiClient } = useShopwareContext()
const { resolveApiErrors } = useApiErrorsResolver()
const { success, error: showError } = useGlobalNotifications()

const { t } = useI18n()
const errors = ref<string[]>([])
const isInitialLoad = ref(true)
const wishlistProducts = ref<Schemas["Product"][]>([])

const hasItems = computed(() => count.value > 0)
const isWishlistEmpty = computed(() => !isInitialLoad.value && !hasItems.value)

const handleError = (e: unknown) => {
    if (e instanceof ApiClientError) {
        const _errors = resolveApiErrors(e.details.errors)
        for (const error of _errors) {
            errors?.value?.push(error)
        }
    }
}

// Watch for changes in wishlist items and refresh product list
watch(items, async (newItems) => {
    if (newItems.length > 0) {
        try {
            const result = await apiClient.invoke('readProduct post /product', {
                body: {
                    filter: [
                        {
                            type: 'equalsAny',
                            field: 'id',
                            value: newItems.join('|')
                        }
                    ],
                    limit: newItems.length,
                    associations: {
                        media: {},
                        cover: { associations: { media: {} } },
                        options: { associations: { group: {} } },
                        properties: { associations: { group: {} } }
                    }
                }
            })
            wishlistProducts.value = result.data.elements || []
        } catch (e) {
            console.warn('Could not refresh wishlist products:', e)
        }
    } else {
        wishlistProducts.value = []
    }
})

const onClearWishlist = async () => {
    try {
        await clearWishlist()
        success(t('wishlist.messages.clearedWishlist'))
    } catch (e) {
        handleError(e)
        showError(t('wishlist.messages.wishlistError'))
    }
}

onMounted(async () => {
    try {
        await getWishlistProducts()
        
        // Fetch product details for wishlist items
        if (items.value.length > 0) {
            const result = await apiClient.invoke('readProduct post /product', {
                body: {
                    filter: [
                        {
                            type: 'equalsAny',
                            field: 'id',
                            value: items.value.join('|')
                        }
                    ],
                    limit: items.value.length,
                    associations: {
                        media: {},
                        cover: { associations: { media: {} } },
                        options: { associations: { group: {} } },
                        properties: { associations: { group: {} } }
                    }
                }
            })

            wishlistProducts.value = result.data.elements || []
        }
    } catch (e) {
        handleError(e)
    } finally {
        isInitialLoad.value = false
    }
})

useHead({
    title: t('wishlist.title')
})
</script>

<template>
    <div class="mx-auto w-full max-w-8xl px-2 py-8">
        <!-- Error state -->
        <div v-if="errors?.length > 0" class="mb-6 p-4 bg-error border border-error-content rounded">
            <h2 class="text-error-content font-medium mb-2">{{ $t('common.error') }}</h2>
            <ul class="text-error-content text-sm">
                <li v-for="(error, errorIndex) in errors" :key="errorIndex">
                    {{ error }}
                </li>
            </ul>
        </div>

        <!-- Page header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-medium">
                {{ $t("wishlist.title") }}
            </h1>
            <FoundationButton
                v-if="hasItems && !isInitialLoad"
                variant="outline"
                size="small"
                @click="onClearWishlist"
            >
                {{ $t("wishlist.clearWishlist") }}
            </FoundationButton>
        </div>

        <!-- Empty wishlist state -->
        <div v-if="isWishlistEmpty" class="flex flex-col items-center justify-center py-16">
            <FoundationIcon name="heart" class="w-12 h-12 mb-4 text-muted" />
            <h2 class="text-center text-xl font-medium mb-2">
                {{ $t("wishlist.emptyWishlistLabel") }}
            </h2>
            <p class="text-center text-muted mb-6">
                {{ $t("wishlist.emptyWishlistDescription") }}
            </p>
            <FoundationLink href="/" class="btn btn-primary">
                {{ $t("wishlist.continueShopping") }}
            </FoundationLink>
        </div>

        <!-- Wishlist content (with items or loading) -->
        <div v-else>
            <!-- Show skeleton items during initial load -->
            <div v-if="isInitialLoad" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ComponentSkeleton 
                    v-for="i in 8" 
                    :key="`skeleton-${i}`"
                    preset="card" 
                    height="400px"
                />
            </div>
            
            <!-- Show actual wishlist items -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProductCard
                    v-for="product in wishlistProducts"
                    :key="product.id"
                    :product="product"
                    :show-wishlist="true"
                    layout-type="standard"
                />
            </div>
        </div>
    </div>
</template>