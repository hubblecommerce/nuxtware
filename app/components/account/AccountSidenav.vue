<script setup lang="ts">
interface AccountSidenavProps {
    showCloseButton?: boolean
}

const { showCloseButton } = withDefaults(defineProps<AccountSidenavProps>(), {
    showCloseButton: true
})

// Two-way binding for controlling visibility
const isOpen = defineModel<boolean>()

// i18n
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

// Account navigation links
const accountLinks = [
    {
        href: '/account',
        label: 'account.nav.dashboard',
        icon: 'user'
    },
    {
        href: '/account/orders',
        label: 'account.nav.orders',
        icon: 'package'
    },
    {
        href: '/account/settings',
        label: 'account.nav.settings',
        icon: 'settings'
    }
]

// Handle navigation
const handleNavigation = (href: string) => {
    navigateTo(formatLink(href))
    isOpen.value = false
}
</script>

<template>
    <SidenavOverlay
        v-model="isOpen"
        direction="right"
        width-class="w-[90%] md:w-[400px]"
    >
        <div class="flex flex-col h-full bg-white">
            <!-- Header -->
            <header class="flex items-center justify-between p-2 pr-0 border-b border-border">
                <FoundationHeadline 
                    level="h2" 
                    class="text-lg font-medium"
                    :level-style="false"
                >
                    {{ $t('account.nav.title') }}
                </FoundationHeadline>
                
                <FoundationButton 
                    v-if="showCloseButton"
                    :aria-label="$t('account.nav.close')"
                    square
                    @click="isOpen = false"
                >
                    <FoundationIcon name="x" />
                </FoundationButton>
            </header>
            
            <!-- Navigation Links -->
            <nav class="flex-grow p-4">
                <ul class="space-y-2">
                    <li v-for="link in accountLinks" :key="link.href">
                        <FoundationButton
                            :aria-label="$t(link.label)"
                            variant="ghost"
                            class="w-full justify-start text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                            @click="handleNavigation(link.href)"
                        >
                            <FoundationIcon :name="link.icon" class="w-5 h-5 mr-3" />
                            {{ $t(link.label) }}
                        </FoundationButton>
                    </li>
                </ul>
            </nav>
        </div>
    </SidenavOverlay>
</template>