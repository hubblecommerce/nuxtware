<script setup lang="ts">
import type { Schemas } from '#shopware'

interface AccountAddressCardProps {
    address: Schemas['CustomerAddress']
    isDefaultBilling?: boolean
    isDefaultShipping?: boolean
    canDelete?: boolean
    loading?: boolean
    countries?: Schemas['Country'][],
    hideButtons?: boolean
}

interface AccountAddressCardEmits {
    (e: 'edit', address: Schemas['CustomerAddress']): void
    (e: 'delete' | 'set-default-billing' | 'set-default-shipping', addressId: string): void
}

const props = withDefaults(defineProps<AccountAddressCardProps>(), {
    isDefaultBilling: false,
    isDefaultShipping: false,
    canDelete: true,
    loading: false,
    countries: () => [],
    hideButtons: false
})

const emit = defineEmits<AccountAddressCardEmits>()
const { getSalutations } = useSalutations()

const getSalutationDisplay = (salutationId: string | undefined) => {
    if (!salutationId) return ''
    const salutation = getSalutations.value.find(s => s.id === salutationId)

    return salutation?.translated?.displayName || salutation?.displayName
}

const formattedAddress = computed(() => {
    const { address } = props
    if (!address) return ''

    const salutation = getSalutationDisplay(address.salutationId)

    // Build formatted address string
    const parts = []

    if(salutation) {
        parts.push(salutation)
    }
    
    if (address.firstName || address.lastName) {
        parts.push(`${address.firstName || ''} ${address.lastName || ''}`.trim())
    }
    
    if (address.company) {
        parts.push(address.company)
    }
    
    if (address.street) {
        parts.push(address.street)
    }
    
    if (address.additionalAddressLine1) {
        parts.push(address.additionalAddressLine1)
    }
    
    if (address.zipcode || address.city) {
        const cityLine = `${address.zipcode || ''} ${address.city || ''}`.trim()
        if (cityLine) parts.push(cityLine)
    }
    
    if (address.country?.name) {
        parts.push(address.country.name)
    }
    
    if (address.countryState?.name) {
        parts.push(address.countryState.name)
    }

    return parts.join('\n')
})

const isShippingAvailable = computed(() => {
    // TODO: Implement shipping availability check
    // This would need to check if the country supports shipping
    // For now, assume all countries support shipping
    return true
})

const handleEdit = () => {
    emit('edit', props.address)
}

const handleDelete = () => {
    if (props.canDelete && !props.loading) {
        emit('delete', props.address.id)
    }
}

const handleSetDefaultBilling = () => {
    if (!props.isDefaultBilling && !props.loading) {
        emit('set-default-billing', props.address.id)
    }
}

const handleSetDefaultShipping = () => {
    if (!props.isDefaultShipping && !props.loading && isShippingAvailable.value) {
        emit('set-default-shipping', props.address.id)
    }
}
</script>

<template>
    <div class="border border-border rounded-lg p-4 space-y-4">
        <!-- Address Content -->
        <div class="space-y-3">
            <!-- Default Address Badges -->
            <div v-if="isDefaultBilling || isDefaultShipping" class="flex flex-wrap gap-2">
                <div v-if="isDefaultBilling" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <FoundationIcon name="file" class="w-3 h-3 mr-1" />
                    {{ $t('account.address.defaultBilling') }}
                </div>
                <div v-if="isDefaultShipping" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    <FoundationIcon name="truck" class="w-3 h-3 mr-1" />
                    {{ $t('account.address.defaultShipping') }}
                </div>
            </div>
            
            <!-- Shipping Warning -->
            <div v-if="!isShippingAvailable" class="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
                <FoundationIcon name="triangle-alert" class="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <p class="text-sm text-warning">
                    {{ $t('account.address.shippingNotAvailable') }}
                </p>
            </div>
            
            <!-- Formatted Address -->
            <div class="whitespace-pre-line text-sm text-foreground">
                {{ formattedAddress }}
            </div>
        </div>
        
        <!-- Actions -->
        <div v-if="!hideButtons" class="flex flex-wrap gap-2 pt-2 border-t border-border">
            <!-- Edit Button -->
            <FoundationButton
                variant="outline"
                size="small"
                :disabled="loading"
                @click="handleEdit"
            >
                <FoundationIcon name="pencil" class="w-4 h-4 mr-2" />
                {{ $t('account.address.edit') }}
            </FoundationButton>
            
            <!-- Delete Button -->
            <FoundationButton
                v-if="canDelete"
                variant="outline"
                size="small"
                :disabled="loading"
                @click="handleDelete"
            >
                <FoundationIcon name="trash" class="w-4 h-4 mr-2" />
                {{ $t('account.address.delete') }}
            </FoundationButton>
            
            <!-- Set Default Billing -->
            <FoundationButton
                v-if="!isDefaultBilling"
                variant="ghost"
                size="small"
                :disabled="loading"
                @click="handleSetDefaultBilling"
            >
                <FoundationIcon name="file" class="w-4 h-4 mr-2" />
                {{ $t('account.address.setDefaultBilling') }}
            </FoundationButton>
            
            <!-- Set Default Shipping -->
            <FoundationButton
                v-if="!isDefaultShipping && isShippingAvailable"
                variant="ghost"
                size="small"
                :disabled="loading"
                @click="handleSetDefaultShipping"
            >
                <FoundationIcon name="truck" class="w-4 h-4 mr-2" />
                {{ $t('account.address.setDefaultShipping') }}
            </FoundationButton>
        </div>
    </div>
</template>