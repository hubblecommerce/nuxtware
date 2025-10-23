<script setup lang="ts">
import { ApiClientError } from '@shopware/api-client'

const { apiClient } = useShopwareContext()
const { success, error } = useGlobalNotifications()
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { resolveApiErrors } = useApiErrorsResolver('password_recovery')

definePageMeta({
    title: 'account.passwordRecovery.resetTitle',
    description: 'account.passwordRecovery.resetDescription'
})

useSeoMeta({
    title: t('account.passwordRecovery.resetTitle'),
    description: t('account.passwordRecovery.resetDescription'),
    robots: 'noindex, nofollow'
})

// State
const isLoading = ref(false)
const errors = ref<string[]>([])
const hash = ref('')

const formData = reactive({
    newPassword: '',
    newPasswordConfirm: ''
})

// Extract hash from URL on mount
onMounted(() => {
    hash.value = route.query.hash as string
    
    if (!hash.value) {
        error(t('account.passwordRecovery.invalidLink'))
        navigateTo(localePath('/'))
    }
})

// Computed
const isFormValid = computed(() => {
    return formData.newPassword.length >= 8 && 
           formData.newPasswordConfirm.length >= 8 &&
           formData.newPassword === formData.newPasswordConfirm && 
           !isLoading.value
})

const passwordsMatch = computed(() => {
    return formData.newPassword === formData.newPasswordConfirm || 
           formData.newPasswordConfirm.length === 0
})

// Methods
const handlePasswordReset = async () => {
    if (!isFormValid.value) return

    errors.value = []
    isLoading.value = true

    try {
        await apiClient.invoke('recoveryPassword post /account/recovery-password-confirm', {
            body: {
                hash: hash.value,
                newPassword: formData.newPassword,
                newPasswordConfirm: formData.newPasswordConfirm
            }
        })
        
        success(t('account.passwordRecovery.resetSuccess'))
        navigateTo(localePath('/account'))
        
    } catch (apiError) {
        console.error('Password reset failed:', apiError)
        if (apiError instanceof ApiClientError) {
            errors.value = resolveApiErrors(apiError.details.errors)
        } else {
            errors.value = [t('account.passwordRecovery.resetError')]
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

<template>
    <div class="mx-auto w-full max-w-8xl px-2 py-8">
        <div class="max-w-md mx-auto">
            <div class="space-y-6">
                <div class="text-center mb-8">
                    <FoundationHeadline tag="h1" class="text-2xl font-bold mb-4">
                        {{ $t('account.passwordRecovery.resetTitle') }}
                    </FoundationHeadline>
                    <p class="text-muted">
                        {{ $t('account.passwordRecovery.resetDescription') }}
                    </p>
                </div>

                <ComponentFieldset :legend="false">
                    <form @submit.prevent="handlePasswordReset">
                        <div class="space-y-4">
                            <div v-if="errors.length > 0" class="p-4 border-l-4 border-error bg-error/10 text-error" role="alert">
                                <p class="font-medium">{{ $t('account.passwordRecovery.error') }}</p>
                                <ul class="mt-2 list-disc list-inside">
                                    <li v-for="err in errors" :key="err">{{ err }}</li>
                                </ul>
                            </div>

                            <ComponentTextInput
                                id="new-password"
                                v-model="formData.newPassword"
                                :label="$t('form.newPassword')"
                                type="password"
                                :placeholder="$t('form.newPasswordPlaceholder')"
                                :disabled="isLoading"
                                size="md"
                                bordered
                                required
                            />

                            <ComponentTextInput
                                id="confirm-password"
                                v-model="formData.newPasswordConfirm"
                                :label="$t('form.confirmPassword')"
                                type="password"
                                :placeholder="$t('form.confirmPasswordPlaceholder')"
                                :disabled="isLoading"
                                :class="{ 'border-error': !passwordsMatch }"
                                size="md"
                                bordered
                                required
                            />

                            <div v-if="!passwordsMatch" class="text-sm text-error">
                                {{ $t('form.passwordsDoNotMatch') }}
                            </div>

                            <div class="flex flex-col gap-3">
                                <FoundationButton
                                    type="submit"
                                    color="secondary"
                                    class="w-full"
                                    :loading="isLoading"
                                    :disabled="!isFormValid"
                                    @click="handlePasswordReset"
                                >
                                    {{ $t('account.passwordRecovery.resetSubmit') }}
                                </FoundationButton>
                                
                                <FoundationButton
                                    type="button"
                                    variant="outline"
                                    class="w-full"
                                    :to="localePath('/account')"
                                >
                                    {{ $t('common.cancel') }}
                                </FoundationButton>
                            </div>
                        </div>
                    </form>
                </ComponentFieldset>
            </div>
        </div>
    </div>
</template>