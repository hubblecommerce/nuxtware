<template>
    <input
        ref="foundationInput"
        v-model="model"
        :type="type"
        :disabled="disabled"
        :aria-disabled="disabled"
    >
</template>

<script setup lang="ts">
import type { FoundationInputTextProps } from '../../types/foundation-input-text'

withDefaults(defineProps<FoundationInputTextProps>(), {
    type: 'text',
    disabled: false
})

const model = defineModel<string | number>()
const foundationInput = ref<HTMLInputElement>()

defineExpose({ foundationInput })
</script>
