<script setup lang="ts">
import { getTranslatedProperty } from '@shopware/helpers'
import type { operations } from '#shopware'

const { user, refreshUser, updatePersonalInfo } = useUser()
const { getSalutations } = useSalutations()
const { success, error: showError } = useGlobalNotifications()
const { t } = useI18n()

const isLoading = ref(false)
const isSuccess = ref(false)

const state = reactive({
    firstName: '',
    lastName: '',
    salutationId: '',
    title: '',
    accountType: 'private' as 'private' | 'business',
    company: '',
    vatIds: ''
})

const errors = reactive({
    firstName: '',
    lastName: '',
    salutationId: '',
    company: '',
    vatIds: ''
})

const salutations = computed(() => {
    return getSalutations.value.map((salutation) => {
        return {
            value: salutation.id,
            label: getTranslatedProperty(salutation, 'displayName'),
            disabled: false
        }
    })
})

const accountTypes = reactive([
    {
        value: 'private',
        label: t('form.accountTypePrivate'),
        disabled: false
    },
    {
        value: 'business',
        label: t('form.accountTypeBusiness'),
        disabled: false
    }
])

const validateForm = () => {
    let isValid = true
    
    // Reset errors
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })

    if (!state.firstName.trim()) {
        errors.firstName = t('form.validation.required', { field: t('form.firstName') })
        isValid = false
    }

    if (!state.lastName.trim()) {
        errors.lastName = t('form.validation.required', { field: t('form.lastName') })
        isValid = false
    }

    if (!state.salutationId) {
        errors.salutationId = t('form.validation.required', { field: t('form.salutation') })
        isValid = false
    }

    if (state.accountType === 'business') {
        if (!state.company.trim()) {
            errors.company = t('form.validation.required', { field: t('form.company') })
            isValid = false
        }
        if (!state.vatIds.trim()) {
            errors.vatIds = t('form.validation.required', { field: t('form.vatId') })
            isValid = false
        }
    }

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) return

    isLoading.value = true
    isSuccess.value = false

    try {
        const updateData: operations["changeProfile post /account/change-profile"]["body"] = {
            firstName: state.firstName,
            lastName: state.lastName,
            salutationId: state.salutationId,
            title: state.title || undefined
        }

        if (state.accountType === 'business') {
            updateData.company = state.company
            updateData.vatIds = [state.vatIds]
            updateData.accountType = state.accountType
        }

        await updatePersonalInfo(updateData)
        await refreshUser()
        
        isSuccess.value = true
        success(t('account.profile.messages.personalDataUpdated'))
    } catch (error) {
        console.error('Failed to update personal data:', error)
        showError(t('messages.error'))
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    await refreshUser()
    
    if (user.value) {
        state.firstName = user.value.firstName || ''
        state.lastName = user.value.lastName || ''
        state.salutationId = user.value.salutationId || ''
        state.title = user.value.title || ''
        state.accountType = user.value.accountType || 'private'
        
        if (user.value.accountType === 'business') {
            state.company = user.value.company || ''
            state.vatIds = user.value.vatIds?.[0] || ''
        }
    }
})
</script>

<template>
    <div class="space-y-6">
        <div class="text-sm text-muted-foreground">
            {{ $t('account.profile.personalDataInfo') }}
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- Account Type -->
            <div class="space-y-2">
                <FoundationLabel for="accountType" class="mb-1">
                    {{ $t('form.accountType') }}
                </FoundationLabel>
                <FoundationSelect
                    id="accountType"
                    v-model="state.accountType"
                    :options="accountTypes"
                    class="w-full"
                />
            </div>

            <!-- Salutation and Title Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Salutation -->
                <div class="flex flex-col space-y-2">
                    <FoundationLabel for="salutation" class="mb-1">
                        {{ $t('form.salutation') }} *
                    </FoundationLabel>
                    <FoundationSelect
                        id="salutation"
                        v-model="state.salutationId"
                        required
                        :options="salutations"
                        :placeholder="$t('form.salutationPlaceholder')"
                        class="w-full"
                    />
                    <p v-if="errors.salutationId" class="text-error text-xs">
                        {{ errors.salutationId }}
                    </p>
                </div>

                <!-- Title -->
                <ComponentTextInput 
                    id="title"
                    v-model="state.title"
                    :label="$t('form.title')"
                    bordered
                    :disabled="isLoading"
                />
            </div>

            <!-- Name Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- First Name -->
                <ComponentTextInput 
                    id="firstName"
                    v-model="state.firstName"
                    :label="`${$t('form.firstName')} *`"
                    bordered
                    :disabled="isLoading"
                    :error="errors.firstName"
                />

                <!-- Last Name -->
                <ComponentTextInput 
                    id="lastName"
                    v-model="state.lastName"
                    :label="`${$t('form.lastName')} *`"
                    bordered
                    :disabled="isLoading"
                    :error="errors.lastName"
                />
            </div>

            <!-- Business Fields (shown only when accountType is business) -->
            <div v-if="state.accountType === 'business'" class="space-y-4">
                <!-- Company -->
                <ComponentTextInput 
                    id="company"
                    v-model="state.company"
                    :label="`${$t('form.company')} *`"
                    bordered
                    :disabled="isLoading"
                    :error="errors.company"
                />

                <!-- VAT ID -->
                <ComponentTextInput 
                    id="vatIds"
                    v-model="state.vatIds"
                    :label="`${$t('form.vatId')} *`"
                    bordered
                    :disabled="isLoading"
                    :error="errors.vatIds"
                />
            </div>

            <!-- Submit Button -->
            <div class="pt-4 flex justify-end">
                <FoundationButton
                    type="submit"
                    color="secondary"
                    :disabled="isLoading"
                    class="w-full md:w-auto"
                    @click="handleSubmit"
                >
                    <div v-if="isLoading" class="flex items-center gap-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/>
                        {{ $t('form.saving') }}
                    </div>
                    <span v-else>{{ $t('form.save') }}</span>
                </FoundationButton>
            </div>
        </form>
    </div>
</template>