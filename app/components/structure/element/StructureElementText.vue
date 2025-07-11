<script setup lang="ts">
import { computed } from 'vue'
import type { CmsElementText } from '@shopware/composables'
import { vInterpolate } from '../../../../directives/v-interpolate'

const props = defineProps<{
    content: CmsElementText
}>()

const textContent = computed(() => {
    return props.content?.data?.content || ''
})

const sanitizedContent = computed(() => {
    if (!textContent.value) return ''
    
    if (!import.meta.client) {
        return textContent.value
    }

    const div = document.createElement('div')
    div.innerHTML = textContent.value.trim()
    
    // Remove potentially harmful attributes
    const removeAttrs = ['onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onchange', 'onsubmit', 'onreset', 'onfocus', 'onblur']
    div.querySelectorAll('*').forEach(el => {
        removeAttrs.forEach(attr => el.removeAttribute(attr))
    })
    
    // Remove potentially harmful elements
    const removeElements = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'select', 'option']
    removeElements.forEach(tagName => {
        div.querySelectorAll(tagName).forEach(node => node.remove())
    })
    
    return div.innerHTML
})
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div 
        v-if="textContent" 
        v-interpolate 
        class="cms-element-text"
        v-html="sanitizedContent"
    />
</template>
