<script setup lang="ts">
</script>
<template>
    <!-- Skip Link -->
    <LayoutSkipLinks />

    <!-- Top Bar -->
    <LayoutTopBar />

    <!-- Header -->
    <LayoutHeader />

    <main>
        <slot />
        <MiscScrollToTopButton />
    </main>

    <!-- Cart Sidenav -->
    <SidenavCart />
    
    <!-- Account Sidenav -->
    <SidenavAccount />
    
    <!-- Global Notifications -->
    <NotificationContainer />

    <div class="w-full grid grid-cols-1 lg:sticky lg:left-0 lg:bottom-0 lg:grid-cols-12 lg:bg-base-300">
        <div class="p-4 lg:col-span-7 lg:py-4 lg:px-16 lg:border-t lg:border-r lg:border-base-300 lg:bg-base-100">
            <div class="lg:max-w-xl lg:ml-auto">
                <portal-target name="checkoutNavigation" />
            </div>
        </div>
    </div>

    <!-- FooterLight -->
    <LayoutFooterLight :depth="1" class="w-full grid" />
</template>