<script setup lang="ts">
import type { Schemas } from '#shopware'
import { ApiClientError } from '@shopware/api-client'

interface CartSidenavProps {
    showCloseButton?: boolean
    maxHeight?: string // Used as 'max-height' style property
    emptyCartMessage?: string
}

const props = withDefaults(defineProps<CartSidenavProps>(), {
    showCloseButton: true,
    maxHeight: 'calc(100vh - 200px)',
    emptyCartMessage: ''
})

// Two-way binding for controlling visibility
const isOpen = defineModel<boolean>()

// i18n
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

// Initialize data and state
const { cart, refreshCart, changeProductQuantity, removeItem } = useCart()
const { resolveApiErrors } = useApiErrorsResolver()
const errors = ref<string[]>([])
const isLoading = ref(false)

// Handle checkout button click
const handleCheckout = () => {
    navigateTo(formatLink('/checkout'))
    isOpen.value = false
}

const handleCart = () => {
    isOpen.value = false
}

const onChangeQuantity = async (data: { id: string, quantity: number }) => {
    try {
        await changeProductQuantity({ id: data.id, quantity: data.quantity })
    } catch (e) {
        handleError(e)
    }
}

const onRemoveItem = async (item: Schemas["LineItem"]) => {
    try {
        await removeItem(item)
    } catch (e) {
        handleError(e)
    }
}

const handleError = (e: unknown) => {
    if (e instanceof ApiClientError) {
        const _errors = resolveApiErrors(e.details.errors)
        for (const error of _errors) {
            // TODO: instead of display error message statically, use global notifications
            errors?.value?.push(error)
        }
    }
}

// Watch for open/close to fetch data
watch(isOpen, (newValue) => {
    if (newValue) {
        refreshCart()
    }
})

// Automatically fetch on component mount if opened
onMounted(() => {
    if (isOpen.value) {
        refreshCart()
    }
})
</script>

<template>
    <SidenavOverlay
        v-model="isOpen"
        direction="right"
        width-class="w-[90%] md:w-[400px]"
    >
        <div class="flex flex-col h-full bg-white">
            <!-- Header -->
            <header class="flex items-center justify-between p-2 pl-4 pr-0 border-b border-border">
                <FoundationHeadline 
                    level="h2" 
                    class="text-lg font-medium"
                    :level-style="false"
                >
                    {{ $t('cart.title') }}
                </FoundationHeadline>
                
                <FoundationButton 
                    v-if="showCloseButton"
                    aria-label="Close cart"
                    square
                    @click="isOpen = false"
                >
                    <FoundationIcon name="x" />
                </FoundationButton>
            </header>
            
            <!-- Loading state -->
            <div v-if="isLoading" class="flex items-center justify-center flex-grow p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-border" />
            </div>
            
            <!-- Error state -->
            <div v-else-if="errors?.length > 0" class="flex items-center justify-center flex-grow p-8 text-error">
                <template v-for="(error, errorIndex) in errors" :key="errorIndex">
                    <p>{{ error }}</p>
                </template>
            </div>
            
            <!-- Empty cart state -->
            <div 
                v-else-if="!cart?.lineItems?.length" 
                class="flex flex-col items-center justify-center flex-grow p-8 "
            >
                <FoundationIcon name="cart" class="w-12 h-12 mb-4" />
                <p>{{ props.emptyCartMessage || $t('cart.emptyCartLabel') }}</p>
            </div>
            
            <!-- Cart items -->
            <div v-else class="flex-grow overflow-auto" :style="{ 'max-height': props.maxHeight }">
                <div class="p-2">
                    <CartItem
                        v-for="item in cart.lineItems"
                        :key="item.id"
                        :item="item"
                        @update:quantity="(quantity) => onChangeQuantity({ id: item.id, quantity })"
                        @remove="onRemoveItem(item)"
                    />
                </div>
            </div>
            
            <!-- Cart summary -->
            <div v-if="cart?.lineItems?.length" class="p-4 border-t border-border">
                <CartSummary 
                    :cart="cart" 
                    class="p-2 rounded-lg"
                    @cart="handleCart"
                    @checkout="handleCheckout"
                />
            </div>
        </div>
    </SidenavOverlay>
</template>
