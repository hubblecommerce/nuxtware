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
    <ComponentFieldset :legend="false">
        <LazyFormsNewsletter
            v-if="formType === 'newsletter'"
            :content="props.content"
        />
        <LazyFormsContact
            v-else-if="formType === 'contact'"
            :content="props.content"
        />
    </ComponentFieldset>
</template>