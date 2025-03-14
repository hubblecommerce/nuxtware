<script setup lang="ts">
import type { Schemas } from '#shopware'

const mobileMenuOpen = ref(false)
const sidenavMenuCloseButton = shallowRef()
const navigationItems = inject('mainNavigation') as Schemas["NavigationRouteResponse"]
</script>

<template>
    <FoundationButton
        size="medium"
        variant="ghost"
        class="shrink-0 w-12 order-10 lg:hidden"
        square
        :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
        @click="mobileMenuOpen = true"
    >
        <span class="sr-only">{{ $t('sidenav.menu.mobile.open') }}</span><FoundationIcon name="menu" />
    </FoundationButton>

    <SidenavOverlay v-model="mobileMenuOpen" class="bg-white" width-class="w-[90%] lg:w-[400px]">
        <nav class="w-full" :aria-label="$t('sidenav.menu.mobile.description')">
            <div class="flex justify-between items-center p-2 pr-0">
                <FoundationHeadline tag="h2" class="text-lg font-semibold">
                    {{ $t('sidenav.menu.mobile.title') }}</FoundationHeadline>
                <FoundationButton
                    ref="sidenavMenuCloseButton"
                    size="medium"
                    variant="ghost"
                    square
                    @click="mobileMenuOpen = false"
                >
                    <span class="sr-only">{{ $t('sidenav.menu.mobile.close') }}</span>
                    <FoundationIcon name="x" />
                </FoundationButton>
            </div>

            <div class="relative h-[calc(100vh-64px)] w-full">
                <LazySidenavMenuRecursive v-if="mobileMenuOpen" :items="navigationItems" @navigate="mobileMenuOpen = false" />
            </div>
        </nav>
    </SidenavOverlay>
</template>
