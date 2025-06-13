<template>
    <fieldset class="space-y-6 p-6 border border-border rounded-lg bg-surface">
        <legend class="px-4 mb-0 -ml-4">
            <FoundationHeadline level="h3" class="text-lg font-medium text-primary mb-2">
                {{ $t('checkout.registration.title') }}
            </FoundationHeadline>
            <p class="text-sm">
                {{ $t('checkout.registration.description') }}
            </p>
        </legend>

        <form @submit.prevent="handleSubmit">
            <div class="space-y-6">
                <!-- Personal Information Section -->
                <div>
                    <FoundationHeadline level="h4" class="text-base font-medium text-primary mb-3">
                        {{ $t('checkout.personalInformationLabel') }}
                    </FoundationHeadline>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Salutation -->
                        <div class="md:col-span-2">
                            <FoundationLabel for="registration-salutation" required>
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
                            :placeholder="$t('checkout.registration.passwordPlaceholder')"
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />
                    </div>

                    <!-- Guest Checkout Option -->
                    <div class="mt-4">
                        <div class="flex items-center">
                            <FoundationCheckbox
                                id="registration-guest"
                                v-model="formData.guest"
                                :disabled="isLoading"
                            />
                            <FoundationLabel for="registration-guest" class="ml-2 text-sm">
                                {{ $t('checkout.notCreateAccount') }}
                            </FoundationLabel>
                        </div>
                    </div>
                </div>

                <!-- Billing Address Section -->
                <CheckoutAddress
                    v-model="billingAddress"
                    :title="$t('checkout.registration.billingAddress')"
                    field-prefix="billing"
                    mode="embedded"
                    :disabled="isLoading"
                    @validation-change="onAddressValidationChange"
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
                        {{ $t('checkout.registration.dataProtection') }}
                    </FoundationLabel>
                </div>

                <!-- Submit Button -->
                <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <FoundationButton
                        type="submit"
                        color="secondary"
                        class="flex-1"
                        :loading="isLoading"
                        :disabled="!isFormValid"
                        @click="handleSubmit"
                    >
                        {{ formData.guest ? $t('checkout.registration.continueAsGuest') : $t('checkout.registration.createAccount') }}
                    </FoundationButton>
                    
                    <FoundationButton
                        type="button"
                        variant="outline"
                        class="flex-1"
                        @click="$emit('switch-to-login')"
                    >
                        {{ $t('checkout.registration.alreadyHaveAccount') }}
                    </FoundationButton>
                </div>
            </div>
        </form>
    </fieldset>
</template>

<script setup lang="ts">
import type { RequestParameters } from '#shopware'
import { ApiClientError } from '@shopware/api-client'

interface ComponentCheckoutRegistrationProps {
    disabled?: boolean
}

interface ComponentCheckoutRegistrationEmits {
    (e: 'registration-success' | 'switch-to-login'): void
}

const props = withDefaults(defineProps<ComponentCheckoutRegistrationProps>(), {
    disabled: false
})

const emit = defineEmits<ComponentCheckoutRegistrationEmits>()

// Composables
const { register } = useUser()
const { getSalutations } = useSalutations()
const { resolveApiErrors } = useApiErrorsResolver()
const { error } = useGlobalNotifications()
const { t } = useI18n()

// State
const isLoading = ref(false)
const isAddressValid = ref(false)

const formData = reactive<RequestParameters<'register'>>({
    salutationId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    guest: false,
    billingAddress: {
        street: '',
        zipcode: '',
        city: '',
        countryId: '',
        countryStateId: '',
    },
    acceptedDataProtection: false,
    storefrontUrl: '',
})

// Separate billing address for the component
const billingAddress = ref({
    street: '',
    zipcode: '',
    city: '',
    countryId: '',
    countryStateId: '',
})

// Computed
const salutationOptions = computed(() => 
    getSalutations.value.map(salutation => ({
        value: salutation.id,
        label: salutation.displayName
    }))
)

const isFormValid = computed(() => {
    const requiredPersonalFields = [
        formData.salutationId,
        formData.firstName,
        formData.lastName,
        formData.email,
    ]

    const allPersonalFieldsFilled = requiredPersonalFields.every(field => field.trim().length > 0)
    const passwordValid = formData.guest || formData.password.length > 0
    const dataProtectionAccepted = formData.acceptedDataProtection

    return allPersonalFieldsFilled && 
           passwordValid && 
           dataProtectionAccepted && 
           isAddressValid.value && 
           !isLoading.value
})

// Watch billing address changes and sync to form data
watch(billingAddress, (newAddress) => {
    Object.assign(formData.billingAddress, newAddress)
}, { deep: true })

// Methods
const onAddressValidationChange = (valid: boolean) => {
    isAddressValid.value = valid
}

const handleSubmit = async () => {
    if (!isFormValid.value || props.disabled) return

    isLoading.value = true

    try {
        // Ensure storefrontUrl is set for the registration
        formData.storefrontUrl = window.location.origin

        const response = await register(formData)
        
        // For guest checkout, we should proceed regardless of account activation
        // For regular registration, we should also proceed as the user is now registered
        if (response) {
            emit('registration-success')
        }
    } catch (apiError) {
        if (apiError instanceof ApiClientError) {
            const errorMessages = resolveApiErrors(apiError.details.errors)
            error(errorMessages.join(', ') || t('checkout.registration.unknownError'))
        } else {
            error(apiError instanceof Error ? apiError.message : t('checkout.registration.unknownError'))
        }
    } finally {
        isLoading.value = false
    }
}
</script>