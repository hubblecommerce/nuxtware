<script setup lang="ts">
import { ApiClientError } from '@shopware/api-client'

interface ReviewLoginEmits {
    (e: 'login-success' | 'cancel'): void
}

const emit = defineEmits<ReviewLoginEmits>()

// Composables
const { login, isLoggedIn } = useUser()
const { resolveApiErrors } = useApiErrorsResolver('account_login')
const { addNotification } = useGlobalNotifications()

// State
const isLoading = ref(false)
const errors = ref<string[]>([])

const formData = reactive({
    email: '',
    password: '',
})

// Computed
const isFormValid = computed(() => {
    return formData.email.length > 0 && 
           formData.password.length > 0 && 
           !isLoading.value
})

// Methods
const handleLogin = async () => {
    if (!isFormValid.value) return

    errors.value = []
    isLoading.value = true

    try {
        await login({
            username: formData.email,
            password: formData.password
        })

        // Check if login was successful
        if (isLoggedIn.value) {
            addNotification({
                type: 'success',
                message: 'Successfully signed in!'
            })
            emit('login-success')
        } else {
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

const handleCancel = () => {
    emit('cancel')
}

// Clear errors when form data changes
watch(formData, () => {
    if (errors.value.length > 0) {
        errors.value = []
    }
})
</script>

<template>
    <div class="review-login bg-surface border border-border rounded-lg p-6">
        <header class="mb-6">
            <h3 class="text-xl font-semibold mb-2">
                {{ $t('review.login.title') }}
            </h3>
            <p class="text-sm">
                {{ $t('review.login.description') }}
                <FoundationLink 
                    href="/account/register" 
                    class="text-primary hover:text-primary/80 font-medium"
                >
                    {{ $t('review.login.registerLink') }}
                </FoundationLink>
            </p>
        </header>

        <form class="space-y-4" @submit.prevent="handleLogin">
            <!-- Error display -->
            <div 
                v-if="errors.length > 0" 
                class="p-4 bg-error/10 border border-error/20 rounded-md text-error-content" 
                role="alert"
            >
                <p class="font-medium mb-2">{{ $t('form.errorOccurred') }}</p>
                <ul class="list-disc list-inside space-y-1">
                    <li v-for="error in errors" :key="error" class="text-sm">
                        {{ error }}
                    </li>
                </ul>
            </div>

            <!-- Email Input -->
            <ComponentTextInput
                id="review-login-email"
                v-model="formData.email"
                :label="$t('form.email')"
                type="email"
                :placeholder="$t('form.emailPlaceholder')"
                :disabled="isLoading"
                size="md"
                bordered
                autocomplete="email"
            />

            <!-- Password Input -->
            <ComponentTextInput
                id="review-login-password"
                v-model="formData.password"
                :label="$t('form.password')"
                type="password"
                :placeholder="$t('form.passwordPlaceholder')"
                :disabled="isLoading"
                size="md"
                bordered
                autocomplete="current-password"
            />

            <!-- Form Actions -->
            <div class="flex items-center gap-3 pt-4">
                <FoundationButton
                    type="submit"
                    variant="default"
                    color="secondary"
                    :loading="isLoading"
                    :disabled="!isFormValid"
                    class="px-6"
                    @click="handleLogin"
                >
                    {{ $t('form.signIn') }}
                </FoundationButton>

                <FoundationButton
                    type="button"
                    variant="outline"
                    :disabled="isLoading"
                    @click="handleCancel"
                >
                    {{ $t('review.login.cancel') }}
                </FoundationButton>
            </div>
        </form>
    </div>
</template>