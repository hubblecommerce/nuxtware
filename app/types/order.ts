import type { Schemas } from '#shopware'

// Order component configuration types
export interface OrderComponentConfig {
    showExpandableDetails?: boolean
    availableActions?: OrderAction[]
    visibleSections?: OrderSection[]
    statusVariant?: 'badge' | 'text'
    actionsLayout?: 'horizontal' | 'vertical'
}

export type OrderAction = 
    | 'reorder' 
    | 'changePayment' 
    | 'cancelOrder' 
    | 'viewDetails'

export type OrderSection = 
    | 'documents' 
    | 'lineItems' 
    | 'summary' 
    | 'metadata'

// Order status types based on Shopware 6.7
export interface OrderStatusConfig {
    label: string
    colorClass: string
    textColorClass: string
    icon: string
}

export interface OrderState {
    technicalName: string
    displayName: string
    isPaymentNeeded: boolean
}

// Order line item types
export interface OrderLineItemDisplay {
    id: string
    label: string
    description?: string
    quantity: number
    unitPrice: number
    totalPrice: number
    image?: string
    productNumber?: string
    children?: OrderLineItemDisplay[]
}

// Order document types
export interface OrderDocumentDisplay {
    id: string
    type: string
    fileName: string
    createdAt: string
    downloadUrl: string
    icon: string
}

// Order summary types
export interface OrderSummaryData {
    orderDate: string
    orderNumber: string
    paymentMethod?: string
    shippingMethod?: string
    trackingCodes: string[]
    hasTrackingUrl: boolean
    shippingCosts: number
    taxes: OrderTax[]
    netTotal: number
    grossTotal: number
    isTaxFree: boolean
}

export interface OrderTax {
    rate: number
    amount: number
}

// Order address types (extending Shopware types)
export interface OrderAddressDisplay extends Schemas['OrderAddress'] {
    formattedAddress: string
}

// Order action event types
export interface OrderActionEvents {
    reorder: (orderId: string) => void
    changePayment: (orderId: string) => void
    cancelOrder: (orderId: string) => void
    viewDetails: (orderId: string) => void
}

// Order filter and sorting types
export interface OrderListFilter {
    status?: string[]
    dateFrom?: Date
    dateTo?: Date
    amountFrom?: number
    amountTo?: number
}

export interface OrderListSort {
    field: 'orderDate' | 'orderNumber' | 'amountTotal' | 'status'
    direction: 'asc' | 'desc'
}

// Order API response types
export interface OrderDetailsResponse {
    order: Schemas['Order']
    associations: {
        documents: boolean
        lineItems: boolean
        transactions: boolean
        deliveries: boolean
        addresses: boolean
    }
}

// Order composable return types
export interface UseOrderDetailsReturn {
    order: ComputedRef<Schemas['Order'] | undefined>
    isLoading: Ref<boolean>
    error: Ref<string | null>
    actions: {
        loadOrder: () => Promise<void>
        cancelOrder: () => Promise<void>
        changePayment: (paymentMethodId: string) => Promise<void>
        downloadDocument: (documentId: string) => Promise<void>
    }
}

// Order state constants
export const ORDER_STATES = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
} as const

export const PAYMENT_STATES = {
    OPEN: 'open',
    PAID: 'paid',
    FAILED: 'failed',
    REMINDED: 'reminded',
    UNCONFIRMED: 'unconfirmed',
    CANCELLED: 'cancelled'
} as const

export const DELIVERY_STATES = {
    OPEN: 'open',
    SHIPPED: 'shipped',
    PARTIALLY_SHIPPED: 'shipped_partially',
    CANCELLED: 'cancelled',
    RETURNED: 'returned'
} as const

// Helper types for component props
export type OrderStatusVariant = 'badge' | 'text'
export type OrderActionsLayout = 'horizontal' | 'vertical'
export type OrderSize = 'sm' | 'md' | 'lg'