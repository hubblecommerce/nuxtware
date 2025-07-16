<script setup lang="ts">
import { getCategoryRoute, getTranslatedProperty } from "@shopware/helpers"
import type {Schemas} from "#shopware";

const props = defineProps<{
    navigation: Schemas["Category"][]
}>()

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
</script>
<template>
    <div
        v-for="navigationElement in props.navigation"
        :key="navigationElement.id"
    >
        <FoundationHeadline level="h3" class="font-semibold mb-4">
            {{ getTranslatedProperty(navigationElement, "name") }}
        </FoundationHeadline>
        <template v-if="navigationElement.childCount > 0">
            <ul class="list-none">
                <li
                    v-for="navigationChild in navigationElement.children"
                    :key="navigationChild.id"
                    class="pb-3 last:pb-0"
                >
                    <FoundationLink
                        :target="navigationElement.externalLink || navigationElement.linkNewTab
                        ? '_blank'
                        : undefined
                    "
                        class="text-neutral"
                        :to="formatLink(getCategoryRoute(navigationChild))"
                    >
                        {{ getTranslatedProperty(navigationChild, "name") }}
                    </FoundationLink>
                </li>
            </ul>
        </template>
    </div>
</template>
