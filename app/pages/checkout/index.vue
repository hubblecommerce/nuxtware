<script setup lang='ts'>
const { push } = useRouter()
const { isLoggedIn, isGuestSession, user, logout } = useUser()
const { refreshSessionContext } = useSessionContext()
const { isVirtualCart } = useCart()
const { success } = useGlobalNotifications()
const { t } = useI18n()

// State for checkout flow
const currentStep = ref<'login' | 'registration' | 'checkout'>('checkout')
const isInitializing = ref(true)
const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value)

// Event handlers
const handleLoginSuccess = async () => {
    await refreshSessionContext()
    currentStep.value = 'checkout'
    success(t('checkout.login.loginSuccess'))
}

const handleRegistrationSuccess = async () => {
    try {
        await refreshSessionContext()
        currentStep.value = 'checkout'
        success(t('checkout.registration.registrationSuccess'))
    } catch (e) {
        console.error(e)
    }
}

const handleOrderPlaced = async (orderId: string) => {
    await push(`/checkout/success/${orderId}`)
}

const handleOrderError = (error: string) => {
    // Error is already handled by the notification system in the component
    console.error('Order placement failed:', error)
}

const handleSwitchToLogin = () => {
    currentStep.value = 'login'
}

const handleSwitchToRegistration = () => {
    currentStep.value = 'registration'
}

const handleLogout = async () => {
    await logout()
    currentStep.value = 'login'
}

// Initialize on mount
onMounted(async () => {
    try {
        await refreshSessionContext()
        
        // If user is not logged in, show login/registration option
        if (!isUserSession.value) {
            currentStep.value = 'login'
        }
    } catch (error) {
        console.warn('Failed to refresh session context:', error)
        currentStep.value = 'login'
    } finally {
        isInitializing.value = false
    }
})
</script>

<template>
    <div class="min-h-screen bg-surface-secondary">
        <div class="lg:container mx-auto px-2 py-8">
            <div class="mx-auto">
                <!-- Page Header -->
                <div class="mb-8">
                    <FoundationHeadline level="h1" class="text-2xl font-bold text-primary mb-2">
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
                        <div v-else-if="currentStep === 'login'">
                            <CheckoutLogin
                                @login-success="handleLoginSuccess"
                                @switch-to-register="handleSwitchToRegistration"
                            />
                        </div>

                        <div v-else-if="currentStep === 'registration'">
                            <CheckoutRegistration
                                @registration-success="handleRegistrationSuccess"
                                @switch-to-login="handleSwitchToLogin"
                            />
                        </div>

                        <!-- User Info Section (when logged in) -->
                        <div v-else-if="isUserSession" class="p-6 border border-border rounded-lg bg-surface">
                            <div class="flex items-center justify-between">
                                <div>
                                    <FoundationHeadline level="h3" class="text-lg font-medium text-primary mb-1">
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