<template>
    <component
        :is="type === 'internal' ? NuxtLink : 'a'"
        :class="[
            'link',
            linkVariants[variant],
            { 'link-disabled': disabled }
        ]"
        :to="type === 'internal' && !disabled ? href : undefined"
        :href="type === 'external' ? href : undefined"
        :target="target"
        :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
        :disabled="disabled"
        :aria-disabled="disabled"
        :style="{ '--primary-color': color ?? undefined }"
        @click="handleClick"
    >
        <slot>{{ text }}</slot>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

type LinkVariants = 'default' | 'underline'
type LinkTarget = '_self' | '_blank' | '_parent' | '_top'
type LinkType = 'internal' | 'external'

interface LinkProps {
    text?: string
    href?: string
    target?: LinkTarget
    variant?: LinkVariants
    type?: LinkType,
    color?: string | undefined,
    disabled?: boolean
}

const props = withDefaults(defineProps<LinkProps>(), {
    text: '',
    href: '#',
    target: '_self',
    variant: 'default',
    type: 'internal',
    color: undefined,
    disabled: false,
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const linkVariants = computed((): Record<LinkVariants, string> => ({
    default: 'link-default',
    underline: 'link-underline',
}))

const handleClick = (event: MouseEvent) => {
    if (props.disabled) {
        event.preventDefault()
        return
    }
    emit('click', event)
}
</script>
