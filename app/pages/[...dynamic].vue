<script setup lang='ts'>
import { pascalCase } from 'scule'

const { resolvePath } = useNavigationSearch()
const route = useRoute()
const { locale } = useI18n()
const routePath = route.path.replace(new RegExp('\\b' + `${locale.value}` + '\\b'), '').replace('//', '/')

const { data: seoResult, error } = await useAsyncData(
    `cmsResponse${routePath}`,
    () => resolvePath(routePath),
)

if (error.value) {
    showError(error.value as Error)
}

if (!seoResult.value?.foreignKey) {
    throw createError({
        status: 404,
        statusText: 'not found',
        fatal: true,
    })
}

const { routeName, foreignKey } = useNavigationContext(computed(() => seoResult.value ?? null))

const pageComponent = computed(() => {
    return resolveComponent(pascalCase(routeName.value as string))
})
</script>

<template>
    <component :is='pageComponent' v-if='pageComponent' :navigation-id='foreignKey' />
</template>
