<script setup lang="ts">
import type { Schemas } from '#shopware'

definePageMeta({
    layout: 'checkout'
})

// =======================
// Composables
// =======================
const { t } = useI18n()
const { isVirtualCart, cart, refreshCart } = useCart()
const { error, success } = useGlobalNotifications()
const { selectedPaymentMethod, selectedShippingMethod, refreshSessionContext } = useSessionContext()
const { user, isLoggedIn, isGuestSession, userDefaultBillingAddress, userDefaultShippingAddress, logout } = useUser()
const { updateCustomerAddress, setDefaultCustomerShippingAddress, createCustomerAddress } = useAddress()
const showOverlay = useState<boolean>('checkout-overlay', () => false)

// =======================
// Reactive State
// =======================
// Checkout flow state
const currentStep = ref<'contact' | 'shipping' | 'payment' | 'summary'>('contact')
const contactSubStep = ref<'login' | 'registration'>('registration')
const isInitializing = ref(true)
const isUpdatingContact = ref(false)
// Explicitly control whether to show auth forms or user info + addresses
// Prevents flicker when AccountRegistration component updates session context
const showAuthForms = ref(false)

// Component refs
const registrationRef = ref<{
    submit: () => Promise<void>
    isFormValid: boolean
} | null>(null)

// Address form data
const shippingAddressFormData = ref<null | Schemas['CustomerAddress']>()
const billingAddressFormData = ref<null | Schemas['CustomerAddress']>()
const billingSameAsShipping = ref(true)
const isShippingAddressValid = ref(false)
const isBillingAddressValid = ref(false)

// Order summary data
const termsNotice = ref(false)
const policy = ref(false)
const orderComment = ref('')

// Payment component re-render key
const paymentMethodKey = ref(0)

// =======================
// Computed Properties
// =======================
const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value)

const isRegistrationFormValid = computed(() => {
    return registrationRef.value?.isFormValid ?? false
})

const canProceedToShipping = computed(() => {
    if (!user.value) return false

    // If billing same as shipping, only billing address needs to be valid
    if (billingSameAsShipping.value) {
        return isBillingAddressValid.value
    }

    // Otherwise both must be valid
    return isShippingAddressValid.value && isBillingAddressValid.value
})

// =======================
// Watchers
// =======================
watch(selectedShippingMethod, async (newValue, oldValue) => {
    // Only trigger if shipping method actually changed (not initial load)
    if (oldValue && newValue && newValue.id !== oldValue.id) {
        // Refresh session to get updated payment methods
        await refreshSessionContext()

        // Increment key to force payment component re-render
        paymentMethodKey.value++

        // Refresh cart to update totals with new shipping costs
        await refreshCart()
    }
})

// =======================
// Methods
// =======================
function updateAddressEditForms () {
    // Set status for billingSameAsShipping by comparing default address hashes
    // @ts-expect-error hash is not typed in shopware composables but exists in api
    billingSameAsShipping.value = userDefaultShippingAddress?.value?.hash === userDefaultBillingAddress?.value?.hash

    // Copy state of default addresses to be used for addressform components
    shippingAddressFormData.value = userDefaultShippingAddress?.value
    billingAddressFormData.value = userDefaultBillingAddress?.value
}

