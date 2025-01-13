<script setup lang="ts">
const { cartItems, subtotal, totalPrice, shippingTotal } = useCart();
const hasItems = computed(() => cartItems.value.length > 0);
const { getFormattedPrice } = usePrice()
</script>

<template>
    <div v-if="hasItems" class="m-10">
        <h1 class="mb-3 text-2xl font-medium text-secondary-900">
            {{ $t("cart.title") }}
        </h1>

        <div class="my-10 md:grid md:grid-cols-3 md:gap-8">
            <ul role="list" class="divide-y pl-0 divide-secondary-200 md:col-span-2 border-t">
                <li v-for="cartItem in cartItems" :key="cartItem.id" class="flex justify-between gap-4 py-6">
                    <div>{{ cartItem.label }}</div>
                    <div>{{ cartItem.quantity }} x {{ getFormattedPrice(cartItem?.price?.unitPrice) }}</div>
                </li>
            </ul>

            <aside class="md:col-span-1 pb-4 px-4 bg-secondary-50 rounded dark:bg-secondary-800">
                <h2 class="text-xl font-medium text-secondary-900">
                    {{ $t("cart.orderSummary") }}
                </h2>

                <div class="flex py-4 border-b justify-between text-sm text-secondary-500">
                    <p>{{ $t("cart.subtotal") }}</p>
                    <div class="text-secondary-900 font-medium">
                        {{ getFormattedPrice(subtotal) }}
                    </div>
                </div>

                <div class="flex py-4 border-b justify-between text-sm text-secondary-500">
                    <p>{{ $t("cart.shippingEstimate") }}</p>
                    <div class="text-secondary-900 font-medium">
                        {{ getFormattedPrice(shippingTotal) }}
                    </div>
                </div>

                <div class="flex py-4 mb-8 justify-between text-secondary-900 font-medium">
                    <p>{{ $t("cart.orderTotal") }}</p>
                    <div class="text-secondary-900 font-medium">
                        {{ getFormattedPrice(totalPrice) }}
                    </div>
                </div>

                <NuxtLinkLocale to="/checkout">
                    {{ $t("cart.checkout") }}
                </NuxtLinkLocale>
            </aside>
        </div>
    </div>
    <h1 v-else class="m-10 text-center text-2xl font-medium text-secondary-900">
        {{ $t("cart.emptyCartLabel") }}
    </h1>
</template>
