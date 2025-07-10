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

const isClient = ref(false)

const renderedContent = computed(() => {
    if (!textContent.value) return h('div')
    
    // Only enhance on client after hydration to avoid mismatches
    if (!isClient.value) {
        return h('div', { innerHTML: textContent.value })
    }
    
    const nodes = parseHtmlToNodes(textContent.value).filter(Boolean) as (VNode | string)[]
    return h('div', {}, nodes)
})

onMounted(() => {
    isClient.value = true
})
</script>

<template>
    <div v-if="textContent" class="cms-element-text">
        <component :is="renderedContent" />
    </div>
</template>
