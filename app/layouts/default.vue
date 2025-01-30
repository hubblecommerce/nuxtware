<script setup lang="ts">
const { loadNavigationElements } = useNavigationCached()
const { data } = useAsyncData("navigation", () => {
    return loadNavigationElements({ depth: 3 })
})
provide('mainNavigation', data)

const { getFormattedPrice } = usePrice()
const { cart } = useCart()


const searchTerm = ref('')
const searchInput = ref()
function submitSearch () {
    console.log('submit');
}
function resetSearch () {
    searchTerm.value = ''
    searchInput.value.componentInput.foundationInput.focus()
}
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

        <div class="w-full items-center px-2">
            <ComponentTextInput
                id="search"
                ref="searchInput"
                v-model="searchTerm"
                label="Search"
                placeholder="Search..."
                :show-label="false"
                bordered
            >
                <template #iconBefore>
                    <FoundationButton variant="ghost" size="small" square @click="submitSearch">
                        <span class="sr-only">Submit search</span>
                        <FoundationIcon name="search" />
                    </FoundationButton>
                </template>
                <template #iconAfter>
                    <FoundationButton v-if="searchTerm" variant="ghost" size="small" square @click="resetSearch()">
                        <span class="sr-only">Reset search term</span>
                        <FoundationIcon name="x" />
                    </FoundationButton>
                </template>
            </ComponentTextInput>
        </div>
    </header>
    <aside />
    <main>
        <slot />
    </main>
    <footer />
</template>
