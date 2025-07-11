<script setup lang="ts">
const { user, updateEmail } = useUser()
const { success, error: showError } = useGlobalNotifications()
const { t } = useI18n()

const isLoading = ref(false)
const isSuccess = ref(false)

const state = reactive({
    email: '',
    emailConfirmation: '',
    password: ''
})

const errors = reactive({
    email: '',
    emailConfirmation: '',
    password: ''
})

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const validateForm = () => {
    let isValid = true
    
    // Reset errors
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })

    if (!state.email) {
        errors.email = t('form.validation.required', { field: t('form.email') })
        isValid = false
    } else if (!validateEmail(state.email)) {
        errors.email = t('form.validation.invalidEmail')
        isValid = false
    }

    if (!state.emailConfirmation) {
        errors.emailConfirmation = t('form.validation.required', { field: t('form.confirmEmail') })
        isValid = false
    } else if (!validateEmail(state.emailConfirmation)) {
        errors.emailConfirmation = t('form.validation.invalidEmail')
        isValid = false
    } else if (state.email !== state.emailConfirmation) {
        errors.emailConfirmation = t('form.validation.emailMismatch')
        isValid = false
    }

    if (!state.password) {
        errors.password = t('form.validation.required', { field: t('form.password') })
        isValid = false
    } else if (state.password.length < 8) {
        errors.password = t('form.validation.minLength', { field: t('form.password'), length: 8 })
        isValid = false
    }

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) return

    isLoading.value = true
    isSuccess.value = false

    try {
        await updateEmail({
            email: state.email,
            emailConfirmation: state.emailConfirmation,
            password: state.password
        })

        // Reset password field but keep emails for user reference
        state.password = ''

        isSuccess.value = true
        success(t('account.profile.messages.emailChangeRequested'))
    } catch (error) {
        console.error('Failed to change email:', error)
        showError(t('account.profile.messages.emailChangeFailed'))
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    if (user.value?.email) {
        state.email = user.value.email
        state.emailConfirmation = user.value.email
    }
})
</script>

<template>
    <div class="space-y-6">
        <div class="text-sm text-muted-foreground">
            {{ $t('account.profile.changeEmailInfo') }}
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- New Email -->
            <ComponentTextInput
                id="email"
                v-model="state.email"
                :label="`${$t('form.email')} *`"
                type="email"
                bordered
                :disabled="isLoading"
                :error="errors.email"
            />

            <!-- Confirm Email -->
            <ComponentTextInput
                id="emailConfirmation"
                v-model="state.emailConfirmation"
                :label="`${$t('form.confirmEmail')} *`"
                type="email"
                bordered
                :disabled="isLoading"
                :error="errors.emailConfirmation"
            />

            <!-- Current Password -->
            <ComponentTextInput
                id="password"
                v-model="state.password"
                :label="`${$t('form.password')} *`"
                type="password"
                bordered
                :disabled="isLoading"
                :error="errors.password"
                :helper-text="$t('form.passwordRequired')"
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
                    <span v-else>{{ $t('form.changeEmail') }}</span>
                </FoundationButton>
            </div>
        </form>
    </div>
</template>