function selectStep (stepName: 'contact' | 'shipping' | 'payment' | 'summary'): void {
    // Prevent access to shipping, payment, and summary steps if user is not logged in or guest
    if ((stepName !== 'contact') && !isUserSession.value) {
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

async function onUpdateContact () {
    if (currentStep.value !== 'contact') return

    // If no user, handle registration
    if (!isUserSession.value && registrationRef.value) {
        await registrationRef.value.submit()
        updateAddressEditForms()
        // The registration-success event will handle the navigation
        return
    }

    // User exists - update addresses before proceeding
    isUpdatingContact.value = true
    try {
        // Validate addresses exist
        if (!billingAddressFormData?.value || !shippingAddressFormData?.value) {
            error(t('checkout.contact.addressRequired'))
            return
        }

        if (billingSameAsShipping.value) {
            await updateCustomerAddress(billingAddressFormData.value)

            // If shipping and default addresses are currently not the same address by id in the interface,
            // then set default billing address to shipping address id
            if (userDefaultShippingAddress?.value?.id !== userDefaultBillingAddress?.value?.id) {
                await setDefaultCustomerShippingAddress(billingAddressFormData.value.id)
            }
        }

        if (!billingSameAsShipping.value) {
            // If shipping and billing addresses are different addresses by id,
            // just update both
            if (userDefaultShippingAddress?.value?.id !== userDefaultBillingAddress?.value?.id) {
                await updateCustomerAddress(shippingAddressFormData.value)
                await updateCustomerAddress(billingAddressFormData.value)
            } else {
                // Otherwise, so both have same id
                // update billing (required and always set in registration)
                // create a new address and set it as default shipping
                await updateCustomerAddress(billingAddressFormData.value)
                const newAddress = await createCustomerAddress(shippingAddressFormData.value)
                await setDefaultCustomerShippingAddress(newAddress?.id)
            }
        }

        // Refresh session context to get updated user data with addresses
        await refreshSessionContext()
        updateAddressEditForms()

        // Navigate to shipping step
        currentStep.value = 'shipping'
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('checkout.contact.updateError')
        error(errorMessage)
    } finally {
        isUpdatingContact.value = false
    }
}

// =======================
// Auth Handlers
// =======================
async function handleLoginSuccess () {
    // Hide auth forms immediately to prevent flicker when session updates
    showAuthForms.value = false
    currentStep.value = 'shipping'

    await refreshSessionContext()
    updateAddressEditForms()
    success(t('checkout.login.loginSuccess'))
}

async function handleRegistrationSuccess () {
    try {
        // Hide auth forms immediately to prevent flicker when session updates
        showAuthForms.value = false
        currentStep.value = 'shipping'

        await refreshSessionContext()
        updateAddressEditForms()
        success(t('checkout.registration.registrationSuccess'))
    } catch (e) {
        console.error(e)
    }
}

function handleSwitchToLogin () {
    contactSubStep.value = 'login'
}

function handleSwitchToRegistration () {
    contactSubStep.value = 'registration'
}

async function handleLogout () {
    await logout()
    showAuthForms.value = true
    contactSubStep.value = 'login'
    currentStep.value = 'contact'
}

// =======================
// Lifecycle Hooks
// =======================
onMounted(async () => {
    // Disable overlay when page mounts (e.g., when user visits/revisits checkout)
    showOverlay.value = false

    try {
        await refreshSessionContext()

        // If user is not logged in, show auth forms
        if (!isUserSession.value) {
            showAuthForms.value = true
            contactSubStep.value = 'registration'
        } else {
            // User already logged in, show user info and address forms
            showAuthForms.value = false
        }
    } catch (error) {
        console.warn('Failed to refresh session context:', error)
        showAuthForms.value = true
        contactSubStep.value = 'registration'
    } finally {
        isInitializing.value = false
    }

    updateAddressEditForms()
})
</script>

<template>
    <div class="checkout-page flex flex-col gap-8">
        <!-- Breadcrumb -->
        <div class="w-full text-sm breadcrumbs mb-4">
            <ul class="flex items-center whitespace-nowrap overflow-x-scroll md:overflow-x-hidden">
                <li class="font-medium py-2">
                    <FoundationLink to="/cart">
                        {{ t('checkout.breadcrumb.cart') }}
                    </FoundationLink>
                </li>
                <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground shrink-0" />

                <li class="inline-flex items-center link link-hover font-medium py-2 cursor-pointer" :class="{ 'text-primary': currentStep === 'contact'}">
                    <FoundationButton class="font-medium px-0" size="small" @click="selectStep('contact')">
                        {{ t('checkout.breadcrumb.contact') }}
                    </FoundationButton>
                </li>
                <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground shrink-0" />

                <li class="inline-flex items-center link link-hover font-medium py-2 cursor-pointer" :class="{ 'text-primary': currentStep === 'shipping'}">
                    <FoundationButton class="font-medium px-0" size="small" @click="selectStep('shipping')">
                        {{ t('checkout.breadcrumb.shipping') }}
                    </FoundationButton>
                </li>
                <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground shrink-0" />

                <li class="inline-flex items-center link link-hover font-medium py-2 cursor-pointer" :class="{ 'text-primary': currentStep === 'payment'}">
                    <FoundationButton class="font-medium px-0" size="small" @click="selectStep('payment')">
                        {{ t('checkout.breadcrumb.payment') }}
                    </FoundationButton>
                </li>
                <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground shrink-0" />

                <li class="link link-hover font-medium py-2 cursor-pointer" :class="{ 'text-primary': currentStep === 'summary'}">
                    <FoundationButton class="font-medium px-0" size="small" @click="selectStep('summary')">
                        {{ t('checkout.breadcrumb.summary') }}
                    </FoundationButton>
                </li>
            </ul>
        </div>

        <!-- Checkout Flow -->
        <div class="grid gap-8">
            <FoundationHeadline
                v-if="currentStep === 'summary' || currentStep === 'contact'"
                tag="h1"
                class="space-y-6 text-xl pr-2"
                :text="currentStep === 'contact' ? t('checkout.contact.title') : t('checkout.summary.title')"
            />

            <div class="space-y-6">
                <template v-if="currentStep === 'contact'">
                    <ClientOnly>
                        <!-- Loading Placeholder -->
                        <div v-if="isInitializing" class="p-6 border border-border rounded-lg bg-surface">
                            <div class="animate-pulse">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <div class="h-5 bg-border rounded w-48 mb-2" />
                                        <div class="h-4 bg-border rounded w-32" />
                                    </div>
                                    <div class="h-8 bg-border rounded w-20" />
                                </div>
                            </div>
                        </div>

                        <template v-if="showAuthForms">
                            <!-- Login Section -->
                            <div v-show="contactSubStep === 'login'">
                                <AccountLogin
                                    @login-success="handleLoginSuccess()"
                                    @switch-to-register="handleSwitchToRegistration()"
                                />
                            </div>

                            <!-- Registration Section -->
                            <div v-show="contactSubStep === 'registration'">
                                <AccountRegistration
                                    ref="registrationRef"
                                    allow-guest
                                    hide-create-account-button
                                    @registration-success="handleRegistrationSuccess()"
                                    @switch-to-login="handleSwitchToLogin()"
                                />
                            </div>
                        </template>

                        <template v-else>
                            <!-- User Info Section (when logged in) -->
                            <div v-if="isUserSession" class="p-6 border border-border rounded-lg bg-surface">
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
                                        @click="handleLogout()"
                                    >
                                        {{ $t('checkout.logOut') }}
                                    </FoundationButton>
                                </div>
                            </div>

                            <template v-if="isUserSession">
                            <!-- Billing Address Section -->
                            <AccountAddress
                                v-if="billingAddressFormData"
                                v-model="billingAddressFormData"
                                :title="$t('account.registration.billingAddress')"
                                field-prefix="checkout-edit-billing"
                                mode="embedded"
                                hide-company-fields
                                @validation-change="isBillingAddressValid = $event"
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

                            <!-- Shipping Address Section -->
                            <AccountAddress
                                v-if="shippingAddressFormData && !billingSameAsShipping"
                                v-model="shippingAddressFormData"
                                :title="$t('account.registration.shippingAddress')"
                                field-prefix="checkout-edit-shipping"
                                mode="embedded"
                                hide-company-fields
                                @validation-change="isShippingAddressValid = $event"
                            />
                            </template>
                        </template>
                    </ClientOnly>
                </template>

                <div v-if="currentStep !== 'contact'" class="flex flex-col p-6 border border-border rounded-lg text-sm">
                    <div class="grid grid-cols-12 gap-2">
                        <div class="col-span-6 md:col-span-3 order-1">
                            {{ t('checkout.summary.contact.label') }}
                        </div>
                        <div v-if="user?.email" class="col-span-12 md:col-span-6 order-3 md:order-2">
                            {{ user.email }}
                        </div>
                    </div>
                    <div v-if="!billingSameAsShipping" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-border">
                        <div class="col-span-6 md:col-span-3 order-1">
                            {{ t('checkout.summary.billing.label') }}
                        </div>
                        <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                            <AccountAddressCard
                                v-if="user?.defaultBillingAddress"
                                :address="user.defaultBillingAddress"
                                hide-buttons
                                class="border-0 pt-0 pl-0"
                            />
                        </div>
                        <FoundationButton class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start btn btn-small btn-outline" @click="selectStep('contact')">
                            {{ t('checkout.summary.contact.edit') }}
                        </FoundationButton>
                    </div>
                    <div class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-border">
                        <div class="col-span-6 md:col-span-3 order-1">
                            {{ t('checkout.summary.shipping.label') }} <span v-if="billingSameAsShipping">/ {{ t('checkout.summary.billing.label') }}</span>
                        </div>
                        <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                            <AccountAddressCard
                                v-if="user?.defaultShippingAddress"
                                :address="user.defaultShippingAddress"
                                hide-buttons
                                class="border-0 pt-0 pl-0"
                            />
                        </div>
                        <FoundationButton
                            class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start btn btn-small btn-outline"
                            :aria-label="t('checkout.summary.contact.editLabel')"
                            @click="selectStep('contact')"
                        >
                            {{ t('checkout.summary.contact.edit') }}
                        </FoundationButton>
                    </div>
                    <div v-if="currentStep === 'payment' || currentStep === 'summary'" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-border">
                        <div class="col-span-6 md:col-span-3 order-1">
                            {{ t('checkout.summary.shipping.name') }}
                        </div>
                        <div v-if="selectedShippingMethod?.name" class="col-span-12 md:col-span-6 order-3 md:order-2">
                            {{ selectedShippingMethod.name }}
                        </div>
                        <FoundationButton
                            class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start btn btn-small btn-outline"
                            :aria-label="t('checkout.summary.shipping.editLabel')"
                            @click="selectStep('shipping')"
                        >
                            {{ t('checkout.summary.shipping.edit') }}
                        </FoundationButton>
                    </div>
                    <div v-if="currentStep === 'summary'" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-border">
                        <div class="col-span-6 md:col-span-3 order-1">
                            {{ t('checkout.summary.payment.label') }}
                        </div>
                        <div v-if="selectedPaymentMethod?.name" class="col-span-12 md:col-span-6 order-3 md:order-2">
                            {{ selectedPaymentMethod.name }}
                        </div>
                        <FoundationButton
                            class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start btn btn-small btn-outline"
                            :aria-label="t('checkout.summary.billing.editLabel')"
                            @click="selectStep('payment')"
                        >
                            {{ t('checkout.summary.payment.edit') }}
                        </FoundationButton>
                    </div>
                </div>

                <!-- Shipping Section -->
                <ClientOnly>
                    <CheckoutShipping v-if="!isVirtualCart" v-show="currentStep === 'shipping'" />
                </ClientOnly>

                <!-- Payment Section -->
                <ClientOnly>
                    <CheckoutPayment v-show="currentStep === 'payment'" :key="paymentMethodKey" />
                </ClientOnly>

                <!-- Cart Summary with Totals -->
                <template v-if="currentStep === 'summary'">
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
                        <FoundationTextarea
                            id="order-comment"
                            v-model="orderComment"
                            class="textarea border border-border h-24"
                            :placeholder="t('checkout.summary.comment.placeholder')"
                        />
                    </fieldset>
                    <FoundationLabel class="block cursor-pointer">
                        <FoundationCheckbox
                            v-model="termsNotice"
                            type="checkbox"
                            class="checkbox checkbox-primary mr-4"
                        />
                        <span class="mr-auto">
                            {{ $t('checkout.summary.termsNotice') }}
                            <FoundationLink href="/terms">
                                {{ $t('checkout.summary.termsLink') }}
                            </FoundationLink>
                        </span>
                    </FoundationLabel>

                    <FoundationLabel class="block cursor-pointer">
                        <FoundationCheckbox
                            v-model="policy"
                            type="checkbox"
                            class="checkbox checkbox-primary mr-4"
                        />
                        <span class="mr-auto">{{ t('checkout.summary.policy') }}</span>
                    </FoundationLabel>
                </template>

                <ClientOnly>
                    <Teleport to="#CheckoutNavigation">
                        <div v-if="currentStep === 'contact'" class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
                            <FoundationLink to="/cart" class="link link-hover cursor-pointer order-2 lg:order-1">
                                {{ t('checkout.navigation.back') }}
                            </FoundationLink>
                            <FoundationButton
                                class="btn btn-primary w-full order-1 lg:w-auto lg:order-2"
                                :class="{ 'btn-loading': isUpdatingContact }"
                                :disabled="isUpdatingContact || (isUserSession ? !canProceedToShipping : !isRegistrationFormValid)"
                                @click="onUpdateContact"
                            >
                                <span>{{ t('checkout.navigation.forward') }}</span>
                            </FoundationButton>
                        </div>
                        <div v-else class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
                            <FoundationButton v-if="currentStep === 'shipping'" class="link link-hover cursor-pointer order-2 lg:order-1" @click="selectStep('contact')">
                                {{ t('checkout.shipping.navigation.back') }}
                            </FoundationButton>
                            <FoundationButton v-if="currentStep === 'shipping'" class="btn btn-primary w-full order-1 lg:w-auto lg:order-2" @click="selectStep('payment')">
                                {{ t('checkout.shipping.navigation.forward') }}
                            </FoundationButton>

                            <FoundationButton v-if="currentStep === 'payment'" class="link link-hover cursor-pointer order-2 lg:order-1" @click="selectStep('shipping')">
                                {{ t('checkout.payment.navigation.back') }}
                            </FoundationButton>
                            <FoundationButton v-if="currentStep === 'payment'" class="btn btn-primary w-full order-1 lg:w-auto lg:order-2" @click="selectStep('summary')">
                                {{ t('checkout.payment.navigation.forward') }}
                            </FoundationButton>

                            <FoundationButton v-if="currentStep === 'summary'" class="link link-hover cursor-pointer order-2 lg:order-1" @click="selectStep('payment')">
                                {{ t('checkout.summary.navigation.back') }}
                            </FoundationButton>
                            <CheckoutPlaceOrder
                                v-if="currentStep === 'summary'"
                                :customer-comment="orderComment"
                                :disabled="!termsNotice || !policy"
                                class="btn btn-primary w-full order-1 lg:w-auto lg:order-2"
                            />
                        </div>
                    </Teleport>
                </ClientOnly>
            </div>
        </div>

        <!-- Overlay -->
        <Transition
            enter-active-class="transition-opacity duration-300"
            leave-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
        >
            <div
                v-if="showOverlay"
                class="fixed inset-0 z-50 min-h-screen flex items-center justify-center bg-gray-200/10 backdrop-blur-sm"
            >
                <div class="flex flex-col items-center gap-4 rounded-lg bg-background p-8 shadow-lg">
                    <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
                    <p class="text-lg font-medium text-foreground">
                        {{ $t('checkout.processingOrder') }}
                    </p>
                </div>
            </div>
        </Transition>
    </div>
</template>