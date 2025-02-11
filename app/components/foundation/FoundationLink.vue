<template>
    <component
        :is="type === 'internal' ? NuxtLink : 'a'"
        :class="[
            'link',
            linkVariants[variant],
            { 'link-disabled': disabled }
        ]"
        :to="type === 'internal' && !disabled ? formatLink(href) : undefined"
        :href="type === 'external' ? href : undefined"
        :target="target"
        :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
        :disabled="disabled"
        :aria-disabled="disabled"
        @click="handleClick"
    >
        <slot>{{ text }}</slot>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'
import type { LinkVariants, LinkProps } from '#imports'

const props = withDefaults(defineProps<LinkProps>(), {
    text: '',
    href: '#',
    target: '_self',
    variant: 'default',
    type: 'internal',
    disabled: false,
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

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
