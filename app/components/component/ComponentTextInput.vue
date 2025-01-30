<template>
    <div class="relative">
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
                        'pl-10': $slots.iconBefore && !inputCss,
                        'pr-10': $slots.iconAfter && !inputCss,
                    }
                ]"
                :placeholder="placeholder"
                :aria-label="!showLabel ? label : null"
                :aria-invalid="error ? 'true' : 'false'"
                :aria-describedby="error ? `${id}-error` : undefined"
            />
            <div v-if="$slots.iconBefore" class="absolute inset-y-0 left-0 flex items-center z-20">
                <slot name="iconBefore" />
            </div>
            <div v-if="$slots.iconAfter" class="absolute inset-y-0 right-0 flex items-center z-20">
                <slot name="iconAfter" />
            </div>
        </div>
        <p v-if="error" :id="`${id}-error`" class="mt-2 text-sm text-error">{{ error }}</p>
        <p v-else-if="helperText" class="mt-2 text-sm text-neutral">{{ helperText }}</p>
    </div>
</template>

<script setup lang="ts">
import type { ComponentInputProps, ComponentInputSize, ComponentInputColor } from '#imports'

withDefaults(defineProps<ComponentInputProps>(), {
    showLabel: true,
    placeholder: '',
    type: 'text',
    error: '',
    helperText: '',
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
</script>
