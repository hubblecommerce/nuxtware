<script setup lang="ts">
import type { Schemas } from '#shopware'

interface AccountAddressModalProps {
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

const modalController = useModal('account-address-modal')

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
watch([() => modalController.isOpen.value, () => props.address], () => {
    if (modalController.isOpen.value) {
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
    modalController.close()
    emit('close')
}

const handleValidationChange = (valid: boolean) => {
    isFormValid.value = valid
}

defineExpose({
    modalController
})
</script>

<template>
    <ComponentModal
        :controller="modalController"
        :modal-headline="modalTitle"
        :close-on-click-outside="true"
    >
        <div class="max-w-2xl w-full">
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
    </ComponentModal>
</template>