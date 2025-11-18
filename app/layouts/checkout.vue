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

    <div class="w-full grid grid-cols-1 lg:sticky lg:left-0 lg:bottom-0 lg:grid-cols-3 xl:gap-16 lg:bg-base-300">
        <div class="p-4 lg:col-span-2 lg:py-4 lg:px-16 xl:mr-8 lg:border-t lg:border-r lg:border-border rounded-tr-lg lg:bg-base-100">
            <div class="lg:max-w-xl lg:ml-auto">
                <div id="CheckoutNavigation" />
            </div>
        </div>
    </div>

    <!-- FooterLight -->
    <LayoutFooterLight :depth="1" class="w-full grid" />
</template>