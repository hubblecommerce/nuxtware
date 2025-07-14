<script setup lang="ts">
import type { Schemas, RequestParameters } from "#shopware";
import { ApiClientError } from "@shopware/api-client";

type CmsSlotWithTitle = Schemas["CmsSlot"] & {
    translated?: {
        config?: {
            title?: {
                value?: string
            }
        }
    }
}

const props = defineProps<{
    content?: CmsSlotWithTitle
}>()

// Composables
const { t } = useI18n()
const { getSalutations } = useSalutations()
const {
    newsletterSubscribe,
    newsletterUnsubscribe,
} = useNewsletter()
const { resolveApiErrors } = useApiErrorsResolver()
const { error, success } = useGlobalNotifications()

// State
const isLoading = ref(false)
const formData = reactive<RequestParameters<'newsletterSubscribe'>>({
    option: 'subscribe',
    salutationId: '',
    firstName: '',
    lastName: '',
    email: '',
    acceptedDataProtection: false
})

// Computed
const title = computed(() => {
    return props.content?.translated?.config?.title?.value ?? t('newsletter.headline')
})

const newsletterActionOptions = computed(() => [
    { value: 'subscribe', label: t('newsletter.subscribeOption') },
    { value: 'unsubscribe', label: t('newsletter.unsubscribeOption') }
])

const salutationOptions = computed(() =>
    getSalutations.value.map(salutation => ({
        value: salutation.id,
        label: salutation.displayName
    }))
)

const isFormValid = computed(() => {
    const requiredFields: string[] = [
        formData.option,
        ...(formData.option === 'subscribe'
            ? [formData.salutationId, formData.firstName, formData.lastName]
            : []),
        formData.email,
    ]

    const allFieldsFilled = requiredFields.every(field => field.trim().length > 0)
    const dataProtectionAccepted = formData.acceptedDataProtection

    return allFieldsFilled &&
        !isLoading.value &&
        dataProtectionAccepted
})

const handleSubmit = async () => {
    if (!isFormValid.value) return
    isLoading.value = true

    try {
        const subscriptionData = { ...formData }

        if (subscriptionData.option === 'subscribe') {
            await newsletterSubscribe({
                ...subscriptionData,
            })
            success(t('newsletter.successSubscribed'))
        } else if (subscriptionData.option === 'unsubscribe') {
            await newsletterUnsubscribe(subscriptionData.email)
            success(t('newsletter.successUnsubscribed'))
        }
    } catch (apiError) {
        if (apiError instanceof ApiClientError) {
            const errorMessages = resolveApiErrors(apiError.details.errors)
            error(errorMessages.join(', ') || t('form.newsletter.unknownError'))
        } else {
            error(apiError instanceof Error ? apiError.message : t('form.newsletter.unknownError'))
        }
    } finally {
        isLoading.value = false
    }
}
</script>
<template>
    <div>
        <FoundationHeadline level="h3" class="px-4 -ml-4 text-lg font-medium text-secondary mb-2">
            {{ title }}
        </FoundationHeadline>

        <form @submit.prevent="handleSubmit">
            <div class="space-y-6">
                <div class="flex flex-col gap-4">
                    <!-- Newsletter Form Action -->
                    <div class="col-span-12">
                        <FoundationLabel for="newsletter-form-action" class="block" required>
                            {{ $t('newsletter.labelActionSelect') }}
                            <span aria-hidden="true">{{ $t('form.required') }}</span>
                        </FoundationLabel>
                        <FoundationSelect
                            id="newsletter-form-action"
                            v-model="formData.option"
                            :placeholder="$t('newsletter.labelActionSelect')"
                            :options="newsletterActionOptions"
                            required
                            :disabled="isLoading"
                            name="newsletterFormAction"
                            class="w-full"
                        />
                    </div>

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

                    <div v-if="formData.option === 'subscribe'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Salutation -->
                        <div class="w-full">
                            <FoundationLabel for="newsletter-salutation" class="block" required>
                                {{ $t('form.salutation') }}
                                <span aria-hidden="true">{{ $t('form.required') }}</span>
                            </FoundationLabel>
                            <FoundationSelect
                                id="newsletter-salutation"
                                v-model="formData.salutationId"
                                :placeholder="$t('form.chooseSalutation')"
                                :options="salutationOptions"
                                :required="formData.option === 'subscription'"
                                :disabled="isLoading"
                                name="salutation"
                                class="w-full"
                            />
                        </div>

                        <!-- First Name -->
                        <ComponentTextInput
                            id="registration-first-name"
                            v-model="formData.firstName"
                            :label="$t('form.firstName')+$t('form.required')"
                            type="text"
                            :placeholder="$t('form.firstNamePlaceholder')"
                            :required="formData.option === 'subscription'"
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />

                        <!-- Last Name -->
                        <ComponentTextInput
                            id="registration-last-name"
                            v-model="formData.lastName"
                            :label="$t('form.lastName')+$t('form.required')"
                            type="text"
                            :placeholder="$t('form.lastNamePlaceholder')"
                            :required="formData.option === 'subscription'"
                            :disabled="isLoading"
                            size="md"
                            bordered
                        />
                    </div>

                    <!-- Data Protection Checkbox -->
                    <div class="flex items-center">
                        <FoundationCheckbox
                            id="registration-data-protection"
                            v-model="formData.acceptedDataProtection"
                            :disabled="isLoading"
                            required
                        />
                        <FoundationLabel for="registration-data-protection" class="ml-2 text-sm" required>
                            {{ $t('newsletter.dataProtection') }}
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
                            {{ formData.option === 'subscribe' ? $t('newsletter.subscribeOption') : $t('newsletter.unsubscribeOption') }}
                        </FoundationButton>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>