<script setup lang='ts'>
const { user, isGuestSession } = useUser()
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
    handleLogout,
    handleOrderPlaced,
    handleOrderError,
    initializeCheckoutFlow
} = useCheckoutFlow({
    afterAuthStep: 'checkout',
    initialAuthStep: 'login'
})

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
                        <!-- Login/Registration/User Info Section -->
                        <CheckoutLogin
                            :is-initializing="isInitializing"
                            :contact-sub-step="contactSubStep"
                            :is-user-session="isUserSession"
                            :user="user"
                            :is-guest-session="isGuestSession"
                            @login-success="handleLoginSuccess"
                            @registration-success="handleRegistrationSuccess"
                            @switch-to-login="handleSwitchToLogin"
                            @switch-to-register="handleSwitchToRegistration"
                            @logout="handleLogout"
                        />

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