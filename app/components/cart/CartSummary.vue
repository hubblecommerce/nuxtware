<script setup lang="ts">
import type { Schemas } from '#shopware'

interface CartSummaryProps {
    cart: Schemas['Cart']
    showCheckoutButton?: boolean
    showCartButton?: boolean
}

withDefaults(defineProps<CartSummaryProps>(), {
    showCheckoutButton: true,
    showCartButton: true
})

const emit = defineEmits<{
    'checkout': []
    'cart': []
}>()

const { getFormattedPrice } = usePrice()

const handleCheckout = () => {
    emit('checkout')
}

const handleCart = () => {
    emit('cart')
}
</script>

<template>
    <div>
        <h3 class="text-base font-medium  mb-3">
            {{ $t('cart.orderSummary') }}
        </h3>
        
        <div class="space-y-2">
            <!-- Subtotal -->
            <div class="flex justify-between text-sm">
                <span>{{ $t('cart.subtotal') }}</span>
                <span class="font-medium">{{ getFormattedPrice(cart.price?.positionPrice) }}</span>
            </div>
            
            <!-- Shipping costs -->
            <div class="flex justify-between text-sm">
                <span>{{ $t('cart.shippingEstimate') }}</span>
                <span class="font-medium">{{ getFormattedPrice(cart.deliveries?.[0]?.shippingCosts?.totalPrice) }}</span>
            </div>
            
            <!-- Divider -->
            <div class="border-t border-border my-2" />
            
            <!-- Total -->
            <div class="flex justify-between text-base">
                <span class="font-medium ">{{ $t('cart.orderTotal') }}</span>
                <span class="font-bold ">{{ getFormattedPrice(cart.price?.totalPrice) }}</span>
            </div>
        </div>

         <!-- Cart button -->
        <div v-if="showCartButton" class="mt-4">
            <FoundationLink 
                to="/cart"
                class="w-full btn btn-primary btn-outline"
                @click="handleCart"
            >
                {{ $t('cart.title') }}
            </FoundationLink>
        </div>
        
        <!-- Checkout button -->
        <div v-if="showCheckoutButton" class="mt-4">
            <FoundationButton
                color="primary"
                class="w-full py-3 justify-center"
                @click="handleCheckout"
            >
                {{ $t('cart.checkout') }}
            </FoundationButton>
        </div>
    </div>
</template>
