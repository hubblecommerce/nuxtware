<script setup lang="ts">
import { computed } from 'vue'
import type { CmsElementHtml } from '@shopware/composables'

const props = defineProps<{
    content: CmsElementHtml
}>()

const { sanitizeHtml } = useSanitization()

const htmlContent = computed(() => {
    return props.content?.data?.content || ''
})

const sanitizedContent = computed(() => {
    return sanitizeHtml(htmlContent.value, {
        // Allow buttons and common HTML elements, but remove dangerous ones
        removeElements: ['script', 'object', 'embed']
    })
})
</script>

<template>
    <div v-html="sanitizedContent" />
</template>