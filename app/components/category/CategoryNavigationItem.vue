<script setup lang="ts">
import {
    buildUrlPrefix,
    getCategoryRoute,
    getTranslatedProperty,
    urlIsAbsolute,
} from "@shopware/helpers"
import { useUrlResolver } from "#imports"
import type { Schemas } from "#shopware"

const props = defineProps<{
    navigationElement: Schemas["Category"]
    isActive?: boolean
    isHighlighted?: boolean
    isExpanded?: boolean
}>()

const { getUrlPrefix } = useUrlResolver()

const url = computed(() => {
    return buildUrlPrefix(
        getCategoryRoute(props.navigationElement),
        getUrlPrefix(),
    )
})
</script>
<template>
    <div class="flex items-center py-2 px-5 text-base my-2">
        <FoundationLink
            v-if="!urlIsAbsolute(url.path)"
            :to="url.path"
            :class="[
                props.isHighlighted ? 'font-bold' : 'font-normal',
                {'text-secondary' : props.isActive }
            ]"
            :aria-expanded="props.isExpanded"
        >
            <span>{{ getTranslatedProperty(props.navigationElement, "name") }}</span>
        </FoundationLink>

        <FoundationLink
            v-else
            :to="url.path"
            :class="[
                props.isHighlighted ? 'font-bold' : 'font-normal',
                {'text-secondary' : props.isActive }
            ]"
            :target="
                props.navigationElement.externalLink || props.navigationElement.linkNewTab
                    ? '_blank'
                : undefined
            "
        >
            <span>{{ getTranslatedProperty(props.navigationElement, "name") }}</span>
        </FoundationLink>
    </div>
</template>
