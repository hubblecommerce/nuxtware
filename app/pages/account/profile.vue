<script setup lang="ts">
const { isAuthorized, isChecking } = useAuthGuard()
const { t } = useI18n()

useHead({
    title: t('account.nav.profile'),
    meta: [
        {
            name: 'description',
            content: t('account.page.description')
        }
    ]
})

useBreadcrumbs([
    {
        name: t('breadcrumbs.accountOverview'),
        path: '/account'
    },
    {
        name: t('breadcrumbs.profile'),
        path: '/account/profile'
    }
])
</script>

<template>
    <ClientOnly>
        <!-- Loading state while checking auth -->
        <div v-if="isChecking" class="lg:container mx-auto px-2 py-8">
            <div class="animate-pulse">
                <div class="h-8 bg-gray-200 rounded mb-6 w-48" />
                <div class="h-4 bg-gray-200 rounded w-64" />
            </div>
        </div>
        
        <!-- Protected content (only shows when authorized) -->
        <div v-else-if="isAuthorized" class="lg:container mx-auto px-2 py-8">
            <LayoutBreadcrumb />
            
            <div class="account-profile">
                <!-- Welcome section -->
                <div class="mb-8">
                    <FoundationHeadline tag="h1" class="text-2xl md:text-3xl font-bold mb-4">
                        {{ $t('account.profile.title') }}
                    </FoundationHeadline>
                    <p class="text-muted-foreground text-lg">
                        {{ $t('account.profile.description') }}
                    </p>
                </div>

                <!-- Profile sections -->
                <div class="space-y-8">
                    <!-- Personal Data Section -->
                    <div class="bg-surface border border-border rounded-lg p-6">
                        <FoundationHeadline tag="h2" class="text-xl font-semibold mb-6">
                            {{ $t('account.profile.personalData') }}
                        </FoundationHeadline>
                        <AccountPersonalData />
                    </div>

                    <!-- Change Password Section -->
                    <div class="bg-surface border border-border rounded-lg p-6">
                        <FoundationHeadline tag="h2" class="text-xl font-semibold mb-6">
                            {{ $t('account.profile.changePassword') }}
                        </FoundationHeadline>
                        <AccountChangePassword />
                    </div>

                    <!-- Change Email Section -->
                    <div class="bg-surface border border-border rounded-lg p-6">
                        <FoundationHeadline tag="h2" class="text-xl font-semibold mb-6">
                            {{ $t('account.profile.changeEmail') }}
                        </FoundationHeadline>
                        <AccountChangeEmail />
                    </div>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>