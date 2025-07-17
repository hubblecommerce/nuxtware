<script setup lang="ts">
import type { Schemas } from "#shopware"
import { ApiClientError } from "@shopware/api-client"

type CmsSlotWithContactConfig = Schemas["CmsSlot"] & {
    translated?: {
        config?: {
            title?: {
                value?: string
            }
            confirmationText?: {
                value?: string
            }
        }
    }
}

const props = defineProps<{
    content?: CmsSlotWithContactConfig
}>()

// Composables
const { t } = useI18n()
const { getSalutations } = useSalutations()
const { apiClient } = useShopwareContext()
const { foreignKey } = useNavigationContext()
const { resolveApiErrors } = useApiErrorsResolver()
const { error } = useGlobalNotifications()

// State
const isLoading = ref(false)
const formSent = ref(false)
const formData = reactive({
    salutationId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    comment: '',
    checkbox: false
})

// Computed
const title = computed(() => {
    return props.content?.translated?.config?.title?.value ?? t('contact.headline')
})

const confirmationText = computed(() => {
    return props.content?.translated?.config?.confirmationText?.value ?? t('contact.successMessage')
})

const salutationOptions = computed(() =>
    getSalutations.value.map(salutation => ({
        value: salutation.id,
        label: salutation.displayName
    }))
)

const isFormValid = computed(() => {
    const requiredFields = [
        formData.salutationId,
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.subject,
        formData.comment
    ]

    const allFieldsFilled = requiredFields.every(field => field.trim().length > 0)
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    const isFirstNameValid = formData.firstName.trim().length >= 3
    const isLastNameValid = formData.lastName.trim().length >= 3
    const isPhoneValid = formData.phone.trim().length >= 3
    const isSubjectValid = formData.subject.trim().length >= 3
    const isCommentValid = formData.comment.trim().length >= 10
    const isPrivacyAccepted = formData.checkbox

    return allFieldsFilled && 
           isEmailValid && 
           isFirstNameValid && 
           isLastNameValid && 
           isPhoneValid && 
           isSubjectValid && 
           isCommentValid && 
           isPrivacyAccepted && 
           !isLoading.value
})

const handleSubmit = async () => {
    if (!isFormValid.value) return
    isLoading.value = true

    try {
        await apiClient.invoke("sendContactMail post /contact-form", {
            body: {
                ...formData,
                navigationId: foreignKey.value,
            },
        })
        formSent.value = true
    } catch (apiError) {
        if (apiError instanceof ApiClientError) {
            const errorMessages = resolveApiErrors(apiError.details.errors)
            error(errorMessages.join(', ') || t('contact.unknownError'))
        } else {
            error(apiError instanceof Error ? apiError.message : t('contact.unknownError'))
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div>
        <FoundationHeadline tag="h3" class="px-4 -ml-4 text-lg font-medium mb-2">
            {{ title }}
        </FoundationHeadline>

        <div v-if="formSent" class="py-10 text-lg text-center">
            {{ confirmationText }}
        </div>

        <form v-else @submit.prevent="handleSubmit">
            <div class="space-y-6">
                <div class="flex flex-col gap-4">
                    <!-- Salutation, First Name, Last Name Row -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Salutation -->
                        <div class="w-full">
                            <FoundationLabel for="contact-salutation" class="block" required>
                                {{ $t('form.salutation') }}
                                <span aria-hidden="true">{{ $t('form.required') }}</span>
                            </FoundationLabel>
                            <FoundationSelect
                                id="contact-salutation"
                                v-model="formData.salutationId"
                                :placeholder="$t('form.chooseSalutation')"
                                :options="salutationOptions"
                                required
                                :disabled="isLoading"
                                name="salutation"
                                class="w-full"
                            />
                        </div>

                        <!-- First Name -->
                        <ComponentTextInput
                            id="contact-first-name"
                            v-model="formData.firstName"
                            :label="$t('form.firstName')+$t('form.required')"
                            type="text"
                            :placeholder="$t('form.firstNamePlaceholder')"
                            required
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />

                        <!-- Last Name -->
                        <ComponentTextInput
                            id="contact-last-name"
                            v-model="formData.lastName"
                            :label="$t('form.lastName')+$t('form.required')"
                            type="text"
                            :placeholder="$t('form.lastNamePlaceholder')"
                            required
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />
                    </div>

                    <!-- Email and Phone Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Email -->
                        <ComponentTextInput
                            id="contact-email"
                            v-model="formData.email"
                            :label="$t('form.email')+$t('form.required')"
                            type="email"
                            :placeholder="$t('form.emailPlaceholder')"
                            required
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />

                        <!-- Phone -->
                        <ComponentTextInput
                            id="contact-phone"
                            v-model="formData.phone"
                            :label="$t('contact.phone')+$t('form.required')"
                            type="tel"
                            :placeholder="$t('contact.phonePlaceholder')"
                            required
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />
                    </div>

                    <!-- Subject -->
                    <ComponentTextInput
                        id="contact-subject"
                        v-model="formData.subject"
                        :label="$t('contact.subject')+$t('form.required')"
                        type="text"
                        :placeholder="$t('contact.subjectPlaceholder')"
                        required
                        :disabled="isLoading"
                        size="md"
                        bordered
                    />

                    <!-- Message/Comment -->
                    <ComponentTextarea
                        id="contact-comment"
                        v-model="formData.comment"
                        :label="$t('contact.message')+$t('form.required')"
                        :placeholder="$t('contact.messagePlaceholder')"
                        :rows="5"
                        required
                        :disabled="isLoading"
                        bordered
                    />

                    <!-- Data Protection Checkbox -->
                    <div class="flex items-center">
                        <FoundationCheckbox
                            id="contact-data-protection"
                            v-model="formData.checkbox"
                            :disabled="isLoading"
                            required
                        />
                        <FoundationLabel for="contact-data-protection" class="ml-2 text-sm" required>
                            {{ $t('contact.dataProtection') }}
                            <span aria-hidden="true">{{ $t('form.required') }}</span>
                        </FoundationLabel>
                    </div>

                    <div class="text-sm">{{ $t('form.requiredFieldsInfo') }}</div>

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
                            {{ $t('contact.submit') }}
                        </FoundationButton>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>