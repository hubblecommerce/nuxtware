<script setup lang="ts">
const { loadNavigationElements } = useNavigationCached()
const { data } = useAsyncData("navigation", () => {
    return loadNavigationElements({ depth: 3 })
})
provide('mainNavigation', data)

const { cart } = useCart()
const cartItemCount = computed(() => cart.value?.lineItems?.length ?? 0)
const showCartSidenav = ref(false)

const { count: wishlistCount } = useWishlist()

const { isLoggedIn } = useUser()
const showAccountSidenav = ref(false)
</script>

<template>
    <LayoutSkipLinks />
    <header>
        <!-- TODO: <ContextLanguageSwitch />-->
        <!-- TODO: <ContextCurrencySwitch />-->

        <div class="m-auto w-full flex flex-wrap justify-between items-center p-2 lg:container">
            <SidenavMenu />

            <FoundationLink href="/" class="w-[calc(100%-3rem-50%)] max-w-[200px] order-20 mr-auto lg:mr-0">
                <span class="sr-only">{{ $t('header.homeLink') }}</span><FoundationIcon name="logo" class="w-full" />
            </FoundationLink>

            <SearchQuick class="w-full mt-2 order-40 lg:order-25 lg:w-[300px] lg:mt-0" />

            <div class="shrink-0 flex justify-between items-center gap-2 order-30">
                <ClientOnly>
                    <!-- Show account sidenav button if logged in -->
                    <FoundationButton 
                        v-if="isLoggedIn"
                        size="medium" 
                        variant="ghost" 
                        square
                        class="relative"
                        :aria-label="$t('header.accountLink')"
                        @click="showAccountSidenav = true"
                    >
                        <span class="sr-only">{{ $t('header.accountLink') }}</span><FoundationIcon name="user" />
                        <span class="absolute -top-1 -right-1 bg-success text-success-content rounded-full w-4 h-4 flex items-center justify-center">
                            <FoundationIcon name="check" size="xs" />
                        </span>
                    </FoundationButton>
                    
                    <!-- Show login link if not logged in -->
                    <FoundationLink 
                        v-else
                        href="/account/login" 
                        class="btn btn-ghost btn-medium btn-square"
                    >
                        <span class="sr-only">{{ $t('header.customerLink') }}</span><FoundationIcon name="user" />
                    </FoundationLink>
                    
                    <template #fallback>
                        <!-- Default to login link on server -->
                        <FoundationLink 
                            href="/account/login" 
                            class="btn btn-ghost btn-medium btn-square"
                        >
                            <span class="sr-only">{{ $t('header.customerLink') }}</span><FoundationIcon name="user" />
                        </FoundationLink>
                    </template>
                </ClientOnly>
                <FoundationLink href="/wishlist" class="btn btn-ghost btn-medium btn-square relative">
                    <span class="sr-only">{{ $t('header.wishlistLink') }}</span><FoundationIcon name="heart" />
                    <client-only>
                        <span 
                            v-if="wishlistCount > 0"
                            class="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-medium rounded-full min-w-5 h-5 flex items-center justify-center px-1"
                            :aria-label="$t('header.wishlist.itemCount', { count: wishlistCount })"
                        >
                            {{ wishlistCount > 99 ? '99+' : wishlistCount }}
                        </span>
                    </client-only>
                </FoundationLink>
                <FoundationButton 
                    size="medium" 
                    variant="ghost" 
                    square
                    class="relative"
                    :aria-label="$t('header.cart.open')"
                    @click="showCartSidenav = true"
                >
                    <span class="sr-only">{{ $t('header.cart.open') }}</span><FoundationIcon name="cart" />
                    <client-only>
                        <span 
                            v-if="cartItemCount > 0"
                            class="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-medium rounded-full min-w-5 h-5 flex items-center justify-center px-1"
                            :aria-label="$t('header.cart.itemCount', { count: cartItemCount })"
                        >
                            {{ cartItemCount > 99 ? '99+' : cartItemCount }}
                        </span>
                    </client-only>
                </FoundationButton>
            </div>
        </div>

        <div class="hidden lg:block bg-primary">
            <div class="container m-auto px-2">
                <MegaMenu />
            </div>
        </div>
    </header>

    <LayoutTopBar />

    <main>
        <slot />
        <MiscScrollToTopButton />
    </main>
    
    <!-- Cart Sidenav -->
    <CartSidenav v-model="showCartSidenav" />
    
    <!-- Account Sidenav -->
    <AccountSidenav v-model="showAccountSidenav" />
    
    <!-- Global Notifications -->
    <NotificationContainer />

    <LayoutFooter :depth-footer-navigation="1" :depth-service-navigation="1" />
</template>
