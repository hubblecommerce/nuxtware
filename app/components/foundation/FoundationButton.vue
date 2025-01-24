<template>
    <component
        :is="tag"
        :class="[
            'btn',
            buttonSizes[size],
            buttonVariants[variant],
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
import type { ButtonProps, ButtonSize, ButtonVariant } from '#imports'

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

const buttonSizes = reactive<Record<ButtonSize, string>>({
    small: 'btn-small',
    medium: 'btn-medium',
    large: 'btn-large',
})

const buttonVariants = reactive<Record<ButtonVariant, string>>({
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
