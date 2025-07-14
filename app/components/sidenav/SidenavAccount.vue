<script setup lang="ts">
interface SidenavAccountProps {
    showCloseButton?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<SidenavAccountProps>(), {
    showCloseButton: true
})

// Global sidenav state management
const { isOpen, close } = useSidenav()
const accountOpen = isOpen('account')

// User data and authentication
const { user, isGuestSession, logout } = useUser()

// i18n
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

// Account navigation links based on Shopware structure
const accountLinks = [
    {
        href: '/account',
        label: 'account.nav.overview',
        icon: 'home'
    },
    {
        href: '/account/profile',
        label: 'account.nav.profile',
        icon: 'user'
    },
    {
        href: '/account/address',
        label: 'account.nav.address',
        icon: 'map-pin'
    },
    {
        href: '/account/orders',
        label: 'account.nav.orders',
        icon: 'package'
    }
]

// Handle navigation
const handleNavigation = (href: string) => {
    navigateTo(formatLink(href))
    accountOpen.value = false
}

// Handle logout
const handleLogout = async () => {
    try {
        await logout()
        accountOpen.value = false
        navigateTo(formatLink('/'))
    } catch (error) {
        console.error('Logout failed:', error)
    }
}
</script>

<template>
    <SidenavOverlay
        v-model="accountOpen"
        direction="right"
        width-class="w-[90%] md:w-[400px]"
    >
        <div class="flex flex-col h-full bg-white">
            <!-- Header with personalized greeting -->
            <header class="flex items-center justify-between p-2 pl-4 pr-0 border-b border-border">
                <FoundationHeadline 
                    level="h2" 
                    class="text-lg font-medium"
                    :level-style="false"
                >
                    <!-- Personalized greeting -->
                    <template v-if="user && !isGuestSession">
                        {{ $t('account.greetings') }}
                        <span v-if="user.title" class="font-medium">{{ user.title }}</span> <span v-if="user.firstName" class="font-medium">{{ user.firstName }}</span> <span v-if="user.lastName" class="font-medium">{{ user.lastName }}</span>
                    </template>
                    <template v-else>
                        {{ $t('account.nav.title') }}
                    </template>
                </FoundationHeadline>
                
                <FoundationButton 
                    v-if="showCloseButton"
                    :aria-label="$t('account.nav.close')"
                    variant="ghost"
                    square
                    @click="close('account')"
                >
                    <FoundationIcon name="x" />
                </FoundationButton>
            </header>
            
            <!-- Navigation Links -->
            <nav v-if="!isGuestSession" class="flex-grow p-2" :aria-label="$t('account.nav.title')">
                <ul class="space-y-1">
                    <li v-for="link in accountLinks" :key="link.href">
                        <FoundationButton
                            :aria-label="$t(link.label)"
                            variant="ghost"
                            class="w-full justify-start text-left px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            @click="handleNavigation(link.href)"
                        >
                            <FoundationIcon :name="link.icon" class="mr-3" />
                            {{ $t(link.label) }}
                        </FoundationButton>
                    </li>
                </ul>
            </nav>
            
            <!-- Footer with logout -->
            <footer class="p-2 border-t border-border mt-auto">
                <FoundationButton
                    variant="ghost"
                    class="w-full justify-start text-left px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    :aria-label="isGuestSession ? $t('account.guestAbort') : $t('account.logout')"
                    @click="handleLogout"
                >
                    <FoundationIcon name="log-out" class="mr-3" />
                    {{ isGuestSession ? $t('account.guestAbort') : $t('account.logout') }}
                </FoundationButton>
            </footer>
        </div>
    </SidenavOverlay>
</template>