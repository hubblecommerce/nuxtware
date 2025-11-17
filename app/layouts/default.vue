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

    <!-- Footer -->
    <LayoutFooter :depth-footer-navigation="1" :depth-service-navigation="1" />
</template>
