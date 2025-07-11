<script setup lang="ts">
const { refreshUser } = useUser()
const { updatePassword } = useCustomerPassword()
const { success, error: showError } = useGlobalNotifications()
const { t } = useI18n()

const isLoading = ref(false)
const isSuccess = ref(false)

const state = reactive({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
})

const errors = reactive({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
})

const validateForm = () => {
    let isValid = true
    
    // Reset errors
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })

    if (!state.currentPassword) {
        errors.currentPassword = t('form.validation.required', { field: t('form.currentPassword') })
        isValid = false
    } else if (state.currentPassword.length < 8) {
        errors.currentPassword = t('form.validation.minLength', { field: t('form.currentPassword'), length: 8 })
        isValid = false
    }

    if (!state.newPassword) {
        errors.newPassword = t('form.validation.required', { field: t('form.newPassword') })
        isValid = false
    } else if (state.newPassword.length < 8) {
        errors.newPassword = t('form.validation.minLength', { field: t('form.newPassword'), length: 8 })
        isValid = false
    }

    if (!state.newPasswordConfirm) {
        errors.newPasswordConfirm = t('form.validation.required', { field: t('form.confirmPassword') })
        isValid = false
    } else if (state.newPassword !== state.newPasswordConfirm) {
        errors.newPasswordConfirm = t('form.validation.passwordMismatch')
        isValid = false
    }

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) return

    isLoading.value = true
    isSuccess.value = false

    try {
        await updatePassword({
            password: state.currentPassword,
            newPassword: state.newPassword,
            newPasswordConfirm: state.newPasswordConfirm
        })

        await refreshUser()

        // Reset form
        state.currentPassword = ''
        state.newPassword = ''
        state.newPasswordConfirm = ''

        isSuccess.value = true
        success(t('account.profile.messages.passwordChanged'))
    } catch (error) {
        console.error('Failed to change password:', error)
        showError(t('account.profile.messages.passwordChangeFailed'))
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="space-y-6">
        <div class="text-sm text-muted-foreground">
            <div>{{ $t('account.profile.changePasswordInfo') }}</div>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- Current Password -->
            <ComponentTextInput
                id="currentPassword"
                v-model="state.currentPassword"
                :label="`${$t('form.currentPassword')} *`"
                type="password"
                bordered
                :disabled="isLoading"
                :error="errors.currentPassword"
            />

            <!-- New Password -->
            <div>
                <ComponentTextInput
                    id="newPassword"
                    v-model="state.newPassword"
                    :label="`${$t('form.newPassword')} *`"
                    type="password"
                    bordered
                    :disabled="isLoading"
                    :error="errors.newPassword"
                    :helper-text="$t('form.passwordRequirements')"
                />
            </div>

            <!-- Confirm New Password -->
            <ComponentTextInput
                id="newPasswordConfirm"
                v-model="state.newPasswordConfirm"
                :label="`${$t('form.confirmPassword')} *`"
                type="password"
                bordered
                :disabled="isLoading"
                :error="errors.newPasswordConfirm"
            />

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
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
                    <span v-else>{{ $t('form.changePassword') }}</span>
                </FoundationButton>
            </div>
        </form>
    </div>
</template>