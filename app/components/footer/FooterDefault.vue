<script setup lang="ts">
import { getCategoryRoute, getTranslatedProperty } from "@shopware/helpers"
import { useNavigation } from "#imports"

const props = withDefaults(
    defineProps<{
        depth?: number;
    }>(),
    {
        depth: 0,
    },
)

const { loadNavigationElements } = useNavigation({ type: "footer-navigation" })
const footerNavigation = await loadNavigationElements({ depth: props.depth })
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
</script>
<template>
    <footer class="mt-2 lg:mt-8">
        <div class="border-t border-primary">
            <section class="flex flex-col sm:flex-row sm:gap-6 max-w-screen-3xl m-auto px-6 sm:py-6">
                <div class="flex flex-col sm:flex-row justify-start py-6 sm:p-0 sm:gap-4">
                    <div
                        v-for="navigationElement in footerNavigation"
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
                </div>
            </section>
        </div>
    </footer>
</template>
