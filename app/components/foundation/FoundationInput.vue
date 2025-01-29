<template>
    <input
        ref="input"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :aria-disabled="disabled"
        :class="[
            '',
            inputSizes[size],
            inputColors[color],
            {
                'input-bordered': bordered
            }
        ]"
    >
</template>

<script setup lang="ts">
import type { TextInputProps, InputSize, InputColor } from '#imports'

withDefaults(defineProps<TextInputProps>(), {
    type: 'text',
    placeholder: 'Input',
    size: 'md',
    color: '',
    bordered: false,
    disabled: false
})

const model = defineModel<string>()
const input = ref<HTMLInputElement>()

defineExpose({ input })

const inputSizes = reactive<Record<InputSize, string>>({
    xs: 'input-xs',
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
    xl: 'input-xl',
    '2xl': 'input-2xl',
})

const inputColors = reactive<Record<InputColor, string>>({
    '': '',
    primary: 'input-primary',
    secondary: 'input-secondary',
    tertiary: 'input-tertiary',
})
</script>
