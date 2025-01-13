<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
    navigationId: string;
}>();

const { search } = useCategorySearch();
const route = useRoute();

const { data: categoryResponse } = await useAsyncData(
    "cmsNavigation" + props.navigationId,
    async () => {
        return await search(props.navigationId, {
            withCmsAssociations: true,
            query: {
                ...route.query
            }
        });
    },
);

const { category } = useCategory(categoryResponse as Ref<Schemas["Category"]>);
</script>

<template>
    <StructurePage v-if="category.cmsPage" :content="category.cmsPage" />
</template>
