<script setup lang="ts">
import { ApiClientError } from '@shopware/api-client'
import type { ProductWishlistToggleProps } from '../../types/product-wishlist-toggle'

const props = withDefaults(defineProps<ProductWishlistToggleProps>(), {
    variant: 'icon',
    size: 'medium',
    disabled: false
})

const { t } = useI18n()
const { success, error } = useGlobalNotifications()

// Wishlist functionality
const { addToWishlist, removeFromWishlist, isInWishlist } = useProductWishlist(props.product.id)

// Computed properties for styling and accessibility
const buttonSize = computed(() => {
    if (props.variant === 'button') {
        return props.size
    }
    // For icon variant, ensure minimum 44px touch target for accessibility
    return props.size === 'small' ? 'medium' : props.size
})

const iconSize = computed(() => {
    switch (props.size) {
        case 'small': return 'sm'
        case 'large': return 'lg'
        default: return 'md'
    }
})

const ariaLabel = computed(() => {
    return isInWishlist.value 
        ? t('wishlist.removeFromWishlist')
        : t('wishlist.addToWishlist')
})

const buttonText = computed(() => {
    return isInWishlist.value 
        ? t('wishlist.removeFromWishlist')
        : t('wishlist.addToWishlist')
})

const productName = computed(() => props.product.translated?.name || '')

// Wishlist toggle functionality
const toggleWishlistProduct = async () => {
    if (props.disabled) return

    try {
        if (isInWishlist.value) {
            await removeFromWishlist()
            success(t('wishlist.messages.removedFromWishlist', { product: productName.value }))
        } else {
            await addToWishlist()
            success(t('wishlist.messages.addedToWishlist', { product: productName.value }))
        }
    } catch (err) {
        // Handle specific API errors if available
        if (err instanceof ApiClientError && err.details?.errors?.[0]?.detail) {
            error(`${t('wishlist.messages.wishlistError')} ${err.details.errors[0].detail}`)
        } else {
            error(t('wishlist.messages.wishlistError'))
        }
        console.error('Wishlist toggle error:', err)
    }
}
</script>

<template>
    <FoundationButton
        variant="ghost"
        :size="buttonSize"
        :disabled="disabled"
        :aria-label="ariaLabel"
        circle
        class="product-wishlist-toggle focus-style"
        data-testid="product-wishlist-button"
        @click.stop="toggleWishlistProduct"
    >
        <ClientOnly>
            <template v-if="variant === 'icon'">
                <FoundationIcon
                    :name="isInWishlist ? 'heart-filled' : 'heart'"
                    :size="iconSize"
                    :class="[
                        'transition-colors duration-200',
                        isInWishlist ? 'text-wishlist-toggle-active' : 'text-wishlist-toggle hover:text-wishlist-toggle-active'
                    ]"
                    :aria-hidden="true"
                />
            </template>
            <template v-else>
                <FoundationIcon
                    :name="isInWishlist ? 'heart-filled' : 'heart'"
                    :size="iconSize"
                    :class="[
                        'mr-2 transition-colors duration-200',
                        isInWishlist ? 'text-wishlist-toggle-active' : 'text-wishlist-toggle'
                    ]"
                    :aria-hidden="true"
                />
                {{ buttonText }}
            </template>
        </ClientOnly>
    </FoundationButton>
</template>
