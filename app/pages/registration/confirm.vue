<script setup lang="ts">
const { apiClient } = useShopwareContext()
const { success, error } = useGlobalNotifications()
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

definePageMeta({
    title: 'account.registration.confirmTitle',
    description: 'account.registration.confirmDescription'
})

useSeoMeta({
    title: t('account.registration.confirmTitle'),
    description: t('account.registration.confirmDescription'),
    robots: 'noindex, nofollow'
})

// Confirm registration on mount
onMounted(async () => {
    try {
        // Extract parameters from URL
        const emailHash = route.query.em as string
        const hash = route.query.hash as string
        
        if (!emailHash || !hash) {
            throw new Error('Missing confirmation parameters')
        }
        
        // Call confirmation API
        await apiClient.invoke('registerConfirm post /account/register-confirm', {
            body: {
                em: emailHash,
                hash: hash
            }
        })
        
        success(t('account.registration.confirmSuccess'))
        navigateTo(localePath('/account'))
        
    } catch (apiError) {
        console.error('Registration confirmation failed:', apiError)
        error(t('account.registration.confirmError'))
        navigateTo(localePath('/'))
    }
})
</script>

<template>
    <div class="lg:container mx-auto px-2 py-8">
        <div class="max-w-md mx-auto text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        </div>
    </div>
</template>