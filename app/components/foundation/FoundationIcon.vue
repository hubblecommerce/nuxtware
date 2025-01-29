<template>
  <span
      :class="['foundation-icon', sizeClass]"
      :aria-hidden="!alt"
      :role="alt ? 'img' : undefined"
      :aria-label="alt"
      v-html="sanitizedIcon"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IconProps } from '#imports'

const props = withDefaults(defineProps<IconProps>(), {
    size: 'md',
    alt: undefined
})

const icon = ref<string>('')

const sizeClass = computed(() => {
    const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
        '2xl': 'w-16 h-16'
    }
    return sizes[props.size]
})

const sanitizedIcon = computed(() => {
    if (!import.meta.client) {
        return icon.value
    }

    const div = document.createElement('div')
    div.innerHTML = icon.value.trim();
    const svg = div.querySelector('svg')
    if (svg) {
        // Remove potentially harmful attributes
        const removeAttrs = ['onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousemove', 'onmouseenter', 'onmouseleave']
        removeAttrs.forEach(attr => svg.removeAttribute(attr))

        // Remove potentially harmful elements
        const removeElements = ['script', 'use']
        removeElements.forEach(el => {
            svg.querySelectorAll(el).forEach(node => node.remove())
        })

        return svg.outerHTML
    }
    return ''
})

async function loadIcon() {
    try {
        const iconModule = await import(`../../assets/icons/${props.name}.svg?raw`)
        icon.value = iconModule.default
    } catch (e) {
        console.error(`Icon '${props.name}' doesn't exist in 'assets/icons'`, e)
        icon.value = ''
    }
}

await loadIcon()
</script>
