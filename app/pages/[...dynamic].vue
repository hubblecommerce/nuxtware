<script setup lang='ts'>
import type { Schemas } from '#shopware';
import { pascalCase } from 'scule';

const route = useRoute();
const { locale } = useI18n();
const routePath = route.path.replace(new RegExp('\\b'+`${locale.value}`+'\\b'), '').replace('//', '/');
const { localeProperties } = useI18n();

const { data, error } = await useAsyncData(
    'cmsResponse' + routePath,
    async () => {
        const data = await $fetch('/seo-url', {
            method: 'POST',
            headers: {
                ...(localeProperties.value.localeId && { 'sw-language-id': localeProperties.value.localeId })
            },
            body: {
                slug: routePath,
            }
        });

        return { payload: data };
    },
);

if (!data?.value?.payload) {
    throw createError({
        statusCode: 404,
        message: 'not found',
        fatal: true
    })
}

if (error.value) {
    showError(error.value as Error)
}

const { routeName, foreignKey } = useNavigationContext(
    data?.value?.payload as Ref<Schemas['SeoUrl']>,
);

const pageComponent = computed(() => {
    return resolveComponent(pascalCase(routeName.value as string));
});
</script>

<template>
    <component :is='pageComponent' v-if='pageComponent' :navigation-id='foreignKey' />
</template>
