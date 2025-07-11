<script setup lang="ts">
import { ApiClientError } from '@shopware/api-client'

interface AccountLoginProps {
    disabled?: boolean
}

interface AccountLoginEmits {
    (e: 'login-success' | 'forgot-password' | 'switch-to-register'): void
}

const props = withDefaults(defineProps<AccountLoginProps>(), {
    disabled: false
})

const emit = defineEmits<AccountLoginEmits>()

// Composables
const { login, isLoggedIn } = useUser()
const { resetPassword } = useCustomerPassword()
const { resolveApiErrors } = useApiErrorsResolver('account_login')
const { success } = useGlobalNotifications()
const { t } = useI18n()

// State
const isLoading = ref(false)
const isPasswordRecoveryMode = ref(false)
const errors = ref<string[]>([])

const formData = reactive({
    email: '',
    password: ''
})

// Computed
const isFormValid = computed(() => {
    if (isPasswordRecoveryMode.value) {
        return formData.email.length > 0 && !isLoading.value
    }
    return formData.email.length > 0 && 
           formData.password.length > 0 && 
           !isLoading.value
})

// Methods
const handleLogin = async () => {
    if (!isFormValid.value || props.disabled) return

    errors.value = []
    isLoading.value = true

    try {
        await login({
            username: formData.email,
            password: formData.password
        })

        // Check if login was successful
        if (isLoggedIn.value) {
            emit('login-success')
        } else {
            // Login function completed but user is not logged in
            errors.value = ['Login failed. Please check your credentials.']
        }
    } catch (error) {
        if (error instanceof ApiClientError) {
            errors.value = resolveApiErrors(error.details.errors)
        } else {
            errors.value = [error instanceof Error ? error.message : 'An unknown error occurred']
        }
    } finally {
        isLoading.value = false
    }
}

// Password recovery handler
const handlePasswordRecovery = async () => {
    if (!isFormValid.value || props.disabled) return

    errors.value = []
    isLoading.value = true

    try {
        const runtimeConfig = useRuntimeConfig()
        const storefrontUrl = runtimeConfig.public.shopwareDevStorefrontUrl || window.location.origin

        await resetPassword({
            email: formData.email,
            storefrontUrl
        })

        success(t('account.passwordRecovery.success.message'))

        // Reset form and switch back to login mode
        formData.email = ''
        formData.password = ''
        isPasswordRecoveryMode.value = false
    } catch (error) {
        if (error instanceof ApiClientError) {
            errors.value = resolveApiErrors(error.details.errors)
        } else {
            errors.value = [error instanceof Error ? error.message : 'An unknown error occurred']
        }
    } finally {
        isLoading.value = false
    }
}

const togglePasswordRecoveryMode = () => {
    isPasswordRecoveryMode.value = !isPasswordRecoveryMode.value
    errors.value = []
    formData.password = ''
}

const handleFormSubmit = () => {
    if (isPasswordRecoveryMode.value) {
        handlePasswordRecovery()
    } else {
        handleLogin()
    }
}

// Clear errors when form data changes
watch(formData, () => {
    if (errors.value.length > 0) {
        errors.value = []
    }
})
</script>

<template>
    <fieldset class="space-y-4 p-6 border border-border rounded-lg bg-surface">
        <legend class="px-4 mb-0 -ml-4">
            <FoundationHeadline level="h3" class="text-lg font-medium text-primary mb-2">
                {{ isPasswordRecoveryMode ? $t('account.passwordRecovery.title') : $t('account.login.title') }}
            </FoundationHeadline>
            <p class="text-sm">
                {{ isPasswordRecoveryMode ? $t('account.passwordRecovery.description') : $t('account.login.description') }}
            </p>
        </legend>

        <form @submit.prevent="handleFormSubmit">
            <div class="space-y-4">
                <div v-if="errors.length > 0" class="p-4 border-l-4 border-error bg-error/10 text-error" role="alert">
                    <p class="font-medium">{{ $t('account.login.error') }}</p>
                    <ul class="mt-2 list-disc list-inside">
                        <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                </div>

                <ComponentTextInput
                    id="login-email"
                    v-model="formData.email"
                    :label="$t('form.email')"
                    type="email"
                    :placeholder="$t('form.emailPlaceholder')"
                    :disabled="isLoading"
                    size="md"
                    bordered
                />

                <ComponentTextInput
                    v-if="!isPasswordRecoveryMode"
                    id="login-password"
                    v-model="formData.password"
                    :label="$t('form.password')"
                    type="password"
                    :placeholder="$t('account.login.passwordPlaceholder')"
                    :disabled="isLoading"
                    size="md"
                    bordered
                />

                <FoundationLink
                    v-if="!isPasswordRecoveryMode"
                    href="#"
                    class="block text-sm text-primary hover:text-primary/80 cursor-pointer"
                    @click.prevent="togglePasswordRecoveryMode"
                >
                    {{ $t('account.login.forgotPassword') }}
                </FoundationLink>
                <FoundationLink
                    v-if="isPasswordRecoveryMode"
                    href="#"
                    class="block text-sm text-primary hover:text-primary/80 cursor-pointer"
                    @click.prevent="togglePasswordRecoveryMode"
                >
                    {{ $t('account.login.backToLogin') }}
                </FoundationLink>

                <div class="flex flex-col sm:flex-row gap-3">
                    <FoundationButton
                        type="submit"
                        color="secondary"
                        class="flex-1"
                        :loading="isLoading"
                        :disabled="!isFormValid"
                        @click="handleFormSubmit"
                    >
                        {{ isPasswordRecoveryMode ? $t('account.passwordRecovery.submit') : $t('account.login.signIn') }}
                    </FoundationButton>
                    
                    <FoundationButton
                        v-if="!isPasswordRecoveryMode"
                        type="button"
                        variant="outline"
                        class="flex-1"
                        @click="$emit('switch-to-register')"
                    >
                        {{ $t('account.login.createAccount') }}
                    </FoundationButton>
                </div>
            </div>
        </form>
    </fieldset>
</template>
