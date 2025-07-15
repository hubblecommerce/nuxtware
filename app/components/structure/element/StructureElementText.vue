<script setup lang="ts">
import { computed } from 'vue'
import type { CmsElementText } from '@shopware/composables'
import { vInterpolate } from '../../../../directives/v-interpolate'

const props = defineProps<{
    content: CmsElementText
}>()

const { sanitizeHtml } = useSanitization()

const textContent = computed(() => {
    return props.content?.data?.content || ''
})

const sanitizedContent = computed(() => {
    return sanitizeHtml(textContent.value, {
        removeElements: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'select', 'option']
    })
})
</script>

<template>
    <div 
        v-if="textContent" 
        v-interpolate 
        class="cms-element-text prose"
        v-html="sanitizedContent"
    />
</template>
