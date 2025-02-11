<script setup lang="ts">
export interface HeadlineProps {
    tag?: string;
    text?: string;
}

withDefaults(defineProps<HeadlineProps>(), {
    tag: 'h2',
    text: '',
})
</script>

<template>
    <component :is="tag">
        <slot>{{ text }}</slot>
    </component>
</template>
