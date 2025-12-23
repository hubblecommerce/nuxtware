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
import type { IconProps } from '../../types/foundation-icon'

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

const { sanitizeHtml } = useSanitization()

const sanitizedIcon = computed(() => {
    return sanitizeHtml(icon.value, {
        allowedTags: ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'g', 'defs', 'clipPath', 'mask'],
        removeElements: ['script', 'use']
    })
})

async function loadIcon() {
    try {
        const iconModule = await import(`#nuxtware/assets/icons/${props.name}.svg?raw`)
        icon.value = iconModule.default
    } catch (e) {
        console.error(`Icon '${props.name}' doesn't exist in 'assets/icons'`, e)
        icon.value = ''
    }
}

await loadIcon()

watch(() => props.name, async () => {
    await loadIcon()
})
</script>
