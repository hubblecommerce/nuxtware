<script setup lang="ts">
definePageMeta({
    layout: 'checkout'
})

const { t } = useI18n()
const { isVirtualCart } = useCart()
const { error } = useGlobalNotifications()
const { selectedPaymentMethod, selectedShippingMethod } = useSessionContext()

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
    initializeCheckoutFlow
} = useCheckoutFlow({
    loginSuccessStep: 'shipping',
    registrationSuccessStep: 'shipping',
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

                <template v-if="currentStep === 'checkout'">
                    <ClientOnly>
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
                      <div v-else-if="contactSubStep === 'login'">
                        <AccountLogin
                            @login-success="handleLoginSuccess"
                            @switch-to-register="handleSwitchToRegistration"
                        />
                      </div>

                      <div v-else-if="contactSubStep === 'registration'">
                        <AccountRegistration
                            allow-guest
                            @registration-success="handleRegistrationSuccess"
                            @switch-to-login="handleSwitchToLogin"
                        />
                      </div>
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
            </div>
        </div>
    </div>
</template>