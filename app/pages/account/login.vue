
<script setup lang="ts">
// Page meta
definePageMeta({
    title: 'account.page.metaTitle',
    description: 'account.page.metaDescription'
})

// Composables
const { isLoggedIn } = useUser()
const { success } = useGlobalNotifications()
const { t } = useI18n()
const localePath = useLocalePath()

// State
const activeForm = ref<'login' | 'register'>('login')

// Redirect if already logged in
watch(isLoggedIn, (loggedIn) => {
    if (loggedIn) {
        navigateTo(localePath('/account'))
    }
}, { immediate: true })

// Methods
const switchToLogin = () => {
    activeForm.value = 'login'
}

const switchToRegister = () => {
    activeForm.value = 'register'
}

const handleLoginSuccess = () => {
    success(t('account.login.successMessage'))
    navigateTo(localePath('/account'))
}

const handleRegistrationSuccess = () => {
    success(t('account.registration.successMessage'))
    navigateTo(localePath('/account'))
}

const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    navigateTo(localePath('/account/forgot-password'))
}

// SEO
useSeoMeta({
    title: t('account.page.metaTitle'),
    description: t('account.page.metaDescription'),
    ogTitle: t('account.page.metaTitle'),
    ogDescription: t('account.page.metaDescription'),
})
</script>

<template>
    <div class="lg:container mx-auto px-2 py-8">
        <div class="max-w-2xl mx-auto">
            <div class="text-center mb-8">
                <FoundationHeadline level="h1" class="text-2xl md:text-3xl font-bold text-primary mb-4">
                    {{ $t('account.page.title') }}
                </FoundationHeadline>
                <p class="text-muted-foreground">
                    {{ $t('account.page.description') }}
                </p>
            </div>

            <div class="space-y-6">
                <!-- Login Form -->
                <AccountLogin
                    v-if="activeForm === 'login'"
                    @login-success="handleLoginSuccess"
                    @forgot-password="handleForgotPassword"
                    @switch-to-register="switchToRegister"
                />

                <!-- Registration Form -->
                <AccountRegistration
                    v-else-if="activeForm === 'register'"
                    @registration-success="handleRegistrationSuccess"
                    @switch-to-login="switchToLogin"
                />
            </div>
        </div>
    </div>
</template>
