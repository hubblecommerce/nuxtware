<script setup lang="ts">
import {useNavigation} from "#imports";
import {getCategoryRoute, getTranslatedProperty} from "@shopware/helpers";

const props = withDefaults(
    defineProps<{
        depth?: number;
    }>(),
    {
        depth: 0,
    },
)

const { loadNavigationElements } = useNavigation({ type: "service-navigation" })
const footerNavigation = await loadNavigationElements({ depth: props.depth })
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
</script>
<template>
    <footer class="px-4 py-5 bg-border-light flex flex-col lg:gap-0">
        <section class="flex flex-wrap justify-start text-sm underline gap-4">
            <ul
                v-for="navigationElement in footerNavigation"
                :key="navigationElement.id"
            >
                <li>
                    <FoundationLink
                        :target="navigationElement.externalLink || navigationElement.linkNewTab
                        ? '_blank'
                        : undefined
                    "
                        :to="formatLink(getCategoryRoute(navigationElement))"
                    >
                        {{ getTranslatedProperty(navigationElement, "name") }}
                    </FoundationLink>
                </li>
            </ul>
        </section>
    </footer>
</template>
