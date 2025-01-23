<template>
    <component
        :is="tag"
        :class="[
            'btn',
            `btn-${size}`,
            `btn-${variant}`,
            { 'btn-loading': loading }
        ]"
        :style="{ '--primary-color': color ?? null }"
        :disabled="disabled || loading"
        :aria-busy="loading"
        :aria-disabled="disabled || loading"
        @click="handleClick"
        @keydown.enter="handleClick"
        @keydown.space="handleClick"
    >
        <span :class="{ 'sr-only': loading }">
          <slot>{{ text }}</slot>
        </span>
        <span v-if="loading" class="ml-2" aria-hidden="true">
          {{ loadingText }}
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps {
    text: string
    tag?: string
    variant?: ButtonVariant
    size?: ButtonSize
    color?: string | null
    disabled?: boolean
    loading?: boolean
}

const safelist = ['btn-small', 'btn-medium', 'btn-large', 'btn-primary', 'btn-secondary', 'btn-tertiary', 'btn-loading']

const props = withDefaults(defineProps<ButtonProps>(), {
    tag: 'button',
    variant: 'primary',
    size: 'medium',
    color: null,
    disabled: false,
    loading: false
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const { t } = useI18n()

const loadingText = computed(() => t('button.loading', 'Loading...'))

const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    if (!props.disabled && !props.loading) {
        emit('click', event)
    }
}
</script>
