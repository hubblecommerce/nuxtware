<script setup lang="ts">
const { params } = useRoute();
const orderId = params.id as string;
const {
    loadOrderDetails,
    shippingAddress,
    billingAddress,
    shippingMethod,
    order,
    subtotal,
    total,
    shippingCosts,
} = useOrderDetails(orderId);

onMounted(async () => {
    await loadOrderDetails();
});
</script>

<template>
    <client-only>
        <div>
            <h1>{{ $t('checkout.success.title') }}</h1>
            <div>{{ $t('checkout.success.orderId') }} {{order?.orderNumber}}</div>
            <div>{{ $t('checkout.success.orderNotification') }} {{ order?.orderCustomer?.email }}</div>
        </div>
    </client-only>
</template>
