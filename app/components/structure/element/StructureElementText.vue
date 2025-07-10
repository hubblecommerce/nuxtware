<script setup lang="ts">
import { computed, h } from 'vue'
import type { VNode } from 'vue'
import type { CmsElementText } from '@shopware/composables'

const props = defineProps<{
    content: CmsElementText
}>()

const textContent = computed(() => {
    return props.content?.data?.content || ''
})

const { formatLink } = useInternationalization(useLocalePath())

const parseHtmlToNodes = (htmlString: string) => {
    if (!htmlString) return []
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString
    
    const processNode = (node: Node): VNode | string | null => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            const tagName = element.tagName.toLowerCase()
            const attributes = Array.from(element.attributes).reduce((acc, attr) => {
                acc[attr.name] = attr.value
                return acc
            }, {} as Record<string, string>)
            
            const children = Array.from(element.childNodes).map(processNode).filter(Boolean) as (VNode | string)[]
            
            // Handle all links - use FoundationLink
            if (tagName === 'a') {
                const href = attributes.href || '#'
                const isExternal = href.startsWith('http') || href.startsWith('//')
                
                return h(resolveComponent('FoundationLink'), {
                    href: isExternal ? href : formatLink(href),
                    type: isExternal ? 'external' : 'internal',
                    target: attributes.target,
                    class: attributes.class
                }, () => children)
            }
            
            // Handle other HTML elements normally
            return h(tagName, {
                ...attributes
            }, children.length > 0 ? children : undefined)
        }
        
        return null
    }
    
    return Array.from(tempDiv.childNodes).map(processNode).filter(Boolean)
}

const renderedContent = computed(() => {
    if (!textContent.value) return []
    
    // Only parse on client side to avoid SSR issues
    if (import.meta.server) {
        return [h('div', { innerHTML: textContent.value })]
    }
    
    return parseHtmlToNodes(textContent.value).filter(Boolean) as (VNode | string)[]
})
</script>

<template>
    <div v-if="textContent" class="cms-element-text">
        <component v-for="(node, index) in renderedContent" :is="node" :key="index" />
    </div>
</template>
