<script setup lang="ts">
import type { Schemas } from '#shopware'

interface AccountAddressModalProps {
    isOpen: boolean
    mode: 'create' | 'edit'
    address?: Schemas['CustomerAddress']
    loading?: boolean
}

interface AccountAddressModalEmits {
    (e: 'close'): void
    (e: 'save', address: Partial<Schemas['CustomerAddress']>): void
}

const props = withDefaults(defineProps<AccountAddressModalProps>(), {
    address: undefined,
    loading: false
})

const emit = defineEmits<AccountAddressModalEmits>()

const { t } = useI18n()

// Local state for form  
const addressData = ref<Partial<Schemas['CustomerAddress']> & { customerId?: string }>({
    firstName: '',
    lastName: '',
    street: '',
    zipcode: '',
    city: '',
    countryId: '',
    countryStateId: '',
    additionalAddressLine1: '',
    company: '',
    department: '',
    phoneNumber: ''
})
const isFormValid = ref(false)

// Initialize address data when modal opens or address changes
watch([() => props.isOpen, () => props.address], () => {
    if (props.isOpen) {
        if (props.mode === 'edit' && props.address) {
            // Convert CustomerAddress to form format
            Object.assign(addressData.value, {
                id: props.address.id,
                salutationId: props.address.salutationId || '',
                firstName: props.address.firstName || '',
                lastName: props.address.lastName || '',
                street: props.address.street || '',
                zipcode: props.address.zipcode || '',
                city: props.address.city || '',
                countryId: props.address.countryId || '',
                countryStateId: props.address.countryStateId || '',
                additionalAddressLine1: props.address.additionalAddressLine1 || '',
                company: props.address.company || '',
                department: props.address.department || '',
                phoneNumber: props.address.phoneNumber || ''
            })
        } else {
            // Reset for create mode
            Object.assign(addressData.value, {
                id: undefined,
                salutationId: '',
                firstName: '',
                lastName: '',
                street: '',
                zipcode: '',
                city: '',
                countryId: '',
                countryStateId: '',
                additionalAddressLine1: '',
                company: '',
                department: '',
                phoneNumber: ''
            })
        }
    }
}, { immediate: true })

const modalTitle = computed(() => {
    return props.mode === 'create' 
        ? t('account.address.add') 
        : t('account.address.edit')
})

const handleSave = (formData: Partial<Schemas['CustomerAddress']>) => {
    if (isFormValid.value && !props.loading) {
        emit('save', formData)
    }
}

const handleCancel = () => {
    emit('close')
}

const handleValidationChange = (valid: boolean) => {
    isFormValid.value = valid
}

const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
        handleCancel()
    }
}
</script>

<template>
    <!-- TODO: Replace with ComponentModal when created -->
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click="handleBackdropClick"
    >
        <!-- Modal Content -->
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-border">
                <FoundationHeadline level="h3" class="text-lg font-semibold">
                    {{ modalTitle }}
                </FoundationHeadline>
                <FoundationButton
                    variant="ghost"
                    size="small"
                    @click="handleCancel"
                >
                    <FoundationIcon name="x" class="w-4 h-4" />
                </FoundationButton>
            </div>
            
            <!-- Content -->
            <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div class="p-6">
                    <AccountAddress
                        v-model="addressData"
                        :mode="mode"
                        :loading="loading"
                        :show-actions="true"
                        :show-cancel="true"
                        :show-additional-fields="true"
                        @save="handleSave"
                        @cancel="handleCancel"
                        @validation-change="handleValidationChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>