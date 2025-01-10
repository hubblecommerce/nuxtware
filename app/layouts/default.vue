<script setup lang="ts">
const { loadNavigationElements } = useNavigationCached()
const { data } = useAsyncData("navigation", () => {
    return loadNavigationElements({ depth: 3 })
})
provide('mainNavigation', data)
</script>

<template>
    <div>
        <header>
            <LayoutNavigationDesktop />
        </header>
        <main>
            <slot />
        </main>
        <footer />
    </div>
</template>
