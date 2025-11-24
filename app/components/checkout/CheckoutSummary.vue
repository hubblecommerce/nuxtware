<script setup lang="ts">
const {
    cartItems,
    cart
} = useCart()
</script>

<template>
    <ComponentFieldset
        :headline="$t('checkout.orderSummary')"
        :description="$t('checkout.orderSummaryLabel')"
    >
        <!-- Cart Items -->
        <div v-if="cartItems.length > 0">
            <FoundationHeadline tag="h4" class="text-base font-medium mb-3">
                {{ $t('checkout.summary.items') }} ({{ cartItems.length }})
            </FoundationHeadline>
            
            <div class="max-h-64 overflow-y-auto border border-border rounded-lg px-4">
                <CartItem
                    v-for="item in cartItems"
                    :key="item.id"
                    :item="item"
                    :show-controls="false"
                />
            </div>
        </div>

        <!-- Voucher Section -->
        <CheckoutVoucher />

        <!-- Cart Summary with Totals -->
        <div v-if="cart">
            <CartSummary
                :cart="cart"
                :show-checkout-button="false"
                :show-cart-button="false"
                class="p-2 rounded-lg"
            />
        </div>
    </ComponentFieldset>
</template>