<script setup lang="ts">
import type { CmsElementForm } from '@shopware/composables'

const props = defineProps<{
    content: CmsElementForm
}>()

const formType = computed(() => {
    return props.content.config.type.value
})
</script>
<template>
    <fieldset class="space-y-6 p-6 border border-border rounded-lg bg-surface">
        <!-- Other form type components here -->
        <LazyFormsNewsletter
            v-if="formType === 'newsletter'"
            :content="props.content"
        />
    </fieldset>
</template>