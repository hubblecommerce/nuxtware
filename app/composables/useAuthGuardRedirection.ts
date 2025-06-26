/**
 * Enhanced auth guard that works reliably with Shopware composables.
 * Must be called within Vue component context. Provides both auth checking and content protection.
 */
export function useAuthGuard(redirectTo: string = '/') {
    // Get auth state (only available in Vue component context)
    const { isLoggedIn } = useUser()
    const localePath = useLocalePath()
    
    // Reactive state for controlling content visibility
    const isAuthorized = ref(false)
    const isChecking = ref(true)
    
    // Client-side auth check and redirect
    if (import.meta.client) {
        watch(
            isLoggedIn,
            async (loggedIn) => {
                isChecking.value = false
                
                if (!loggedIn) {
                    // Use hard navigation to ensure page actually changes
                    window.location.href = localePath(redirectTo)
                } else {
                    // User is authenticated, allow content to show
                    isAuthorized.value = true
                }
            },
            { immediate: true }
        )
    }
    
    return {
        isAuthorized: readonly(isAuthorized),
        isChecking: readonly(isChecking),
        isLoggedIn: readonly(isLoggedIn)
    }
}