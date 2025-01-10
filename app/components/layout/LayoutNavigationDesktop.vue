<script setup lang="ts">
import {
    getCategoryRoute,
    getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";

const navigationElements = inject('mainNavigation') as Schemas["NavigationRouteResponse"]
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>

<template>
    <div class="flex gap-3 underline">
        <NuxtLinkLocale to="/">Home</NuxtLinkLocale> <NuxtLinkLocale to="/route-does-not-exists">404</NuxtLinkLocale>
        <template
            v-for="navigationElement in navigationElements"
            :key="navigationElement.id"
        >
            <NuxtLink
                role="menuitem"
                :target="navigationElement.externalLink || navigationElement.linkNewTab ? '_blank' : ''"
                :to="formatLink(getCategoryRoute(navigationElement))"
            >
                {{ getTranslatedProperty(navigationElement, "name") }}
            </NuxtLink>
        </template>
    </div>
</template>
