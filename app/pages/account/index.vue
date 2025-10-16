<script setup lang="ts">
const { isAuthorized, isChecking } = useAuthGuard()
const { user, userDefaultBillingAddress, userDefaultShippingAddress } = useUser()
const { 
    isNewsletterSubscriber, 
    newsletterUnsubscribe, 
    newsletterSubscribe, 
    getNewsletterStatus,
    confirmationNeeded 
} = useNewsletter()
const { success, error: showError } = useGlobalNotifications()
const { t } = useI18n()
const localePath = useLocalePath()

const newsletter = ref(false)
const isUpdatingNewsletter = ref(false)

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

useBreadcrumbs([
    {
        name: t('breadcrumbs.accountOverview'),
        path: '/account'
    }
])

const updateNewsletterStatus = async () => {
    if (isUpdatingNewsletter.value) return
    
    isUpdatingNewsletter.value = true
    try {
        if (newsletter.value) {
            await newsletterSubscribe({
                email: user.value?.email || '',
                option: 'subscribe'
            })
        } else {
            await newsletterUnsubscribe(user.value?.email || '')
        }
    } catch (error) {
        console.error('Newsletter update error:', error)
        showError(t('messages.error'))
    } finally {
        await getNewsletterStatus()
        newsletter.value = isNewsletterSubscriber.value
        isUpdatingNewsletter.value = false
        
        if (isNewsletterSubscriber.value && !confirmationNeeded.value) {
            success(t('newsletter.messages.newsletterSubscribed'))
        }

        if (!isNewsletterSubscriber.value) {
            success(t('newsletter.messages.newsletterUnsubscribed'))
        }

        if (confirmationNeeded.value) {
            success(t('newsletter.subscriptionInfo'))
        }
    }
}

onMounted(async () => {
    await getNewsletterStatus()
    newsletter.value = isNewsletterSubscriber.value
})
</script>

