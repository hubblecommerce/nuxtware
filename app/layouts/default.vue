<script setup lang="ts">
const { loadNavigationElements } = useNavigationCached()
const { data } = useAsyncData("navigation", () => {
    return loadNavigationElements({ depth: 3 })
})
provide('mainNavigation', data)

const { getFormattedPrice } = usePrice()
const { cart } = useCart()
</script>

<template>
    <header>
        <div>
            {{ $t('cart.title') }} {{ $t('cart.totals') }}: <span><client-only>{{ getFormattedPrice(cart?.price?.totalPrice) }}<template #fallback>...</template></client-only></span>
        </div>

        <ContextLanguageSwitch />
        <ContextCurrencySwitch />

        <LayoutNavigationDesktop />
    </header>
    <aside />
    <main>
        <slot />
    </main>
    <footer />
</template>
