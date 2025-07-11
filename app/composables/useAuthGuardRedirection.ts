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
        // Give a brief moment for auth state to potentially update after navigation
        const checkAuthWithDelay = async () => {
            // Small delay to allow for auth state updates after registration/login
            await new Promise(resolve => setTimeout(resolve, 150))
            
            if (!isLoggedIn.value) {
                // Use hard navigation to ensure page actually changes
                window.location.href = localePath(redirectTo)
            } else {
                // User is authenticated, allow content to show
                isAuthorized.value = true
            }
            isChecking.value = false
        }
        
        watch(
            isLoggedIn,
            async (loggedIn) => {
                if (!loggedIn) {
                    // Check with a small delay to handle post-registration timing
                    await checkAuthWithDelay()
                } else {
                    // User is authenticated, allow content to show immediately
                    isAuthorized.value = true
                    isChecking.value = false
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