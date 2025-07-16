<script setup lang="ts">
const { t } = useI18n()

useHead({
    title: t('newsletter.title')
})
</script>

<template>
    <div class="lg:container mx-auto px-2 py-8">
        <div class="max-w-4xl mx-auto">
            <fieldset>
                <FormsNewsletter />
            </fieldset>
        </div>
    </div>
</template>