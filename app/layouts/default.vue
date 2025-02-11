<script setup lang="ts">
const { loadNavigationElements } = useNavigationCached()
const { data } = useAsyncData("navigation", () => {
    return loadNavigationElements({ depth: 3 })
})
provide('mainNavigation', data)

// const { getFormattedPrice } = usePrice()
// const { cart } = useCart()
</script>

<template>
    <header>
<!--        <div>-->
<!--            {{ $t('cart.title') }} {{ $t('cart.totals') }}: <span><client-only>{{ getFormattedPrice(cart?.price?.totalPrice) }}<template #fallback>...</template></client-only></span>-->
<!--        </div>-->

<!--        <ContextLanguageSwitch />-->
<!--        <ContextCurrencySwitch />-->

        <div class="m-auto w-full flex flex-wrap justify-between items-center p-2 lg:container">
            <LayoutSidenavMenu />

            <FoundationLink href="/" class="w-[calc(100%-3rem-50%)] max-w-[200px] order-[20] mr-auto lg:mr-0">
                <span class="sr-only">{{ $t('header.homeLink') }}</span><FoundationIcon name="logo" class="w-full" />
            </FoundationLink>

            <div class="flex-shrink-0 flex justify-between items-center gap-2 order-[30]">
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

            <WidgetQuickSearch class="w-full mt-2 order-[40] lg:order-[25] lg:w-[300px] lg:mt-0" />
        </div>

        <div class="hidden lg:block bg-primary">
            <div class="container m-auto px-2">
                <LayoutNavigationMegaMenu />
            </div>
        </div>
    </header>
<!--    <aside />-->
    <main>
        <slot />
    </main>
<!--    <footer />-->
</template>
