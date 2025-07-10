<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const { t } = useI18n()
const { isAuthorized, isChecking } = useAuthGuard()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

const { addProducts } = useCart()
const { success, error: errorNotification } = useGlobalNotifications()

const {
    orders,
    loadOrders,
    totalPages,
    currentPage,
    limit,
} = useCustomerOrders()

useHead({
    title:  t('orders.title'),
    meta: [
        {
            name: t('orders.description'),
            content: 'View your order history, track shipments, and manage returns.'
        }
    ]
})

useBreadcrumbs([
    {
        name: t('breadcrumbs.accountOverview'),
        path: '/account'
    },
    {
        name: t('breadcrumbs.orders'),
        path: '/account/orders'
    }
])

// Pagination settings
const defaultLimit = 15
const defaultPage = 1
const isLoadingOrders = ref(false)

// Initialize limit from query params
limit.value = route.query.limit ? Number(route.query.limit) : defaultLimit

// Options for per-page selector
const limitOptions = computed(() => [
    { value: 1, label: `1 ${t('orders.order')}` },
    { value: 15, label: `15 ${t('orders.orders')}` },
    { value: 30, label: `30 ${t('orders.orders')}` },
    { value: 45, label: `45 ${t('orders.orders')}` }
])

// Load orders function
const loadOrdersData = async () => {
    isLoadingOrders.value = true
    try {
        await loadOrders({
            limit: limit.value,
            page: route.query.p ? Number(route.query.p) : defaultPage,
            checkPromotion: true,
            associations: {
                stateMachineState: {},
                lineItems: {}
            },
            sort: [
                {
                    field: 'createdAt',
                    order: 'DESC',
                },
            ],
        })
    } finally {
        isLoadingOrders.value = false
    }
}

/**
 * Handle orders per page limit change
 * 
 * Debouncing is necessary here to prevent multiple API calls when changing the limit.
 * Without debouncing, the following sequence causes duplicate API requests:
 * 1. FoundationSelect v-model updates limit.value
 * 2. @change event triggers this function
 * 3. router.push() updates URL query parameters
 * 4. Route change may trigger reactive effects in Nuxt
 * 5. loadOrdersData() makes explicit API call
 * 
 * The 100ms debounce ensures only one API call is made by preventing
 * rapid successive executions during the route update process.
 */
const changeLimit = useDebounceFn(async () => {
    await router.push({
        query: {
            ...route.query,
            p: defaultPage,
            limit: limit.value.toString(),
        },
    })
    await loadOrdersData()
}, 100)

// Handle page change
const changePage = async (page: number) => {
    await router.push({
        query: {
            ...route.query,
            p: page,
        },
    })
    await loadOrdersData()
}

// Load orders on component mount
onMounted(() => {
    loadOrdersData()
})

// Handle reorder functionality
const handleReorder = async (orderId: string) => {
    try {
        // 1. Find the order
        const order = orders.value?.find(o => o.id === orderId)
        if (!order?.lineItems?.length) return

        // 2. Extract products from order line items
        const cartItems = order.lineItems
            .filter(item => item.type === 'product' && item.referencedId)
            .map(item => ({
                id: item.referencedId, // Use referencedId for cart
                quantity: item.quantity,
                type: 'product'
            }))

        if (cartItems.length === 0) return

        // 3. Add items to cart
        await addProducts(cartItems)

        success(t('orders.reorderSuccess', { count: cartItems.length }))

        // TODO: Open cart sidenav to show items were added
    } catch (error) {
        console.error(error)
        errorNotification(t('orders.reorderError'))
    }
}
</script>

<template>
    <ClientOnly>
        <!-- Loading state while checking auth -->
        <div v-if="isChecking" class="lg:container mx-auto px-2 py-8">
            <div class="animate-pulse">
                <div class="h-8 bg-gray-200 rounded mb-6 w-48" />
                <div class="h-4 bg-gray-200 rounded w-64" />
            </div>
        </div>
        
        <!-- Protected content (only shows when authorized) -->
        <div v-else-if="isAuthorized" class="lg:container mx-auto px-2 py-8">
            <LayoutBreadcrumb />

            <!-- Page Header -->
             <div class="mb-8">
                <FoundationHeadline tag="h1" class="text-2xl md:text-3xl font-bold text-primary mb-4">
                    {{ $t('orders.title') }}
                </FoundationHeadline>
                <p class="text-muted-foreground text-lg">
                    {{ $t('orders.welcome') }}
                </p>
            </div>
            
            <!-- Loading Skeletons -->
            <div v-if="isLoadingOrders" class="space-y-4 mb-8">
                <div v-for="i in 3" :key="i" class="border border-border rounded-lg p-4 md:p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div class="space-y-2">
                            <ComponentSkeleton preset="text" width="6rem" height="1rem" />
                            <ComponentSkeleton preset="text" width="8rem" height="1.25rem" />
                        </div>
                        <div class="space-y-2">
                            <ComponentSkeleton preset="text" width="5rem" height="1rem" />
                            <ComponentSkeleton preset="text" width="6rem" height="1.25rem" />
                        </div>
                        <div class="space-y-2">
                            <ComponentSkeleton preset="text" width="4rem" height="1rem" />
                            <ComponentSkeleton preset="text" width="5rem" height="1.25rem" />
                        </div>
                        <div class="space-y-2">
                            <ComponentSkeleton preset="text" width="3.5rem" height="1rem" />
                            <ComponentSkeleton preset="text" width="4.5rem" height="1.25rem" />
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-border">
                        <div class="flex gap-2">
                            <ComponentSkeleton preset="button" width="100%" height="2rem" />
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Orders Content -->
            <div v-else-if="orders && orders.length > 0">
                <!-- Orders List -->
                <div class="space-y-4 mb-8">
                    <AccountOrder
                        v-for="order in orders"
                        :key="order.id"
                        :order="order"
                        @reorder="handleReorder"
                    />
                </div>
                
                <!-- Pagination Controls -->
                <div v-if="totalPages > 0" class="flex flex-col lg:flex-row justify-between items-center gap-4 py-4 border-t border-border">
                    <!-- Pagination -->
                    <div class="flex justify-center">
                        <ComponentSimplePagination
                            :current-page="currentPage"
                            :total-pages="totalPages"
                            @page-change="changePage"
                        />
                    </div>
                    
                    <!-- Per Page Selector -->
                    <div class="flex items-center gap-2">
                        <FoundationLabel for="limit" class="text-sm font-medium">
                            {{ $t('orders.perPage') }}
                        </FoundationLabel>
                        <FoundationSelect
                            id="limit"
                            v-model="limit"
                            :options="limitOptions"
                            name="limitchoices"
                            size="small"
                            @change="changeLimit"
                        />
                    </div>
                </div>
            </div>
            
            <!-- Empty State -->
            <div v-else-if="!isLoadingOrders" class="text-center py-12">
                <div class="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                    <FoundationIcon name="package" class="w-full h-full" />
                </div>
                <FoundationHeadline level="h3" class="mb-2">
                    {{ $t('orders.noOrdersFound') }}
                </FoundationHeadline>
                <p class="text-muted-foreground mb-6">
                    {{ $t('orders.empty') }}
                </p>
                <FoundationLink :href="formatLink('/')" class="btn btn-default">
                    {{ $t('common.startShopping') }}
                </FoundationLink>
            </div>
        </div>
    </ClientOnly>
</template>