
<script setup lang="ts">
import  { getTranslatedProperty } from '@shopware/helpers'

import type { Schemas } from '#shopware'

type AddressData = Partial<Schemas['CustomerAddress']>

interface AccountAddressProps {
    modelValue?: AddressData
    title?: string
    fieldPrefix?: string
    mode?: 'create' | 'edit' | 'embedded'
    disabled?: boolean
    loading?: boolean
    showAdditionalFields?: boolean
    showActions?: boolean
    showCancel?: boolean
    hideNameFields?: boolean
    hideCompanyFields?: boolean
    showAccountTypeToggle?: boolean
}

interface AccountAddressEmits {
    (e: 'update:modelValue' | 'save', value: AddressData): void
    (e: 'cancel'): void
    (e: 'validation-change', isValid: boolean): void
}

const props = withDefaults(defineProps<AccountAddressProps>(), {
    modelValue: undefined,
    title: undefined,
    fieldPrefix: 'address',
    mode: 'embedded',
    disabled: false,
    loading: false,
    showAdditionalFields: false,
    showActions: false,
    showCancel: false,
    hideNameFields: false,
    hideCompanyFields: false,
    showAccountTypeToggle: false
})

const emit = defineEmits<AccountAddressEmits>()

// Composables
const { getCountries } = useCountries()
const { getSalutations } = useSalutations()
const { t } = useI18n()

// Local state for account type (only for addresses with showAccountTypeToggle)
const localAccountType = ref('private')

// Initialize address data
const addressData = reactive<AddressData>({
    id: '',
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
    phoneNumber: '',
    ...props.modelValue
})

// Computed
const countryOptions = computed(() => 
    getCountries.value.map(country => ({
        value: country.id,
        label: country.name
    }))
)

const selectedCountry = computed(() => 
    getCountries.value.find(country => country.id === addressData.countryId)
)

const countryStatesOptions = computed(() => {
    if (!selectedCountry.value?.states) return []
    
    return selectedCountry.value.states.map(state => ({
        value: state.id,
        label: state.name
    }))
})

const salutationOptions = computed(() => 
    getSalutations.value.map(salutation => ({
        value: salutation.id,
        label: getTranslatedProperty(salutation, 'displayName')
    }))
)

const accountTypeOptions = computed(() => [
    { value: 'private', label: t('account.private') },
    { value: 'business', label: t('account.business') }
])

const isBusinessAccount = computed(() => localAccountType.value === 'business')

const isValid = computed(() => {
    const requiredFields = [
        addressData.street,
        addressData.zipcode,
        addressData.city,
        addressData.countryId
    ]

    // Only include firstName/lastName in validation if name fields are visible
    if (!props.hideNameFields) {
        requiredFields.push(addressData.firstName, addressData.lastName, addressData.salutationId)
    }
    
    // Include company in validation if it's a business account and company fields are visible
    if (props.showAccountTypeToggle && isBusinessAccount.value && !props.hideCompanyFields) {
        requiredFields.push(addressData.company || '')
    }

    
    return requiredFields.every(field => field && field.trim().length > 0)
})

// Watch for changes and emit
watch(addressData, (newValue) => {
    emit('update:modelValue', { ...newValue })
}, { deep: true })

watch(isValid, (newValue) => {
    emit('validation-change', newValue)
}, { immediate: true })

// Clear state when country changes
watch(() => addressData.countryId, () => {
    addressData.countryStateId = ''
})

// Methods
const handleSave = () => {
    if (isValid.value && !props.disabled) {
        emit('save', { ...addressData })
    }
}

// Initialize with prop value
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        Object.assign(addressData, newValue)
    }
}, { immediate: true })
</script>

