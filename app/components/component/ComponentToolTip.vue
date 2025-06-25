<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

type BreakpointMap = {
    base?: TooltipPosition
    '640'?: TooltipPosition
    '768'?: TooltipPosition
    '1024'?: TooltipPosition
    '1280'?: TooltipPosition
    '1536'?: TooltipPosition
    [key: string]: TooltipPosition | undefined
}
interface ComponentToolTipProps {
    label: string
    breakpoints?: BreakpointMap
    disabled?: boolean,
    variant?: 'bright' | 'dark'
}

const props = withDefaults(defineProps<ComponentToolTipProps>(), {
    breakpoints: () => ({
        base: 'right',
        '640': 'right',
        '768': 'top',
        '1024': 'top',
        '1280': 'top',
        '1536': 'top',
    }),
    disabled: false,
    variant: 'dark'
})


const { width: windowWidth } = useWindowSize()
const positionBasedOnWindowSize = computed<'top' | 'right' | 'bottom' | 'left'>(() => {
    const width = windowWidth.value
    const breakpoints = props.breakpoints

    if (width < 640) {
        return breakpoints.base
    } else if (width < 768) {
        return breakpoints['640']
    } else if (width < 1024) {
        return breakpoints['768']
    } else if (width < 1280) {
        return breakpoints['1024']
    } else if (width < 1536) {
        return breakpoints['1280']
    } else {
        return breakpoints['1536']
    }
})

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  right: 'left-full top-1/2 -translate-y-1/2 ml-1',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
  left: 'right-full top-1/2 -translate-y-1/2 mr-1'
}

const arrowPositionClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent'
}

const variantClasses = {
    bright: 'text-neutral bg-primary-content shadow-xs',
    dark: 'text-primary-content bg-neutral shadow-xs'
}

const variantArrowClasses = {
    bright: 'text-primary-content',
    dark: 'text-neutral'
}
</script>

<template>
  <div class="relative inline-block group" :class="{'cursor-pointer' : !disabled}" tabindex="0">
    <slot />

    <!-- Tooltip -->
    <div
      v-if="!disabled && label"
      class="absolute hidden group-hover:block group-focus-within:block z-20 px-2 py-1 text-xs pointer-events-none whitespace-nowrap"
      :class="[positionClasses[positionBasedOnWindowSize], variantClasses[props.variant]]"
      role="tooltip"
    >
      {{ label }}
      <!-- Arrow pointing to the element -->
      <div
        class="absolute w-0 h-0 border-4 "
        :class="[arrowPositionClasses[positionBasedOnWindowSize], variantArrowClasses[props.variant]]"
      />
    </div>
  </div>
</template>