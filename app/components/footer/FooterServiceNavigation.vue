<script setup lang="ts">
import {getCategoryRoute, getTranslatedProperty} from "@shopware/helpers";
import type {Schemas} from "#shopware";

const props = defineProps<{
    navigation: Schemas["Category"][]
}>()

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
</script>
<template>
    <ul
        v-for="navigationElement in props.navigation"
        :key="navigationElement.id"
    >
        <li>
            <FoundationLink
                :target="navigationElement.externalLink || navigationElement.linkNewTab
                ? '_blank'
                : undefined
            "
                class="text-neutral hover:underline"
                :to="formatLink(getCategoryRoute(navigationElement))"
            >
                {{ getTranslatedProperty(navigationElement, "name") }}
            </FoundationLink>
        </li>
    </ul>
</template>
