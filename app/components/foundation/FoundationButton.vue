<template>
    <component
        :is="tag"
        ref="button"
        :class="[
            'btn',
            ...!unStyled ? [
                buttonSizes[size],
                buttonVariants[variant],
                buttonColors[color],
            ] : [],
            {
                'btn-loading': loading,
                'btn-square': square,
                'btn-circle': circle,
            }
        ]"
        :disabled="disabled || loading"
        :aria-busy="loading"
        :aria-disabled="disabled || loading"
        @click="handleClick"
        @keydown.enter="handleClick"
        @keydown.space="handleClick"
    >
        <template v-if="!loading">
          <slot>{{ text }}</slot>
        </template>
        <span v-if="loading" aria-hidden="true">
          {{ loadingText }}
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed, shallowRef, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ButtonProps, ButtonSize, ButtonVariant, ButtonColor } from '../../types/foundation-button'

const props = withDefaults(defineProps<ButtonProps>(), {
    tag: 'button',
    variant: 'default',
    color: '',
    size: 'medium',
    disabled: false,
    loading: false,
    circle: false,
    square: false,
    unStyled: false,
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const button = shallowRef()
defineExpose({ button })

const { t } = useI18n()

const buttonSizes = reactive<Record<ButtonSize, string>>({
    small: 'btn-small',
    medium: 'btn-medium',
    large: 'btn-large',
})

const buttonVariants = reactive<Record<ButtonVariant, string>>({
    default: 'btn-default',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
})

const buttonColors = reactive<Record<ButtonColor, string>>({
    '': '',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
})

const loadingText = computed(() => t('button.loading', 'Loading...'))

const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    if (!props.disabled && !props.loading) {
        emit('click', event)
    }
}
</script>
