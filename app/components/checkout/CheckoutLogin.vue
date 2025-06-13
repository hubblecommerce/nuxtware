<template>
    <fieldset class="space-y-4 p-6 border border-border rounded-lg bg-surface">
        <legend class="px-4 mb-0 -ml-4">
            <FoundationHeadline level="h3" class="text-lg font-medium text-primary mb-2">
                {{ $t('checkout.login.title') }}
            </FoundationHeadline>
            <p class="text-sm">
                {{ $t('checkout.login.description') }}
            </p>
        </legend>

        <form @submit.prevent="handleLogin">
            <div class="space-y-4">
                <div v-if="errors.length > 0" class="p-4 border-l-4 border-error bg-error/10 text-error" role="alert">
                    <p class="font-medium">{{ $t('checkout.login.error') }}</p>
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
                    id="login-password"
                    v-model="formData.password"
                    :label="$t('form.password')"
                    type="password"
                    :placeholder="$t('checkout.login.passwordPlaceholder')"
                    :disabled="isLoading"
                    size="md"
                    bordered
                />

                <div class="flex items-center justify-between">
                    <div class="flex items-center justify-between">
                        <FoundationCheckbox
                            id="remember-me"
                            v-model="formData.rememberMe"
                            :disabled="isLoading"
                        />
                        <FoundationLabel for="remember-me" class="ml-2 text-sm">
                            {{ $t('checkout.login.rememberMe') }}
                        </FoundationLabel>
                    </div>
                    
                    <FoundationLink
                        href="#"
                        class="text-sm text-primary hover:text-primary/80"
                        @click.prevent="$emit('forgot-password')"
                    >
                        {{ $t('checkout.login.forgotPassword') }}
                    </FoundationLink>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <FoundationButton
                        type="submit"
                        color="secondary"
                        class="flex-1"
                        :loading="isLoading"
                        :disabled="!isFormValid"
                        @click="handleLogin"
                    >
                        {{ $t('checkout.login.signIn') }}
                    </FoundationButton>
                    
                    <FoundationButton
                        type="button"
                        variant="outline"
                        class="flex-1"
                        @click="$emit('switch-to-register')"
                    >
                        {{ $t('checkout.login.createAccount') }}
                    </FoundationButton>
                </div>
            </div>
        </form>
    </fieldset>
</template>

<script setup lang="ts">
import { ApiClientError } from '@shopware/api-client'

interface ComponentCheckoutLoginProps {
    disabled?: boolean
}

interface ComponentCheckoutLoginEmits {
    (e: 'login-success' | 'forgot-password' | 'switch-to-register'): void
}

const props = withDefaults(defineProps<ComponentCheckoutLoginProps>(), {
    disabled: false
})

const emit = defineEmits<ComponentCheckoutLoginEmits>()

// Composables
const { login, isLoggedIn } = useUser()
const { resolveApiErrors } = useApiErrorsResolver('account_login')

// State
const isLoading = ref(false)
const errors = ref<string[]>([])

const formData = reactive({
    email: '',
    password: '',
    rememberMe: false
})

// Computed
const isFormValid = computed(() => {
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

// Clear errors when form data changes
watch(formData, () => {
    if (errors.value.length > 0) {
        errors.value = []
    }
})
</script>