<template>
    <!-- Loading Placeholder -->
    <div v-if="isInitializing" class="p-6 border border-border rounded-lg bg-surface">
        <div class="animate-pulse">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="h-5 bg-border rounded w-48 mb-2" />
                    <div class="h-4 bg-border rounded w-32" />
                </div>
                <div class="h-8 bg-border rounded w-20" />
            </div>
        </div>
    </div>

    <!-- Login Section -->
    <div v-else-if="!isUserSession && contactSubStep === 'login'">
        <AccountLogin
            @login-success="emit('login-success')"
            @switch-to-register="emit('switch-to-register')"
        />
    </div>

    <!-- Registration Section -->
    <div v-else-if="!isUserSession && contactSubStep === 'registration'">
        <AccountRegistration
            allow-guest
            @registration-success="emit('registration-success')"
            @switch-to-login="emit('switch-to-login')"
        />
    </div>

    <!-- User Info Section (when logged in) -->
    <div v-else-if="isUserSession" class="p-6 border border-border rounded-lg bg-surface">
        <div class="flex items-center justify-between">
            <div>
                <FoundationHeadline tag="h3" class="text-lg font-medium mb-1">
                    {{ $t('checkout.loggedInAs') }} {{ user?.firstName }}
                </FoundationHeadline>
                <p class="text-sm text-secondary">
                    <span v-if="isGuestSession">{{ $t('checkout.guest') }}</span>
                    <span v-else>{{ user?.email }}</span>
                </p>
            </div>
            <FoundationButton
                variant="outline"
                size="small"
                @click="emit('logout')"
            >
                {{ $t('checkout.logOut') }}
            </FoundationButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Schemas } from '#shopware'

interface CheckoutLoginProps {
    isInitializing: boolean
    contactSubStep: 'login' | 'registration'
    isUserSession: boolean
    user?: Schemas['Customer'] | null
    isGuestSession?: boolean
}

defineProps<CheckoutLoginProps>()

const emit = defineEmits<{
    (e: 'login-success'): void
    (e: 'registration-success'): void
    (e: 'switch-to-login'): void
    (e: 'switch-to-register'): void
    (e: 'logout'): void
}>()
</script>