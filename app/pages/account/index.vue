<script setup lang="ts">
const { isAuthorized, isChecking } = useAuthGuard()

definePageMeta({
    title: 'account.nav.overview',
    description: 'account.page.description'
})

useHead({
    title: 'Account Overview',
    meta: [
        {
            name: 'description',
            content: 'Manage your account, view orders, and update your profile information.'
        }
    ]
})
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
            <FoundationHeadline level="h1" class="mb-6">
                {{ $t('account.nav.overview') }}
            </FoundationHeadline>
            
            <!-- Content placeholder -->
            <div class="text-muted-foreground">
                {{ $t('account.page.comingSoon') }}
            </div>
        </div>
    </ClientOnly>
</template>