<template>
    <ClientOnly>
        <!-- Loading state while checking auth -->
        <div v-if="isChecking" class="mx-auto w-full max-w-8xl px-2 py-8">
            <div class="animate-pulse">
                <div class="h-8 bg-gray-200 rounded mb-6 w-48" />
                <div class="h-4 bg-gray-200 rounded w-64" />
            </div>
        </div>
        
        <!-- Protected content (only shows when authorized) -->
        <div v-else-if="isAuthorized" class="mx-auto w-full max-w-8xl px-2 py-8">
            <LayoutBreadcrumb />

            <div class="account-overview">

                <!-- Welcome section -->
                <div class="account-welcome mb-8">
                    <FoundationHeadline tag="h1" class="text-2xl md:text-3xl font-bold mb-4">
                        {{ $t('account.overviewTitle') }}
                    </FoundationHeadline>
                    <p class="text-muted-foreground text-lg">
                        {{ $t('account.overviewInfo') }}
                    </p>
                </div>

                <!-- Profile and Newsletter cards grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Profile card -->
                    <div class="bg-surface border border-border rounded-lg p-6">
                        <FoundationHeadline tag="h2" class="text-lg font-semibold mb-4">
                            {{ $t('account.overviewProfileHeader') }}
                        </FoundationHeadline>
                        
                        <div class="space-y-2 mb-4">
                            <div v-if="user?.title">
                                {{ user.title }}
                            </div>
                            <div class="font-medium">
                                <span v-if="user?.salutation && user.salutation.salutationKey !== 'not_specified'">
                                    {{ user.salutation.translated?.displayName || user.salutation.displayName }}
                                </span>
                                {{ user?.firstName }} {{ user?.lastName }}
                            </div>
                            <div v-if="user?.activeBillingAddress?.company" class="text-muted-foreground">
                                {{ user.activeBillingAddress.company }}
                            </div>
                            <div class="text-muted-foreground">
                                {{ user?.email }}
                            </div>
                        </div>

                        <div class="flex justify-end pt-4 border-t border-border">
                            <NuxtLink :to="localePath('/account/profile')" class="text-primary hover:text-primary/80">
                                {{ $t('account.change') }}
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Newsletter card -->
                    <div class="bg-surface border border-border rounded-lg p-6">
                    <FoundationHeadline tag="h2" class="text-lg font-semibold mb-4">
                        {{ $t('account.newsletterTitle') }}
                    </FoundationHeadline>

                        <div class="space-y-4">
                            <div class="flex items-center space-x-3">
                                <div v-if="isUpdatingNewsletter" class="flex items-center">
                                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                                </div>
                                <FoundationCheckbox
                                    v-else
                                    id="newsletter-checkbox"
                                    v-model="newsletter"
                                    :disabled="isUpdatingNewsletter"
                                    @change="updateNewsletterStatus"
                                />
                                <label 
                                    for="newsletter-checkbox" 
                                    class="text-base"
                                    :class="{ 'cursor-pointer': !isUpdatingNewsletter, 'cursor-not-allowed opacity-50': isUpdatingNewsletter }"
                                >
                                    {{ $t('newsletter.subscriptionCheckbox') }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Addresses section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Default billing address -->
                    <div class="bg-surface border border-border rounded-lg p-6">
                        <FoundationHeadline tag="h2" class="text-lg font-semibold mb-4">
                            {{ $t('account.defaultBillingAddressHeader') }}
                        </FoundationHeadline>

                        <div v-if="userDefaultBillingAddress" class="space-y-2 mb-4">
                            <div class="font-medium">
                                <span v-if="userDefaultBillingAddress.salutation && userDefaultBillingAddress.salutation.salutationKey !== 'not_specified'">
                                    {{ userDefaultBillingAddress.salutation.translated?.displayName || userDefaultBillingAddress.salutation.displayName }}
                                </span>
                                {{ userDefaultBillingAddress.firstName }} {{ userDefaultBillingAddress.lastName }}
                            </div>
                            <div v-if="userDefaultBillingAddress.company">
                                {{ userDefaultBillingAddress.company }}
                            </div>
                            <div>
                                {{ userDefaultBillingAddress.street }}
                            </div>
                            <div>
                                {{ userDefaultBillingAddress.zipcode }} {{ userDefaultBillingAddress.city }}
                            </div>
                            <div>
                                {{ userDefaultBillingAddress.country?.translated?.name || userDefaultBillingAddress.country?.name }}
                            </div>
                        </div>
                        <div v-else class="text-muted-foreground mb-4">
                            {{ $t('account.noDefaultBillingAddress') }}
                        </div>

                        <div class="flex justify-end pt-4 border-t border-border">
                            <NuxtLink :to="localePath('/account/address')" class="text-primary hover:text-primary/80">
                                {{ $t('account.change') }}
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Default shipping address -->
                    <div class="bg-surface border border-border rounded-lg p-6">
                        <FoundationHeadline tag="h2" class="text-lg font-semibold mb-4">
                            {{ $t('account.defaultShippingAddressHeader') }}
                        </FoundationHeadline>

                        <div v-if="userDefaultShippingAddress" class="space-y-2 mb-4">
                            <div class="font-medium">
                                <span v-if="userDefaultShippingAddress.salutation && userDefaultShippingAddress.salutation.salutationKey !== 'not_specified'">
                                    {{ userDefaultShippingAddress.salutation.translated?.displayName || userDefaultShippingAddress.salutation.displayName }}
                                </span>
                                {{ userDefaultShippingAddress.firstName }} {{ userDefaultShippingAddress.lastName }}
                            </div>
                            <div v-if="userDefaultShippingAddress.company">
                                {{ userDefaultShippingAddress.company }}
                            </div>
                            <div>
                                {{ userDefaultShippingAddress.street }}
                            </div>
                            <div>
                                {{ userDefaultShippingAddress.zipcode }} {{ userDefaultShippingAddress.city }}
                            </div>
                            <div>
                                {{ userDefaultShippingAddress.country?.translated?.name || userDefaultShippingAddress.country?.name }}
                            </div>
                        </div>
                        <div v-else class="text-muted-foreground mb-4">
                            {{ $t('account.noDefaultShippingAddress') }}
                        </div>

                        <div class="flex justify-end pt-4 border-t border-border">
                            <NuxtLink :to="localePath('/account/address')" class="text-primary hover:text-primary/80">
                                {{ $t('account.change') }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- Newest order section - placeholder -->
                <div class="bg-surface border border-border rounded-lg p-6">
                    <FoundationHeadline tag="h2" class="text-lg font-semibold mb-4">
                        {{ $t('account.overviewNewestOrderHeader') }}
                    </FoundationHeadline>

                    <div class="text-muted-foreground mb-4">
                        {{ $t('account.page.comingSoon') }}
                    </div>

                    <div class="flex justify-end pt-4 border-t border-border">
                        <NuxtLink :to="localePath('/account/orders')" class="text-primary hover:text-primary/80">
                            {{ $t('account.viewAllOrders') }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>