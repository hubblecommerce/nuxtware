export interface UseCheckoutFlowOptions {
    // Step to navigate to after successful login or registration
    afterAuthStep?: 'checkout' | 'shipping' | 'payment' | 'summary'
    // Initial step when user is not logged in
    initialAuthStep?: 'login' | 'registration'
}

export function useCheckoutFlow(options: UseCheckoutFlowOptions = {}) {
    const { t } = useI18n()
    const { isLoggedIn, isGuestSession } = useUser()
    const { success } = useGlobalNotifications()
    const { refreshSessionContext } = useSessionContext()

    // Default options
    const {
        afterAuthStep = 'checkout',
        initialAuthStep = 'login'
    } = options

    // State for checkout flow
    const currentStep = ref<'checkout' | 'shipping' | 'payment' | 'summary'>('checkout')
    const contactSubStep = ref<'login' | 'registration'>(initialAuthStep)
    const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value)
    const isInitializing = ref(true)

    // Handler: Login Success
    const handleLoginSuccess = async () => {
        await refreshSessionContext()
        currentStep.value = afterAuthStep
        success(t('checkout.login.loginSuccess'))
    }

    // Handler: Registration Success
    const handleRegistrationSuccess = async () => {
        try {
            await refreshSessionContext()
            currentStep.value = afterAuthStep
            success(t('checkout.registration.registrationSuccess'))
        } catch (e) {
            console.error(e)
        }
    }

    // Handler: Switch to Login
    const handleSwitchToLogin = () => {
        contactSubStep.value = 'login'
    }

    // Handler: Switch to Registration
    const handleSwitchToRegistration = () => {
        contactSubStep.value = 'registration'
    }

    // Initialize on mount - MUST be called in component's onMounted
    const initializeCheckoutFlow = async () => {
        try {
            await refreshSessionContext()

            // If user is not logged in, show login/registration option
            if (!isUserSession.value) {
                contactSubStep.value = initialAuthStep
            }
        } catch (error) {
            console.warn('Failed to refresh session context:', error)
            contactSubStep.value = initialAuthStep
        } finally {
            isInitializing.value = false
        }
    }

    return {
        // State
        currentStep,
        contactSubStep,
        isUserSession,
        isInitializing,

        // Handlers
        handleLoginSuccess,
        handleRegistrationSuccess,
        handleSwitchToLogin,
        handleSwitchToRegistration,

        // Initialization
        initializeCheckoutFlow
    }
}