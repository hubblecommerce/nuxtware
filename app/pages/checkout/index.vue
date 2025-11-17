<script setup lang="ts">
definePageMeta({
    layout: 'checkout'
})

const { t } = useI18n()
const { isVirtualCart } = useCart()
const { error } = useGlobalNotifications()
const { selectedPaymentMethod, selectedShippingMethod } = useSessionContext()
const { user, isGuestSession } = useUser()

// Initialize checkout flow for multi-step (navigate between steps)
const {
    currentStep,
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
    afterAuthStep: 'shipping',
    initialAuthStep: 'login'
})

function selectStep (stepName: 'checkout' | 'shipping' | 'payment' | 'summary'): void {
    // Prevent access to shipping, payment, and summary steps if user is not logged in or guest
    if ((stepName !== 'checkout') && !isUserSession.value) {
        return
    }

    // Prevent access to payment and summary steps if shipping method is not selected (for physical products)
    if ((stepName === 'payment' || stepName === 'summary') && !isVirtualCart.value && !selectedShippingMethod.value) {
        error(t('checkout.shipping.noMethodSelectedError'))
        return
    }

    // Prevent access to summary step if payment method is not selected
    if (stepName === 'summary' && !selectedPaymentMethod.value) {
        error(t('checkout.payment.noMethodSelectedError'))
        return
    }

    // Update the current step
    currentStep.value = stepName
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
                <div class="w-full text-sm breadcrumbs">
                    <ul class="flex justify-center gap-4">
                        <li>
                            <FoundationLink to="/cart">
                                {{ t('checkout.breadcrumb.cart') }}
                            </FoundationLink>
                        </li>
                        <li class="link link-hover" :class="{ 'link-accent': currentStep === 'checkout'}" @click="selectStep('checkout')">
                            {{ t('checkout.breadcrumb.contact') }}
                        </li>
                        <li class="link link-hover" :class="{ 'link-accent': currentStep === 'shipping'}" @click="selectStep('shipping')">
                            {{ t('checkout.breadcrumb.shipping') }}
                        </li>
                        <li class="link link-hover" :class="{ 'link-accent': currentStep === 'payment'}" @click="selectStep('payment')">
                            {{ t('checkout.breadcrumb.payment') }}
                        </li>
                        <li class="link link-hover" :class="{ 'link-accent': currentStep === 'summary'}" @click="selectStep('summary')">
                            {{ t('checkout.breadcrumb.summary') }}
                        </li>
                    </ul>
                </div>

                <!-- Checkout Flow -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column: Forms -->
                    <div class="lg:col-span-2 space-y-6">
                        <template v-if="currentStep === 'checkout'">
                            <ClientOnly>
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
                            </ClientOnly>
                        </template>

                        <ClientOnly>
                            <!-- Shipping Section -->
                            <CheckoutShipping v-if="!isVirtualCart" v-show="currentStep === 'shipping'" />
                        </ClientOnly>

                         <ClientOnly>
                            <!-- Shipping Section -->
                            <CheckoutPayment v-show="currentStep === 'payment'" />
                        </ClientOnly>

                        <template v-if="currentStep === 'summary'">

                        </template>

                        <portal to="checkoutNavigation">
                            <div v-if="currentStep !== 'checkout'" class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
                                <div v-if="currentStep === 'shipping'" class="link link-hover cursor-pointer order-2 lg:order-1" @click="selectStep('checkout')">
                                    {{ t('checkout.shipping.navigation.back') }}
                                </div>
                                <div v-if="currentStep === 'shipping'" class="btn btn-primary w-full order-1 lg:w-auto lg:order-2" @click="selectStep('payment')">
                                    {{ t('checkout.shipping.navigation.forward') }}
                                </div>

                                <div v-if="currentStep === 'payment'" class="link link-hover cursor-pointer order-2 lg:order-1" @click="selectStep('shipping')">
                                    {{ t('checkout.payment.navigation.back') }}
                                </div>
                                <div v-if="currentStep === 'payment'" class="btn btn-primary w-full order-1 lg:w-auto lg:order-2" @click="selectStep('summary')">
                                    {{ t('checkout.payment.navigation.forward') }}
                                </div>
                            </div>
                        </portal>
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