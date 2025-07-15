<script setup lang="ts">
import type { Schemas } from '#shopware'

const { isAuthorized, isChecking } = useAuthGuard()
const { 
    customerAddresses, 
    loadCustomerAddresses, 
    createCustomerAddress, 
    updateCustomerAddress, 
    deleteCustomerAddress,
    setDefaultCustomerBillingAddress,
    setDefaultCustomerShippingAddress 
} = useAddress()
const { user, refreshUser } = useUser()
const { addNotification } = useGlobalNotifications()
const { t } = useI18n()

definePageMeta({
    title: 'account.nav.address',
    description: 'account.page.description'
})

useHead({
    title: 'Address Management',
    meta: [
        {
            name: 'description',
            content: 'Manage your billing and shipping addresses for faster checkout.'
        }
    ]
})

useBreadcrumbs([
    {
        name: t('breadcrumbs.accountOverview'),
        path: '/account'
    },
    {
        name: t('breadcrumbs.addresses'),
        path: '/account/address'
    }
])

const loading = ref(false)
const modalState = ref({
    isOpen: false,
    mode: 'create' as 'create' | 'edit',
    address: undefined as Schemas['CustomerAddress'] | undefined
})

const defaultBillingAddress = computed(() => {
    if (!user.value) return null
    return customerAddresses.value.find(addr => addr.id === user.value?.defaultBillingAddressId) || null
})

const defaultShippingAddress = computed(() => {
    if (!user.value) return null
    return customerAddresses.value.find(addr => addr.id === user.value?.defaultShippingAddressId) || null
})

const otherAddresses = computed(() => {
    return customerAddresses.value.filter(addr => 
        addr.id !== user.value?.defaultBillingAddressId && 
        addr.id !== user.value?.defaultShippingAddressId
    )
})

const loadAddresses = async () => {
    loading.value = true
    try {
        await loadCustomerAddresses()
    } catch (error) {
        console.error('Failed to load addresses:', error)
        addNotification({
            type: 'error',
            message: t('account.address.loadError')
        })
    } finally {
        loading.value = false
    }
}

const openCreateModal = () => {
    modalState.value = {
        isOpen: true,
        mode: 'create',
        address: undefined
    }
}

const openEditModal = (address: Schemas['CustomerAddress']) => {
    modalState.value = {
        isOpen: true,
        mode: 'edit',
        address
    }
}

const closeModal = () => {
    modalState.value.isOpen = false
}

const handleSave = async (formData: Partial<Schemas['CustomerAddress']>) => {
    loading.value = true
    try {
        if (modalState.value.mode === 'create') {
            await createCustomerAddress(formData as Schemas['CustomerAddress'])
            addNotification({
                type: 'success',
                message: t('account.address.createSuccess')
            })
        } else if (modalState.value.mode === 'edit') {
            await updateCustomerAddress({ ...formData, id: modalState.value.address?.id } as Schemas['CustomerAddress'])
            addNotification({
                type: 'success',
                message: t('account.address.updateSuccess')
            })
        }
        closeModal()
        await loadAddresses()
    } catch (error) {
        console.error('Failed to save address:', error)
        addNotification({
            type: 'error',
            message: modalState.value.mode === 'create' 
                ? t('account.address.createError')
                : t('account.address.updateError')
        })
    } finally {
        loading.value = false
    }
}

const handleDelete = async (addressId: string) => {
    if (!confirm(t('account.address.confirmDelete'))) return
    
    loading.value = true
    try {
        await deleteCustomerAddress(addressId)
        addNotification({
            type: 'success',
            message: t('account.address.deleteSuccess')
        })
        await loadAddresses()
    } catch (error) {
        console.error('Failed to delete address:', error)
        addNotification({
            type: 'error',
            message: t('account.address.deleteError')
        })
    } finally {
        loading.value = false
    }
}

const handleSetDefaultBilling = async (addressId: string) => {
    loading.value = true
    try {
        await setDefaultCustomerBillingAddress(addressId)
        addNotification({
            type: 'success',
            message: t('account.address.setDefaultBillingSuccess')
        })
        await Promise.all([loadAddresses(), refreshUser()])
    } catch (error) {
        console.error('Failed to set default billing address:', error)
        addNotification({
            type: 'error',
            message: t('account.address.setDefaultBillingError')
        })
    } finally {
        loading.value = false
    }
}