<template>
    <div class="space-y-4">
        <div v-if="title">
            <FoundationHeadline tag="h4" class="text-base font-medium mb-3">
                {{ title }}
            </FoundationHeadline>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Salutation -->
            <div v-show="!hideNameFields" class="md:col-span-2">
                <FoundationLabel :for="`${fieldPrefix}-salutation`" class="block mb-1">
                    {{ $t('form.salutation') }}
                </FoundationLabel>
                <FoundationSelect
                    :id="`${fieldPrefix}-salutation`"
                    v-model="addressData.salutationId"
                    :placeholder="$t('form.chooseSalutation')"
                    :options="salutationOptions"
                    :disabled="disabled"
                    name="salutation"
                    class="w-full"
                />
            </div>

            <!-- First Name -->
            <div v-show="!hideNameFields">
                <ComponentTextInput
                    :id="`${fieldPrefix}-first-name`"
                    v-model="addressData.firstName"
                    :label="$t('form.firstName')"
                    type="text"
                    :placeholder="$t('form.firstNamePlaceholder')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>

            <!-- Last Name -->
            <div v-show="!hideNameFields">
                <ComponentTextInput
                    :id="`${fieldPrefix}-last-name`"
                    v-model="addressData.lastName"
                    :label="$t('form.lastName')"
                    type="text"
                    :placeholder="$t('form.lastNamePlaceholder')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>

            <!-- Account Type (only for addresses with toggle) -->
            <div v-if="showAccountTypeToggle" class="md:col-span-2">
                <FoundationLabel :for="`${fieldPrefix}-account-type`" class="block" required>
                    {{ $t('account.accountType') }}
                </FoundationLabel>
                <FoundationSelect
                    :id="`${fieldPrefix}-account-type`"
                    v-model="localAccountType"
                    :placeholder="$t('account.accountType')"
                    :options="accountTypeOptions"
                    :disabled="disabled"
                    required
                    name="accountType"
                    class="w-full"
                />
            </div>

            <!-- Street Address -->
            <div class="md:col-span-2">
                <ComponentTextInput
                    :id="`${fieldPrefix}-street`"
                    v-model="addressData.street"
                    :label="$t('form.streetAddress')"
                    type="text"
                    :placeholder="$t('form.streetPlaceholder')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>

            <!-- Postal Code -->
            <div>
                <ComponentTextInput
                    :id="`${fieldPrefix}-postal-code`"
                    v-model="addressData.zipcode"
                    :label="$t('form.postalCode')"
                    type="text"
                    :placeholder="$t('form.postalCodePlaceholder')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>

            <!-- City -->
            <div>
                <ComponentTextInput
                    :id="`${fieldPrefix}-city`"
                    v-model="addressData.city"
                    :label="$t('form.city')"
                    type="text"
                    :placeholder="$t('form.cityPlaceholder')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>

            <!-- Country -->
            <div class="md:col-span-2">
                <FoundationLabel :for="`${fieldPrefix}-country`" class="block" required>
                    {{ $t('form.country') }}
                </FoundationLabel>
                <FoundationSelect
                    :id="`${fieldPrefix}-country`"
                    v-model="addressData.countryId"
                    :placeholder="$t('form.chooseCountry')"
                    :options="countryOptions"
                    :disabled="disabled"
                    required
                    name="country"
                    class="w-full"
                />
            </div>

            <!-- State/Province (if country has states) -->
            <div v-if="countryStatesOptions.length > 0" class="md:col-span-2">
                <FoundationLabel :for="`${fieldPrefix}-state`" class="block">
                    {{ $t('form.state') }}
                </FoundationLabel>
                <FoundationSelect
                    :id="`${fieldPrefix}-state`"
                    v-model="addressData.countryStateId"
                    :placeholder="$t('form.chooseState')"
                    :options="countryStatesOptions"
                    :disabled="disabled"
                    name="state"
                    class="w-full"
                />
            </div>

            <!-- Additional Address Line (optional) -->
            <div v-if="showAdditionalFields" class="md:col-span-2">
                <ComponentTextInput
                    :id="`${fieldPrefix}-additional`"
                    v-model="addressData.additionalAddressLine1"
                    :label="$t('form.additionalAddress')"
                    type="text"
                    :placeholder="$t('form.additionalAddressPlaceholder')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>

            <!-- Company (business accounts only) -->
            <div v-if="(showAccountTypeToggle && isBusinessAccount) || (!showAccountTypeToggle && showAdditionalFields && !hideCompanyFields)" class="md:col-span-2">
                <ComponentTextInput
                    :id="`${fieldPrefix}-company`"
                    v-model="addressData.company"
                    :label="$t('account.company')"
                    type="text"
                    :placeholder="$t('account.company')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>

            <!-- Department (business accounts only) -->
            <div v-if="(showAccountTypeToggle && isBusinessAccount) || (!showAccountTypeToggle && showAdditionalFields)" class="md:col-span-2">
                <ComponentTextInput
                    :id="`${fieldPrefix}-department`"
                    v-model="addressData.department"
                    :label="$t('account.department')"
                    type="text"
                    :placeholder="$t('account.department')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>

            <!-- Phone Number (optional) -->
            <div v-if="showAdditionalFields" class="md:col-span-2">
                <ComponentTextInput
                    :id="`${fieldPrefix}-phone`"
                    v-model="addressData.phoneNumber"
                    :label="$t('form.phone')"
                    type="tel"
                    :placeholder="$t('form.phonePlaceholder')"
                    :disabled="disabled"
                    size="md"
                    bordered
                />
            </div>
        </div>

        <!-- Actions (if not embedded) -->
        <div v-if="showActions" class="flex justify-between gap-3 pt-4">
            <FoundationButton
                v-if="showCancel"
                variant="outline"
                @click="$emit('cancel')"
            >
                {{ $t('form.cancel') }}
            </FoundationButton>

            <FoundationButton
                v-if="mode === 'edit'"
                color="primary"
                :loading="loading"
                :disabled="!isValid || disabled"
                @click="handleSave"
            >
                {{ $t('form.save') }}
            </FoundationButton>
            <FoundationButton
                v-if="mode === 'create'"
                color="primary"
                :loading="loading"
                :disabled="!isValid || disabled"
                @click="handleSave"
            >
                {{ $t('account.address.add') }}
            </FoundationButton>
        </div>
    </div>
</template>
