<template>
    <div class="relative inline-block w-full">
        <div v-if="$slots.icon" class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-body" aria-hidden="true">
            <slot name="icon"></slot>
        </div>
        <select
            ref="foundationSelect"
            v-model="model"
            :class="[
                'select',
                selectSizes[size],
                selectColors[color],
                {
                    'select-error': error,
                    'pl-10': $slots.icon
                }
            ]"
            :disabled="disabled"
            :required="required"
            :aria-disabled="disabled"
            :aria-invalid="error"
            :name="name"
        >
            <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
            <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
            >
                {{ option.label }}
            </option>
        </select>
        <span class="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-body" aria-hidden="true">
            <FoundationIcon name="chevron-down" class="block" />
        </span>
    </div>
</template>

<script setup lang="ts">
import type { FoundationSelectProps, SelectSize, SelectColor } from '#imports'

const props = withDefaults(defineProps<FoundationSelectProps>(), {
    disabled: false,
    required: false,
    size: 'medium',
    color: '',
    error: false
})

const model = defineModel<string | number>()
const foundationSelect = ref<HTMLSelectElement>()

const selectSizes = reactive<Record<SelectSize, string>>({
    small: 'select-small',
    medium: 'select-medium',
    large: 'select-large'
})

const selectColors = reactive<Record<SelectColor, string>>({
    '': '',
    primary: 'select-primary',
    secondary: 'select-secondary',
    tertiary: 'select-tertiary'
})

defineExpose({ foundationSelect })
</script>
