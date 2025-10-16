<script setup lang="ts">
const { t } = useI18n()

useHead({
    title: t('newsletter.title')
})
</script>

<template>
    <div class="mx-auto w-full max-w-8xl px-2 py-8">
        <div class="max-w-4xl mx-auto">
            <fieldset>
                <FormsNewsletter />
            </fieldset>
        </div>
    </div>
</template>