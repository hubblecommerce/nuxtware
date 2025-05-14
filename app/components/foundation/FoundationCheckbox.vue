<template>
    <input
        ref="foundationCheckbox"
        v-model="model"
        :type="type"
        :disabled="disabled"
        :aria-disabled="disabled"
    >
</template>

<script setup lang="ts">
import type { FoundationCheckboxProps } from '#imports'

withDefaults(defineProps<FoundationCheckboxProps>(), {
    type: 'checkbox',
    disabled: false
})

const model = defineModel<string|string[]>()
const foundationCheckbox = ref<HTMLInputElement>()

defineExpose({ foundationCheckbox })
</script>
