<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client"

interface ProductWishlistProps {
    productId: string
    variant?: 'icon' | 'button'
    size?: 'small' | 'default' | 'large'
}

const props = withDefaults(defineProps<ProductWishlistProps>(), {
    variant: 'icon',
    size: 'default'
})

const { pushSuccess, pushError } = useNotifications()
const { t } = useI18n()

// Get product info to display in notifications
const { data: product } = useProduct(computed(() => ({ id: props.productId })))

const { addToWishlist, removeFromWishlist, isInWishlist } = useProductWishlist(props.productId)

const iconSize = computed(() => {
    switch(props.size) {
        case 'small': return 'h-5 w-5'
        case 'large': return 'h-8 w-8'
        default: return 'h-7 w-7'
    }
})

const buttonClasses = computed(() => {
    if (props.variant === 'button') {
        return {
            'py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md': true,
            'text-white bg-primary-600 hover:bg-primary-700': !isInWishlist.value,
            'text-secondary-600 bg-secondary-100': isInWishlist.value
        }
    }
    
    return 'bg-transparent hover:animate-count-infinite hover:animate-heart-beat'
})

const toggleWishlistProduct = async () => {
    if (!isInWishlist.value) {
        try {
            await addToWishlist()
            return pushSuccess(
                t("product.messages.addedToWishlist", {
                    p: product.value?.translated.name
                })
            )
        } catch (error) {
            if (error instanceof ApiClientError) {
                const reason = error.details.errors?.[0]?.detail
                    ? `Reason: ${error.details.errors?.[0]?.detail}`
                    : ""
                return pushError(
                    `${product.value?.translated.name} cannot be added to wishlist.\n${reason}`,
                    { timeout: 5000 }
                )
            }
        }
    }
    removeFromWishlist()
}
</script>

<template>
    <button
        type="button"
        :class="buttonClasses"
        :aria-label="$t(isInWishlist ? 'product.removeFromWishlist' : 'product.addToWishlist')"
        data-testid="product-wishlist-button"
        @click="toggleWishlistProduct"
    >
        <client-only>
            <template v-if="variant === 'icon'">
                <div
                    v-if="isInWishlist"
                    :class="[iconSize, 'i-carbon-favorite-filled c-red-500']"
                    data-testid="product-wishlist-icon-in"
                    aria-hidden="true"
                />
                <div
                    v-else
                    :class="[iconSize, 'i-carbon-favorite']"
                    data-testid="product-wishlist-icon-not-in"
                    aria-hidden="true"
                />
            </template>
            <template v-else>
                {{ $t(isInWishlist ? 'product.removeFromWishlist' : 'product.addToWishlist') }}
            </template>
        </client-only>
    </button>
</template>