<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"

interface ComponentToolTipProps {
    label: string
    positionDesktop?: 'top' | 'right' | 'bottom' | 'left'
    positionMobile?: 'top' | 'right' | 'bottom' | 'left'
    disabled?: boolean
}

const props = withDefaults(defineProps<ComponentToolTipProps>(), {
    positionDesktop: 'top',
    positionMobile: 'top',
    disabled: false,
})

const { width: windowWidth } = useWindowSize()
const positionBasedOnWindowSize = computed<'top' | 'right' | 'bottom' | 'left'>(() =>
    windowWidth.value >= 640 ? props.positionDesktop : props.positionMobile
)

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
</script>

<template>
  <div class="relative inline-block group" :class="{'cursor-pointer' : !disabled}" tabindex="0">
    <slot />

    <!-- Tooltip -->
    <div
      v-if="!disabled && label"
      class="absolute hidden group-hover:block group-focus-within:block z-10 px-2 py-1 text-xs text-white bg-label pointer-events-none whitespace-nowrap"
      :class="positionClasses[positionBasedOnWindowSize]"
      role="tooltip"
    >
      {{ label }}
      <!-- Arrow pointing to the element -->
      <div
        class="absolute w-0 h-0 border-4 text-label"
        :class="arrowPositionClasses[positionBasedOnWindowSize]"
      />
    </div>
  </div>
</template>