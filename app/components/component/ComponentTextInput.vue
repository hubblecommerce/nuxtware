<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ComponentInputProps, ComponentInputSize, ComponentInputColor } from '../../types/component-input'

withDefaults(defineProps<ComponentInputProps>(), {
    showLabel: true,
    placeholder: '',
    type: 'text',
    error: '',
    helperText: '',
    description: '',
    size: 'md',
    color: '',
    bordered: false,
    inputCss: '',
});

const model = defineModel<string>()

const componentInput = ref<HTMLInputElement>()
defineExpose({ componentInput })

const inputSizes = reactive<Record<ComponentInputSize, string>>({
    xs: 'input-xs',
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
    xl: 'input-xl',
    '2xl': 'input-2xl',
})

const inputColors = reactive<Record<ComponentInputColor, string>>({
    '': '',
    primary: 'input-primary',
    secondary: 'input-secondary',
    tertiary: 'input-tertiary',
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
                'text-error': error
            }"
        >
            {{ label }}
        </FoundationLabel>
        <div class="relative">
            <FoundationInput
                :id="id"
                ref="componentInput"
                v-model="model"
                :type="type"
                class="w-full"
                :class="[
                    'input',
                    inputSizes[size],
                    inputColors[color],
                    inputCss,
                    {
                        'input-bordered': bordered,
                        'input-error': error,
                        'pl-12': $slots.iconBefore && !inputCss,
                        'pr-12': $slots.iconAfter && !inputCss,
                    }
                ]"
                :placeholder="placeholder"
                :aria-label="!showLabel ? label : null"
                :aria-invalid="error ? 'true' : 'false'"
                :aria-describedby="error ? `${id}-error` : `${id}-description`"
                @focus="onFocus"
                @blur="onBlur"
            />
            <div v-if="$slots.iconBefore" class="absolute inset-y-0 left-1 flex items-center z-20">
                <slot name="iconBefore" />
            </div>
            <div v-if="$slots.iconAfter" class="absolute inset-y-0 right-1 flex items-center z-20">
                <slot name="iconAfter" />
            </div>
        </div>
        <p v-if="error" :id="`${id}-error`" class="mt-2 text-sm text-error">{{ error }}</p>
        <p v-else-if="helperText" class="mt-2 text-sm text-neutral">{{ helperText }}</p>
        <p v-if="description" :id="`${id}-description`" class="sr-only">{{ description }}</p>
    </div>
</template>
