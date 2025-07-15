<script setup lang="ts">
import type { Schemas } from "#shopware"

const props = defineProps<{
    navigationId: string
}>()

const { search } = useLandingSearch()

const { data: landingResponse, error } = await useAsyncData(
    `cmsLanding${props.navigationId}`,
    async () => {
        const landingPage = await search(props.navigationId, {
            withCmsAssociations: true,
        })
        return landingPage
    },
)

if (!landingResponse?.value) {
    console.error("[FrontendLandingPage.vue]", error.value?.message)
    throw createError({
        statusCode: 500,
        message: error.value?.message,
    })
}

const landingPage = landingResponse as Ref<Schemas["LandingPage"]>
</script>

<template>
    <StructurePage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
</template>
