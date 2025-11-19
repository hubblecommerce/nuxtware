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
    initialAuthStep: 'registration'
})

const { cart } = useCart()

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
const billingSameAsShipping = ref(true)

// Initialize on mount
onMounted(async () => {
    await initializeCheckoutFlow()
})
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-12 lg:min-h-screen">
        <!-- Left Column: Forms -->
        <div class="content lg:col-span-7 order-2 lg:order-1 container mx-auto p-4 lg:px-16 lg:py-10 bg-gray-200">
            <div class="w-full lg:max-w-xl lg:ml-auto">
                <div class="checkout-page flex flex-col gap-8">
                    <!-- Breadcrumb -->
                    <div class="w-full text-sm breadcrumbs mb-4">
                        <ul class="flex items-center">
                            <li class="font-medium py-2">
                                <FoundationLink to="/cart">
                                    {{ t('checkout.breadcrumb.cart') }}
                                </FoundationLink>
                            </li>
                            <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground" />

                            <li class="inline-flex items-center link link-hover font-medium py-2" :class="{ 'text-primary': currentStep === 'checkout'}" @click="selectStep('checkout')">
                                {{ t('checkout.breadcrumb.contact') }}
                            </li>
                            <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground" />

                            <li class="inline-flex items-center link link-hover font-medium py-2" :class="{ 'text-primary': currentStep === 'shipping'}" @click="selectStep('shipping')">
                                {{ t('checkout.breadcrumb.shipping') }}
                            </li>
                            <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground" />

                            <li class="inline-flex items-center link link-hover font-medium py-2" :class="{ 'text-primary': currentStep === 'payment'}" @click="selectStep('payment')">
                                {{ t('checkout.breadcrumb.payment') }}
                            </li>
                            <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground" />

                            <li class="link link-hover font-medium py-2" :class="{ 'text-primary': currentStep === 'summary'}" @click="selectStep('summary')">
                                {{ t('checkout.breadcrumb.summary') }}
                            </li>
                        </ul>
                    </div>

                    <!-- Checkout Flow -->
                    <div class="grid gap-8">
                        <FoundationHeadline
                            v-if="currentStep === 'summary' || currentStep === 'checkout'"
                            tag="h1"
                            class="space-y-6 text-xl pr-2"
                            :text="currentStep === 'checkout' ? t('checkout.contact.title') : t('checkout.summary.title')"
                        />

                        <div class="space-y-6">
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

                                    <template v-if="user">
                                        <!-- Shipping Address Section -->
                                        <AccountAddress
                                            v-model="user.defaultShippingAddress"
                                            :title="$t('account.registration.shippingAddress')"
                                            field-prefix="billing"
                                            mode="embedded"
                                            hide-name-fields
                                            hide-company-fields
                                        />

                                        <!-- Different Shipping Address Checkbox -->
                                        <div class="flex items-center">
                                            <FoundationCheckbox
                                                id="checkout-different-shipping"
                                                v-model="billingSameAsShipping"
                                            />
                                            <FoundationLabel for="checkout-different-shipping" class="ml-2 text-sm">
                                                {{ $t('checkout.shipping.billingSameAsShipping') }}
                                            </FoundationLabel>
                                        </div>

                                        <!-- Billing Address Section -->
                                        <AccountAddress
                                            v-if="!billingSameAsShipping"
                                            v-model="user.defaultBillingAddress"
                                            :title="$t('account.registration.billingAddress')"
                                            field-prefix="billing"
                                            mode="embedded"
                                            hide-name-fields
                                            hide-company-fields
                                        />
                                    </template>
                                </ClientOnly>
                            </template>

                            <div v-if="currentStep !== 'checkout'" class="flex flex-col p-6 border border-border rounded-lg text-sm">
                                <div class="grid grid-cols-12 gap-2">
                                    <div class="col-span-6 md:col-span-3 order-1">
                                        {{ t('checkout.summary.contact.label') }}
                                    </div>
                                    <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                                        {{ user.email }}
                                    </div>
                                </div>
                                <div class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-border">
                                    <div class="col-span-6 md:col-span-3 order-1">
                                        {{ t('checkout.summary.shipping.label') }} <span v-if="billingSameAsShipping">/ {{ t('checkout.summary.billing.label') }}</span>
                                    </div>
                                    <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                                        <AccountAddressCard
                                            :address="user.defaultShippingAddress"
                                            hide-buttons
                                            class="border-0 pt-0 pl-0"
                                        />
                                    </div>
                                    <div class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start btn btn-small btn-outline" @click="selectStep('checkout')">
                                        {{ t('checkout.summary.contact.edit') }}
                                    </div>
                                </div>
                                <div v-if="!billingSameAsShipping" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-border">
                                    <div class="col-span-6 md:col-span-3 order-1">
                                        {{ t('checkout.summary.billing.label') }}
                                    </div>
                                    <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                                        <AccountAddressCard
                                            :address="user.defaultBillingAddress"
                                            hide-buttons
                                            class="border-0 pt-0 pl-0"
                                        />
                                    </div>
                                    <div class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start btn btn-small btn-outline" @click="selectStep('checkout')">
                                        {{ t('checkout.summary.contact.edit') }}
                                    </div>
                                </div>
                                <div v-if="currentStep === 'payment' || currentStep === 'summary'" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-border">
                                    <div class="col-span-6 md:col-span-3 order-1">
                                        {{ t('checkout.summary.shipping.name') }}
                                    </div>
                                    <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                                        {{ selectedShippingMethod.name }}
                                    </div>
                                    <div class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start btn btn-small btn-outline" @click="selectStep('shipping')">
                                        {{ t('checkout.summary.shipping.edit') }}
                                    </div>
                                </div>
                                <div v-if="currentStep === 'summary'" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-border">
                                    <div class="col-span-6 md:col-span-3 order-1">
                                        {{ t('checkout.summary.payment.label') }}
                                    </div>
                                    <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                                        {{ selectedPaymentMethod.name }}
                                    </div>
                                    <div class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start btn btn-small btn-outline" @click="selectStep('payment')">
                                        {{ t('checkout.summary.payment.edit') }}
                                    </div>
                                </div>
                            </div>

                            <ClientOnly>
                                <!-- Shipping Section -->
                                <CheckoutShipping v-if="!isVirtualCart" v-show="currentStep === 'shipping'" />
                            </ClientOnly>

                            <ClientOnly>
                                <!-- Payment Section -->
                                <CheckoutPayment v-show="currentStep === 'payment'" />
                            </ClientOnly>

                            <template v-if="currentStep === 'summary'">
                                <!-- Cart Summary with Totals -->
                                <div v-if="cart">
                                    <CartSummary
                                        :cart="cart"
                                        :show-checkout-button="false"
                                        :show-cart-button="false"
                                        class="p-2 rounded-lg"
                                    />
                                </div>
                                <fieldset class="fieldset">
                                    <FoundationLabel for="order-comment" class="sr-only label">
                                        {{ t('checkout.summary.comment.placeholder') }}
                                    </FoundationLabel>
                                    <!-- TODO - Add v-model properly -->
                                    <FoundationTextarea
                                        id="order-comment"
                                        class="textarea border border-border h-24"
                                        :placeholder="t('checkout.summary.comment.placeholder')"
                                    />
                                </fieldset>
                            </template>

                            <ClientOnly>
                                <Teleport to="#CheckoutNavigation">
                                    <div v-if="currentStep === 'checkout'" class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
                                        <FoundationLink to="/cart" class="link link-hover cursor-pointer order-2 lg:order-1">
                                            {{ t('checkout.navigation.back') }}
                                        </FoundationLink>
                                        <button
                                            class="btn btn-primary w-full order-1 lg:w-auto lg:order-2"
                                        >
                                            <span>{{ t('checkout.navigation.forward') }}</span>
                                        </button>
                                    </div>
                                    <div v-else class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
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
                                </Teleport>
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Right Column: Order Summary -->
        <div class="sidebar lg:col-span-5 order-1 lg:order-2 p-2 lg:px-16 lg:py-10 bg-base-300">
            <div class="flex flex-col lg:gap-4 w-full lg:max-w-md">
                <FoundationLink to="/" class="btn btn-ghost normal-case text-xl p-0">
                    <FoundationIcon name="logo" class="w-36" />
                </FoundationLink>
                <CheckoutSummary hideOrderButton />
            </div>
        </div>
    </div>
</template>