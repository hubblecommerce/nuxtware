import { useShopwareContext, useLocalePath, useInternationalization } from '#imports'

/**
 * Composable for handling payment processes
 * @public
 * @category Payment
 */
export function usePayment() {
    const { apiClient } = useShopwareContext()
    const localePath = useLocalePath()
    const { formatLink } = useInternationalization(localePath)

    /**
     * Handles payment for an order
     */
    async function handlePayment(orderId: string) {
        const finishUrl = formatLink(`/checkout/success/${orderId}`)
        const errorUrl = formatLink('/account/orders?error=payment')
        
        const response = await apiClient.invoke("handlePayment post /handle-payment", {
            body: {
                orderId,
                finishUrl,
                errorUrl,
            },
        })
        
        return {
            redirectUrl: response.data.redirectUrl,
            isSync: !response.data.redirectUrl,
        }
    }

    return {
        handlePayment,
    }
}