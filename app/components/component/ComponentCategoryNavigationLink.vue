<script setup lang="ts">
import {
    buildUrlPrefix,
    getCategoryRoute,
    getTranslatedProperty,
    urlIsAbsolute,
} from "@shopware/helpers";
import { computed } from "vue";
import { useUrlResolver } from "#imports";
import type { Schemas } from "#shopware";

interface Props {
    navigationElement: Schemas["Category"];
    isActive?: boolean;
    isHighlighted?: boolean;
}

const props = defineProps<Props>();
const { getUrlPrefix } = useUrlResolver();
const url = computed(() => {
    return buildUrlPrefix(
        getCategoryRoute(props.navigationElement),
        getUrlPrefix(),
    );
});
</script>
<template>
    <div
        class="flex items-center py-2 px-5 text-base my-2"
    >
        <FoundationLink
            v-if="!urlIsAbsolute(url.path)"
            :to="url"
            :class="[
                props.isHighlighted ? 'font-bold' : 'font-normal',
                {'text-indigo-600' : props.isActive }
            ]"
        >
            <span>{{ getTranslatedProperty(navigationElement, "name") }}</span>
        </FoundationLink>

        <FoundationLink
            v-else
            :href="url.path"
            :class="[
                props.isHighlighted ? 'font-bold' : 'font-normal',
                props.isActive ? 'text-indigo-600' : 'text-gray-900',
              ]"
            :target="
                navigationElement.externalLink || navigationElement.linkNewTab
                    ? '_blank'
                : ''
            "
        >
            <span>{{ getTranslatedProperty(navigationElement, "name") }}</span>
        </FoundationLink>
    </div>
</template>
