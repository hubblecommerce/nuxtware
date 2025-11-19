<script setup lang="ts">
import type { RequestParameters, Schemas } from '#shopware'
import { ApiClientError } from '@shopware/api-client'

interface AccountRegistrationProps {
    disabled?: boolean
    allowGuest?: boolean,
    hideCreateAccountButton?: boolean
}

interface AccountRegistrationEmits {
    (e: 'registration-success', response?: Schemas['Customer']): void
    (e: 'switch-to-login'): void
}

const props = withDefaults(defineProps<AccountRegistrationProps>(), {
    disabled: false,
    allowGuest: false,
    hideCreateAccountButton: false
})

const emit = defineEmits<AccountRegistrationEmits>()

// Composables
const { register } = useUser()
const { getSalutations } = useSalutations()
const { resolveApiErrors } = useApiErrorsResolver()
const { error } = useGlobalNotifications()
const { t } = useI18n()

// State
const isLoading = ref(false)
const isAddressValid = ref(false) // Address is always required
const isDifferentShipping = ref(false)
const isShippingAddressValid = ref(false)

const formData = reactive<RequestParameters<'register'>>({
    salutationId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    guest: false,
    accountType: 'private',
    company: '',
    vatIds: '',
    billingAddress: {
        firstName: '',
        lastName: '',
        street: '',
        zipcode: '',
        city: '',
        countryId: '',
        countryStateId: '',
        company: '',
        department: '',
    },
    acceptedDataProtection: false,
    storefrontUrl: '',
})

// Computed
const salutationOptions = computed(() => 
    getSalutations.value.map(salutation => ({
        value: salutation.id,
        label: salutation.displayName
    }))
)

const accountTypeOptions = computed(() => [
    { value: 'private', label: t('account.private') },
    { value: 'business', label: t('account.business') }
])

const isBusinessAccount = computed(() => formData.accountType === 'business')

const isFormValid = computed(() => {
    const requiredPersonalFields = [
        formData.salutationId,
        formData.firstName,
        formData.lastName,
        formData.email,
    ]

    // Add business fields validation when account type is business
    if (isBusinessAccount.value) {
        requiredPersonalFields.push(formData.company, formData.vatIds)
    }

    const allPersonalFieldsFilled = requiredPersonalFields.every(field => field.trim().length > 0)
    const passwordValid = (formData.guest && props.allowGuest) || formData.password.length > 0
    const dataProtectionAccepted = formData.acceptedDataProtection
    const shippingValid = !isDifferentShipping.value || isShippingAddressValid.value

    return allPersonalFieldsFilled && 
           passwordValid && 
           dataProtectionAccepted && 
           isAddressValid.value && 
           shippingValid && 
           !isLoading.value
})

// Watch personal info changes and auto-populate address names
watch([() => formData.firstName, () => formData.lastName], ([firstName, lastName]) => {
    // Auto-populate billing address names
    formData.billingAddress.firstName = firstName || ''
    formData.billingAddress.lastName = lastName || ''
    
    // Auto-populate shipping address names if different shipping is enabled
    if (isDifferentShipping.value && formData.shippingAddress) {
        formData.shippingAddress.firstName = firstName || ''
        formData.shippingAddress.lastName = lastName || ''
    }
}, { immediate: true })

// Watch company changes and auto-populate billing address company
watch(() => formData.company, (company) => {
    formData.billingAddress.company = company || ''
    
    // Auto-populate shipping address company if different shipping is enabled
    if (isDifferentShipping.value && formData.shippingAddress) {
        formData.shippingAddress.company = company || ''
    }
}, { immediate: true })

// Watch different shipping toggle
watch(isDifferentShipping, (isDifferent) => {
    if (isDifferent) {
        // Initialize shipping address with personal info
        formData.shippingAddress = {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            street: '',
            zipcode: '',
            city: '',
            countryId: '',
            countryStateId: '',
            company: formData.company || '',
            department: '',
        }
    } else {
        delete formData.shippingAddress
    }
})

// Methods
const onAddressValidationChange = (valid: boolean) => {
    isAddressValid.value = valid
}

