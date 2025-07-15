<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ComponentTextareaProps, ComponentTextareaColor } from '../../types/component-textarea'

withDefaults(defineProps<ComponentTextareaProps>(), {
    showLabel: true,
    placeholder: '',
    error: '',
    helperText: '',
    description: '',
    color: '',
    bordered: false,
    textareaCss: '',
    rows: 4,
    disabled: false,
    readonly: false,
    required: false,
    wrap: 'soft'
});

const model = defineModel<string>()

const componentTextarea = ref<HTMLTextAreaElement>()
defineExpose({ componentTextarea })

const textareaColors = reactive<Record<ComponentTextareaColor, string>>({
    '': '',
    primary: 'textarea-primary',
    secondary: 'textarea-secondary',
    tertiary: 'textarea-tertiary',
})

const emit = defineEmits(['onFocus', 'onBlur'])
function onFocus (e: FocusEvent): void { emit('onFocus', e) }
function onBlur (e: FocusEvent): void { emit('onBlur', e) }
</script>

<template>
    <div>
        <FoundationLabel
            v-if="showLabel"
            :for="id"
            class="block mb-1"
            :class="{
                'label-required': required,
                'text-error': error,
            }"
        >
            {{ label }}
        </FoundationLabel>

        <p 
            v-if="description" 
            class="text-sm text-neutral mb-2"
        >
            {{ description }}
        </p>

        <div class="relative">
            <slot name="iconBefore" />
            
            <FoundationTextarea
                :id="id"
                ref="componentTextarea"
                v-model="model"
                :class="[
                    textareaColors[color],
                    textareaCss,
                    {
                        'textarea-bordered': bordered,
                        'textarea-error': error,
                    }
                ]"
                :placeholder="placeholder"
                :rows="rows"
                :cols="cols"
                :maxlength="maxlength"
                :minlength="minlength"
                :wrap="wrap"
                :disabled="disabled"
                :readonly="readonly"
                :required="required"
                @focus="onFocus"
                @blur="onBlur"
            />
            
            <slot name="iconAfter" />
        </div>

        <div
            v-if="error"
            class="text-error text-sm mt-1"
        >
            {{ error }}
        </div>

        <div
            v-else-if="helperText"
            class="text-neutral text-sm mt-1"
        >
            {{ helperText }}
        </div>
    </div>
</template>