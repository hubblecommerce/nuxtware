<script setup lang="ts">
import type { Schemas } from '#shopware'
import { ApiClientError } from '@shopware/api-client'

const { cart, refreshCart, changeProductQuantity, removeItem } = useCart()
const { resolveApiErrors } = useApiErrorsResolver()
const errors = ref<string[]>([])
const isInitialLoad = ref(true)
const loadingItems = ref<Set<string>>(new Set())

const hasItems = computed(() => (cart.value?.lineItems?.length ?? 0) > 0)
const isCartEmpty = computed(() => !isInitialLoad.value && !hasItems.value)

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

const handleCheckout = () => {
    navigateTo(formatLink('/checkout'))
}

const onChangeQuantity = async (data: { id: string, quantity: number }) => {
    try {
        loadingItems.value.add(data.id)
        await changeProductQuantity({ id: data.id, quantity: data.quantity })
    } catch (e) {
        handleError(e)
    } finally {
        loadingItems.value.delete(data.id)
    }
}

const onRemoveItem = async (item: Schemas["LineItem"]) => {
    try {
        loadingItems.value.add(item.id)
        await removeItem(item)
    } catch (e) {
        handleError(e)
    } finally {
        loadingItems.value.delete(item.id)
    }
}

const handleError = (e: unknown) => {
    if (e instanceof ApiClientError) {
        const _errors = resolveApiErrors(e.details.errors)
        for (const error of _errors) {
            errors?.value?.push(error)
        }
    }
}

onMounted(async () => {
    try {
        await refreshCart()
    } finally {
        isInitialLoad.value = false
    }
})
</script>

<template>
    <div class="lg:container mx-auto px-2 py-8">
        <!-- Error state -->
        <div v-if="errors?.length > 0" class="mb-6 p-4 bg-error border border-error-content rounded">
            <h2 class="text-error-content font-medium mb-2">{{ $t('common.error') }}</h2>
            <ul class="text-error-content text-sm">
                <li v-for="(error, errorIndex) in errors" :key="errorIndex">
                    {{ error }}
                </li>
            </ul>
        </div>

        <!-- Page title (always show) -->
        <h1 class="mb-3 text-2xl font-medium">
            {{ $t("cart.title") }}
        </h1>

        <!-- Empty cart state -->
        <div v-if="isCartEmpty" class="flex flex-col items-center justify-center py-16">
            <FoundationIcon name="cart" class="w-12 h-12 mb-4" />
            <h2 class="text-center text-xl font-medium">
                {{ $t("cart.emptyCartLabel") }}
            </h2>
        </div>

        <!-- Cart content (with items or loading) -->
        <div v-else class="md:grid md:grid-cols-3 md:gap-8">
            <!-- Cart items section -->
            <div class="md:col-span-2 border-t border-border">
                <!-- Show skeleton items during initial load -->
                <div v-if="isInitialLoad" class="flex flex-col gap-4">
                    <ComponentSkeleton 
                        v-for="i in 3" 
                        :key="`skeleton-${i}`"
                        preset="card" 
                        height="120px" 
                        class="p-4 border-b border-border"
                    />
                </div>
                
                <!-- Show actual cart items -->
                <template v-else>
                    <template v-for="item in cart?.lineItems" :key="item.id">
                        <!-- Show skeleton if this item is being modified -->
                        <ComponentSkeleton 
                            v-if="loadingItems.has(item.id)"
                            preset="card" 
                            height="120px" 
                            class="p-4 my-4 border-b border-border"
                        />
                        <!-- Show actual cart item -->
                        <CartItem
                            v-else
                            :item="item"
                            @update:quantity="(quantity) => onChangeQuantity({ id: item.id, quantity })"
                            @remove="onRemoveItem(item)"
                        />
                    </template>
                </template>
            </div>

            <!-- Cart summary section -->
            <aside class="md:col-span-1 bg-secondary-50 rounded-sm">
                <!-- Show skeleton summary during initial load -->
                <div v-if="isInitialLoad" class="p-4">
                    <div class="mb-4">
                        <ComponentSkeleton preset="heading" width="150px" height="24px" />
                    </div>
                    <div class="space-y-3">
                        <ComponentSkeleton preset="line" height="20px" />
                        <ComponentSkeleton preset="line" height="20px" />
                        <ComponentSkeleton preset="line" height="20px" />
                        <ComponentSkeleton preset="button" height="48px" class="mt-6" />
                    </div>
                </div>
                
                <!-- Show actual cart summary -->
                <CartSummary 
                    v-else-if="cart"
                    :cart="cart" 
                    :show-cart-button="false"
                    @checkout="handleCheckout"
                />
            </aside>
        </div>
    </div>
</template>
