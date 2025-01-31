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
<!--        <div>-->
<!--            {{ $t('cart.title') }} {{ $t('cart.totals') }}: <span><client-only>{{ getFormattedPrice(cart?.price?.totalPrice) }}<template #fallback>...</template></client-only></span>-->
<!--        </div>-->

<!--        <ContextLanguageSwitch />-->
<!--        <ContextCurrencySwitch />-->

<!--        <LayoutNavigationDesktop />-->

        <div class="w-full flex justify-between items-center p-2">
            <FoundationButton
                size="medium"
                variant="ghost"
                class="flex-shrink-0"
                square
            >
                <span class="sr-only">{{ $t('header.nav.open') }}</span><FoundationIcon name="menu" />
            </FoundationButton>

            <FoundationLink href="/" class="w-full max-w-[200px] mr-auto">
                <span class="sr-only">{{ $t('header.homeLink') }}</span><FoundationIcon name="logo" class="w-full" />
            </FoundationLink>

            <div class="flex-shrink-0 flex justify-between items-center gap-2">
                <FoundationLink href="/customer" class="btn btn-ghost btn-medium btn-square">
                    <span class="sr-only">{{ $t('header.customerLink') }}</span><FoundationIcon name="user" />
                </FoundationLink>
                <FoundationLink href="/wishlist" class="btn btn-ghost btn-medium btn-square">
                    <span class="sr-only">{{ $t('header.wishlistLink') }}</span><FoundationIcon name="heart" />
                </FoundationLink>
                <FoundationButton size="medium" variant="ghost" square>
                    <span class="sr-only">{{ $t('header.cart.open') }}</span><FoundationIcon name="cart" />
                </FoundationButton>
            </div>
        </div>

        <WidgetQuickSearch />
    </header>
    <aside />
    <main>
        <slot />
    </main>
    <footer />
</template>