const onShippingAddressValidationChange = (valid: boolean) => {
    isShippingAddressValid.value = valid
}

const handleSubmit = async () => {
    if (!isFormValid.value || props.disabled) return

    isLoading.value = true

    try {
        // Ensure storefrontUrl is set for the registration
        formData.storefrontUrl = window.location.origin

        // Convert vatIds string to array for API
        const registrationData = { ...formData }
        if (isBusinessAccount.value && formData.vatIds) {
            registrationData.vatIds = [formData.vatIds]
        }

        const response = await register(registrationData)
        
        // For guest checkout, we should proceed regardless of account activation
        // For regular registration, we should also proceed as the user is now registered
        if (response) {
            emit('registration-success', response)
        }
    } catch (apiError) {
        if (apiError instanceof ApiClientError) {
            const errorMessages = resolveApiErrors(apiError.details.errors)
            error(errorMessages.join(', ') || t('account.registration.unknownError'))
        } else {
            error(apiError instanceof Error ? apiError.message : t('account.registration.unknownError'))
        }
    } finally {
        isLoading.value = false
    }
}

// Expose the submit method and form validation state so parent can access them
defineExpose({
    submit: handleSubmit,
    isFormValid
})
</script>

<template>
    <ComponentFieldset
        :headline="$t('account.registration.title')"
        :description="$t('account.registration.description')"
    >
        <FoundationButton
            type="button"
            variant="outline"
            @click="$emit('switch-to-login')"
        >
            {{ $t('account.registration.alreadyHaveAccount') }}
        </FoundationButton>

        <form @submit.prevent="handleSubmit">
            <div class="space-y-6">
                <!-- Personal Information Section -->
                <div>
                    <FoundationHeadline tag="h4" class="text-base font-medium mb-3">
                        {{ $t('account.personalInformationLabel') }}
                    </FoundationHeadline>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Salutation -->
                        <div class="md:col-span-2">
                            <FoundationLabel for="registration-salutation" class="block" required>
                                {{ $t('form.salutation') }}
                            </FoundationLabel>
                            <FoundationSelect
                                id="registration-salutation"
                                v-model="formData.salutationId"
                                :placeholder="$t('form.chooseSalutation')"
                                :options="salutationOptions"
                                :disabled="isLoading"
                                required
                                name="salutation"
                                class="w-full"
                            />
                        </div>

                        <!-- First Name -->
                        <ComponentTextInput
                            id="registration-first-name"
                            v-model="formData.firstName"
                            :label="$t('form.firstName')"
                            type="text"
                            :placeholder="$t('form.firstNamePlaceholder')"
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />

                        <!-- Last Name -->
                        <ComponentTextInput
                            id="registration-last-name"
                            v-model="formData.lastName"
                            :label="$t('form.lastName')"
                            type="text"
                            :placeholder="$t('form.lastNamePlaceholder')"
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />

                        <!-- Email -->
                        <ComponentTextInput
                            id="registration-email"
                            v-model="formData.email"
                            :label="$t('form.email')"
                            type="email"
                            :placeholder="$t('form.emailPlaceholder')"
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />

                        <!-- Password (only if not guest) -->
                        <ComponentTextInput
                            v-if="!formData.guest"
                            id="registration-password"
                            v-model="formData.password"
                            :label="$t('form.password')"
                            type="password"
                            :placeholder="$t('account.registration.passwordPlaceholder')"
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />
                    </div>

                    <!-- Guest Checkout Option (only show if allowGuest prop is true) -->
                    <div v-if="allowGuest" class="mt-4">
                        <div class="flex items-center">
                            <FoundationCheckbox
                                id="registration-guest"
                                v-model="formData.guest"
                                :disabled="isLoading"
                            />
                            <FoundationLabel for="registration-guest" class="ml-2 text-sm">
                                {{ $t('account.notCreateAccount') }}
                            </FoundationLabel>
                        </div>
                    </div>
                </div>

                <!-- Account Type & Business Information Section -->
                <div>
                    <FoundationHeadline tag="h4" class="text-base font-medium mb-3">
                        {{ $t('account.accountType') }}
                    </FoundationHeadline>
                    
                    <div class="space-y-4">
                        <!-- Account Type Selection -->
                        <div>
                            <FoundationLabel for="registration-account-type" class="block" required>
                                {{ $t('account.accountType') }}
                            </FoundationLabel>
                            <FoundationSelect
                                id="registration-account-type"
                                v-model="formData.accountType"
                                :placeholder="$t('account.accountType')"
                                :options="accountTypeOptions"
                                :disabled="isLoading"
                                required
                                name="accountType"
                                class="w-full"
                            />
                        </div>

                        <!-- Business Information (only if business account) -->
                        <div v-if="isBusinessAccount" class="space-y-4">
                            <FoundationHeadline tag="h5" class="text-sm font-medium">
                                {{ $t('account.registration.businessInformation') }}
                            </FoundationHeadline>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Company -->
                                <div class="md:col-span-2">
                                    <ComponentTextInput
                                        id="registration-company"
                                        v-model="formData.company"
                                        :label="$t('account.company')"
                                        type="text"
                                        :placeholder="$t('account.company')"
                                        :disabled="isLoading"
                                        size="md"
                                        bordered
                                    />
                                </div>

                                <!-- Department -->
                                <div class="md:col-span-2">
                                    <ComponentTextInput
                                        id="registration-department"
                                        v-model="formData.billingAddress.department"
                                        :label="$t('account.department')"
                                        type="text"
                                        :placeholder="$t('account.department')"
                                        :disabled="isLoading"
                                        size="md"
                                        bordered
                                    />
                                </div>

                                <!-- VAT IDs -->
                                <div class="md:col-span-2">
                                    <ComponentTextInput
                                        id="registration-vat-ids"
                                        v-model="formData.vatIds"
                                        :label="$t('account.vatIds')"
                                        type="text"
                                        :placeholder="$t('account.vatIds')"
                                        :disabled="isLoading"
                                        size="md"
                                        bordered
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Billing Address Section -->
                <AccountAddress
                    v-model="formData.billingAddress"
                    :title="$t('account.registration.billingAddress')"
                    field-prefix="billing"
                    mode="embedded"
                    :disabled="isLoading"
                    hide-name-fields
                    hide-company-fields
                    @validation-change="onAddressValidationChange"
                />

                <!-- Different Shipping Address Checkbox -->
                <div class="flex items-center">
                    <FoundationCheckbox
                        id="registration-different-shipping"
                        v-model="isDifferentShipping"
                        :disabled="isLoading"
                    />
                    <FoundationLabel for="registration-different-shipping" class="ml-2 text-sm">
                        {{ $t('account.registration.differentShippingAddress') }}
                    </FoundationLabel>
                </div>

                <!-- Shipping Address Section (conditional) -->
                <AccountAddress
                    v-if="isDifferentShipping && formData.shippingAddress"
                    v-model="formData.shippingAddress"
                    :title="$t('account.registration.shippingAddress')"
                    field-prefix="shipping"
                    mode="embedded"
                    :disabled="isLoading"
                    show-account-type-toggle
                    @validation-change="onShippingAddressValidationChange"
                />

                <!-- Data Protection Checkbox -->
                <div class="flex items-center">
                    <FoundationCheckbox
                        id="registration-data-protection"
                        v-model="formData.acceptedDataProtection"
                        :disabled="isLoading"
                        required
                    />
                    <FoundationLabel for="registration-data-protection" class="ml-2 text-sm" required>
                        {{ $t('account.registration.dataProtection') }}
                    </FoundationLabel>
                </div>

                <!-- Submit Button -->
                <div v-if="!hideCreateAccountButton" class="flex flex-col sm:flex-row gap-3 pt-4">
                    <FoundationButton
                        type="submit"
                        color="secondary"
                        :loading="isLoading"
                        :disabled="!isFormValid"
                        @click="handleSubmit"
                    >
                        {{ formData.guest && allowGuest ? $t('account.registration.continueAsGuest') : $t('account.registration.createAccount') }}
                    </FoundationButton>
                </div>
            </div>
        </form>
    </ComponentFieldset>
</template>
