<template>
    <textarea
        ref="foundationTextarea"
        v-model="model"
        class="textarea"
        :disabled="disabled"
        :aria-disabled="disabled"
        :rows="rows"
        :cols="cols"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :minlength="minlength"
        :readonly="readonly"
        :required="required"
        :wrap="wrap"
    />
</template>

<script setup lang="ts">
import type { FoundationTextareaProps } from '../../types/foundation-textarea'

withDefaults(defineProps<FoundationTextareaProps>(), {
    disabled: false,
    readonly: false,
    required: false,
    rows: 4,
    wrap: 'soft'
})

const model = defineModel<string>()
const foundationTextarea = ref<HTMLTextAreaElement>()

defineExpose({ foundationTextarea })
</script>