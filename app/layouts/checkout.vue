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

    <!-- FooterLight -->
    <LayoutFooterLight :depth="1" class="w-full grid grid-cols-1 lg:grid-cols-12" />
</template>