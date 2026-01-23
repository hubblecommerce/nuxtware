<script setup lang="ts">

const props = defineProps<{
    navigationId: string
}>()

const { search } = useLandingSearch()

const { data: landingResponse, error } = await useAsyncData(
    `cmsLanding${props.navigationId}`,
    async () => {
        return await search(props.navigationId, {
            withCmsAssociations: true,
        })
    },
)

if (!landingResponse?.value) {
    console.error("[FrontendLandingPage.vue]", error.value?.message)
    throw createError({
        status: 500,
        statusText: error.value?.message,
    })
}
</script>

<template>
    <StructurePage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
</template>
