<script setup lang="ts">
import { pascalCase } from 'scule'
import { resolveComponent } from 'vue'
import type { Ref } from 'vue'
import type { Schemas } from '#shopware'

const { resolvePath } = useNavigationSearch()
const route = useRoute()
const { locale } = useI18n()
const routePath = route.path.replace(`${locale.value}`, '').replace('//', '/')

const { data: seoResult } = await useAsyncData(
    `cmsResponse${routePath}`,
    async () => {
        return resolvePath(routePath)
    },
)

if (!seoResult.value?.foreignKey) {
    console.error('index.vue:', `No data found in API for ${routePath}`)
    
    throw createError({
        statusCode: 404,
        statusMessage: `No data fetched from API for ${routePath}`,
    })
}

const { routeName, foreignKey } = useNavigationContext(
    seoResult as Ref<Schemas['SeoUrl']>,
)

const pageComponent = computed(() => {
    return resolveComponent(pascalCase(routeName.value as string))
})
</script>

<template>
    <component :is="pageComponent" v-if="pageComponent" :navigation-id="foreignKey" />
</template>
