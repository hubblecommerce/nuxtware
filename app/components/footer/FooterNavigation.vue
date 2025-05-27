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
        <h3 class="mb-5">
            {{ getTranslatedProperty(navigationElement, "name") }}
        </h3>
        <template v-if="navigationElement.childCount > 0">
            <ul class="list-none p-0 mb-5">
                <li
                    v-for="navigationChild in navigationElement.children"
                    :key="navigationChild.id"
                    class="pb-3"
                >
                    <FoundationLink
                        :target="navigationElement.externalLink || navigationElement.linkNewTab
                        ? '_blank'
                        : undefined
                    "
                        :to="formatLink(getCategoryRoute(navigationChild))"
                    >
                        {{ getTranslatedProperty(navigationChild, "name") }}
                    </FoundationLink>
                </li>
            </ul>
        </template>
    </div>
</template>
