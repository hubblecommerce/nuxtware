<script setup lang="ts">
const { apiClient } = useShopwareContext()
const { success, error } = useGlobalNotifications()
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

definePageMeta({
    title: 'newsletter.confirmTitle',
    description: 'newsletter.confirmDescription'
})

useSeoMeta({
    title: t('newsletter.confirmTitle'),
    description: t('newsletter.confirmDescription'),
    robots: 'noindex, nofollow'
})

// Confirm newsletter subscription on mount
onMounted(async () => {
    try {
        // Extract parameters from URL
        const emailHash = route.query.em as string
        const hash = route.query.hash as string
        
        if (!emailHash || !hash) {
            throw new Error('Missing confirmation parameters')
        }
        
        // Call confirmation API
        await apiClient.invoke('confirmNewsletter post /newsletter/confirm', {
            body: {
                em: emailHash,
                hash: hash
            }
        })
        
        success(t('newsletter.confirmSuccess'))
        navigateTo(localePath('/'))
        
    } catch (apiError) {
        console.error('Newsletter confirmation failed:', apiError)
        error(t('newsletter.confirmError'), { keepAlive: true })
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