export const useCheckoutOverlay = () => {
    const showOverlay = useState<boolean>('checkout-overlay', () => false)

    const enableOverlay = () => {
        showOverlay.value = true
    }

    const disableOverlay = () => {
        showOverlay.value = false
    }

    return {
        showOverlay: readonly(showOverlay),
        enableOverlay,
        disableOverlay
    }
}