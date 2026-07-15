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
                ...(localeProperties.value.localeId ? { 'sw-language-id': localeProperties.value.localeId as string } : {})
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
        status: 404,
        statusText: 'not found',
        fatal: true
    })
}

if (error.value) {
    showError(error.value as Error)
}

const { routeName, foreignKey } = useNavigationContext(
    computed(() => (data.value?.payload ?? null) as Schemas['SeoUrl'] | null),
);

const pageComponent = computed(() => {
    return resolveComponent(pascalCase(routeName.value as string));
});
</script>

<template>
    <component :is='pageComponent' v-if='pageComponent' :navigation-id='foreignKey' />
</template>
