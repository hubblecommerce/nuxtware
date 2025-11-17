<script setup lang='ts'>
const { push } = useRouter()
const { user, logout, isGuestSession } = useUser()
const { isVirtualCart } = useCart()

// Initialize checkout flow for one-step (stay on checkout step)
const {
    contactSubStep,
    isUserSession,
    isInitializing,
    handleLoginSuccess,
    handleRegistrationSuccess,
    handleSwitchToLogin,
    handleSwitchToRegistration,
    initializeCheckoutFlow
} = useCheckoutFlow({
    afterAuthStep: 'checkout',
    initialAuthStep: 'login'
})

// Event handlers
const handleOrderPlaced = async (orderId: string) => {
    await push(`/checkout/success/${orderId}`)
}

const handleOrderError = (error: string) => {
    // Error is already handled by the notification system in the component
    console.error('Order placement failed:', error)
}

const handleLogout = async () => {
    await logout()
    contactSubStep.value = 'login'
}

// Initialize on mount
onMounted(async () => {
    await initializeCheckoutFlow()
})
</script>

<template>
    <div class="min-h-screen bg-surface-secondary">
        <div class="mx-auto w-full max-w-8xl px-2 py-8">
            <div class="mx-auto">
                <!-- Page Header -->
                <div class="mb-8">
                    <FoundationHeadline tag="h1" class="text-2xl font-bold mb-2">
                        {{ $t('checkout.title') }}
                    </FoundationHeadline>
                    <p>
                        {{ $t('checkout.description') }}
                    </p>
                </div>

                <!-- Checkout Flow -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column: Forms -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Loading Placeholder -->
                        <div v-if="isInitializing" class="p-6 border border-border rounded-lg bg-surface">
                            <div class="animate-pulse">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <div class="h-5 bg-border rounded w-48 mb-2" />
                                        <div class="h-4 bg-border rounded w-32"/>
                                    </div>
                                    <div class="h-8 bg-border rounded w-20"/>
                                </div>
                            </div>
                        </div>

                        <!-- Login/Registration Section -->
                        <div v-else-if="!isUserSession && contactSubStep === 'login'">
                            <AccountLogin
                                @login-success="handleLoginSuccess"
                                @switch-to-register="handleSwitchToRegistration"
                            />
                        </div>

                        <div v-else-if="!isUserSession && contactSubStep === 'registration'">
                            <AccountRegistration
                                allow-guest
                                @registration-success="handleRegistrationSuccess"
                                @switch-to-login="handleSwitchToLogin"
                            />
                        </div>

                        <!-- User Info Section (when logged in) -->
                        <div v-else-if="isUserSession" class="p-6 border border-border rounded-lg bg-surface">
                            <div class="flex items-center justify-between">
                                <div>
                                    <FoundationHeadline tag="h3" class="text-lg font-medium mb-1">
                                        {{ $t('checkout.loggedInAs') }} {{ user?.firstName }}
                                    </FoundationHeadline>
                                    <p class="text-sm text-secondary">
                                        <span v-if="isGuestSession">{{ $t('checkout.guest') }}</span>
                                        <span v-else>{{ user?.email }}</span>
                                    </p>
                                </div>
                                <FoundationButton
                                    variant="outline"
                                    size="small"
                                    @click="handleLogout"
                                >
                                    {{ $t('checkout.logOut') }}
                                </FoundationButton>
                            </div>
                        </div>

                        <!-- Voucher Section -->
                        <CheckoutVoucher />

                        <!-- Shipping Section -->
                        <CheckoutShipping v-if="!isVirtualCart" />

                        <!-- Payment Section -->
                        <CheckoutPayment />
                    </div>

                    <!-- Right Column: Order Summary -->
                    <div class="lg:col-span-1">
                        <div class="sticky top-4">
                            <CheckoutSummary
                                @order-placed="handleOrderPlaced"
                                @order-error="handleOrderError"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>