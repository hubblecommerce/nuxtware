<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs()
const localePath = useLocalePath()
</script>

<template>
    <nav
        class="hidden lg:flex lg:container mx-auto mb-6"
        aria-label="Breadcrumb"
    >
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
                <NuxtLink
                    :to="localePath('/')"
                    class="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                >
                    <FoundationIcon name="home" class="w-4 h-4 mr-2" />
                    {{ $t('breadcrumbs.home') }}
                </NuxtLink>
                <FoundationIcon name="chevron-right" class="w-4 h-4 mx-2 text-muted-foreground" />
            </li>
            <li
                v-for="(breadcrumb, index) in breadcrumbs"
                :key="breadcrumb.path"
                class="inline-flex items-center"
            >
                <NuxtLink
                    v-if="breadcrumb.path"
                    :to="localePath(breadcrumb.path)"
                    class="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                >
                    {{ breadcrumb.name }}
                </NuxtLink>
                <span
                    v-else
                    class="inline-flex items-center text-sm font-medium text-foreground"
                >
                    {{ breadcrumb.name }}
                </span>
                <FoundationIcon
                    v-if="index < breadcrumbs.length - 1"
                    name="chevron-right"
                    class="w-4 h-4 mx-2 text-muted-foreground"
                />
            </li>
        </ol>
    </nav>
</template>