const handleSetDefaultShipping = async (addressId: string) => {
    loading.value = true
    try {
        await setDefaultCustomerShippingAddress(addressId)
        addNotification({
            type: 'success',
            message: t('account.address.setDefaultShippingSuccess')
        })
        await Promise.all([loadAddresses(), refreshUser()])
    } catch (error) {
        console.error('Failed to set default shipping address:', error)
        addNotification({
            type: 'error',
            message: t('account.address.setDefaultShippingError')
        })
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadAddresses()
})
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

            <div class="flex items-center justify-between mb-6">
                <FoundationHeadline tag="h1" class="text-2xl md:text-3xl font-bold mb-4">
                    {{ $t('account.nav.address') }}
                </FoundationHeadline>
                <FoundationButton
                    color="primary"
                    :disabled="loading"
                    @click="openCreateModal"
                >
                    <FoundationIcon name="plus" class="w-4 h-4 mr-2" />
                    {{ $t('account.address.add') }}
                </FoundationButton>
            </div>
            
            <!-- Default Addresses Section -->
            <div v-if="defaultBillingAddress || defaultShippingAddress" class="mb-8">
                <FoundationHeadline tag="h2" class="text-lg font-medium mb-4">
                    {{ $t('account.address.defaultAddresses') }}
                </FoundationHeadline>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Default Billing Address -->
                    <div>
                        <FoundationHeadline tag="h3" class="text-base font-medium mb-3">
                            {{ $t('account.defaultBillingAddressHeader') }}
                        </FoundationHeadline>
                        <AccountAddressCard
                            v-if="defaultBillingAddress"
                            :address="defaultBillingAddress"
                            :is-default-billing="true"
                            :can-delete="false"
                            :loading="loading"
                            @edit="openEditModal"
                            @delete="handleDelete"
                            @set-default-billing="handleSetDefaultBilling"
                            @set-default-shipping="handleSetDefaultShipping"
                        />
                        <div v-else class="border border-dashed border-border rounded-lg p-6 text-center">
                            {{ $t('account.noDefaultBillingAddress') }}
                        </div>
                    </div>
                    
                    <!-- Default Shipping Address -->
                    <div>
                        <FoundationHeadline tag="h3" class="text-base font-medium mb-3">
                            {{ $t('account.defaultShippingAddressHeader') }}
                        </FoundationHeadline>
                        <AccountAddressCard
                            v-if="defaultShippingAddress"
                            :address="defaultShippingAddress"
                            :is-default-shipping="true"
                            :can-delete="false"
                            :loading="loading"
                            @edit="openEditModal"
                            @delete="handleDelete"
                            @set-default-billing="handleSetDefaultBilling"
                            @set-default-shipping="handleSetDefaultShipping"
                        />
                        <div v-else class="border border-dashed border-border rounded-lg p-6 text-center">
                            {{ $t('account.noDefaultShippingAddress') }}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Other Addresses Section -->
            <div v-if="otherAddresses.length > 0" class="mb-8">
                <FoundationHeadline level="h2" class="text-lg font-medium mb-4">
                    {{ $t('account.address.otherAddresses') }}
                </FoundationHeadline>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AccountAddressCard
                        v-for="address in otherAddresses"
                        :key="address.id"
                        :address="address"
                        :loading="loading"
                        @edit="openEditModal"
                        @delete="handleDelete"
                        @set-default-billing="handleSetDefaultBilling"
                        @set-default-shipping="handleSetDefaultShipping"
                    />
                </div>
            </div>
            
            <!-- No Addresses Message -->
            <div v-if="!loading && customerAddresses.length === 0" class="text-center py-12">
                <FoundationIcon name="map-pin" class="w-12 h-12 mx-auto mb-4" />
                <FoundationHeadline level="h3" class="text-lg font-medium mb-2">
                    {{ $t('account.address.noAddresses') }}
                </FoundationHeadline>
                <p class="mb-6">
                    {{ $t('account.address.noAddressesDescription') }}
                </p>
                <FoundationButton
                    color="primary"
                    @click="openCreateModal"
                >
                    <FoundationIcon name="plus" class="w-4 h-4 mr-2" />
                    {{ $t('account.address.addFirst') }}
                </FoundationButton>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading && customerAddresses.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ComponentSkeleton
                    v-for="i in 3" 
                    :key="i"
                    class="border border-border rounded-lg p-4"
                    height="200px"
                />
            </div>
        </div>
        
        <!-- Address Modal -->
        <AccountAddressModal
            :is-open="modalState.isOpen"
            :mode="modalState.mode"
            :address="modalState.address"
            :loading="loading"
            @close="closeModal"
            @save="handleSave"
        />
    </ClientOnly>
</template>