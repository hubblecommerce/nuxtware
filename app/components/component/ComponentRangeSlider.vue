<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    minValue: number | string
    maxValue: number | string
    minLimit: number | string
    maxLimit: number | string
    step?: number | string
    disabled?: boolean
    formatValue?: (value: number) => string
    trackColor?: string
    activeTrackColor?: string
    handleColor?: string
}>()

// Ensure all numeric values are properly converted to numbers
const minValueNum = computed(() => Number(props.minValue) || 0)
const maxValueNum = computed(() => Number(props.maxValue) || 0)
const minLimitNum = computed(() => Number(props.minLimit) || 0)
const maxLimitNum = computed(() => Number(props.maxLimit) || 0)
const stepNum = computed(() => Number(props.step) || 1)

const emit = defineEmits<{
    'update:minValue': [value: number]
    'update:maxValue': [value: number]
}>()

// Set defaults
const formatValue = props.formatValue || ((value: number) => value.toString())
const trackColor = props.trackColor || 'bg-gray-200'
const activeTrackColor = props.activeTrackColor || 'bg-blue-500'
const handleColor = props.handleColor || 'bg-white'

// Internal values
const internalMinValue = ref(minValueNum.value)
const internalMaxValue = ref(maxValueNum.value)

// Slider references for calculations
const sliderTrack = ref<HTMLElement | null>(null)
const isDraggingMin = ref(false)
const isDraggingMax = ref(false)

// Percentage calculations for positioning
const minPercentage = computed(() => {
    return ((internalMinValue.value - minLimitNum.value) / (maxLimitNum.value - minLimitNum.value)) * 100
})

const maxPercentage = computed(() => {
    return ((internalMaxValue.value - minLimitNum.value) / (maxLimitNum.value - minLimitNum.value)) * 100
})

// Handle changes in props
watch(() => minValueNum.value, (newValue) => {
    if (newValue !== internalMinValue.value) {
        internalMinValue.value = Math.max(minLimitNum.value, Math.min(internalMaxValue.value, newValue))
    }
})

watch(() => maxValueNum.value, (newValue) => {
    if (newValue !== internalMaxValue.value) {
        internalMaxValue.value = Math.min(maxLimitNum.value, Math.max(internalMinValue.value, newValue))
    }
})

// Update values when internal state changes
watch(internalMinValue, (newValue) => {
    emit('update:minValue', newValue)
})

watch(internalMaxValue, (newValue) => {
    emit('update:maxValue', newValue)
})

// Handle mouse/touch events
function onMouseDown(event: MouseEvent | TouchEvent, handle: 'min' | 'max') {
    if (props.disabled) return

    if (handle === 'min') {
        isDraggingMin.value = true
    } else {
        isDraggingMax.value = true
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onMouseUp)
}

function onMouseMove(event: MouseEvent) {
    updateValueFromPosition(event.clientX)
}

function onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    if (touch) {
        updateValueFromPosition(touch.clientX);
    }
}

function onMouseUp() {
    isDraggingMin.value = false
    isDraggingMax.value = false

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onMouseUp)
}

function updateValueFromPosition(clientX: number) {
    if (!sliderTrack.value) return

    const rect = sliderTrack.value.getBoundingClientRect()
    const position = clientX - rect.left
    const percentage = Math.min(Math.max(0, position / rect.width), 1)
    const value = Math.round((percentage * (maxLimitNum.value - minLimitNum.value) + minLimitNum.value) / stepNum.value) * stepNum.value

    if (isDraggingMin.value) {
        internalMinValue.value = Math.min(value, internalMaxValue.value)
    } else if (isDraggingMax.value) {
        internalMaxValue.value = Math.max(value, internalMinValue.value)
    }
}

// For keyboard accessibility
function onKeyDown(event: KeyboardEvent, handle: 'min' | 'max') {
    if (props.disabled) return

    const currentValue = handle === 'min' ? internalMinValue.value : internalMaxValue.value
    let newValue = currentValue

    switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
            newValue = Math.max(minLimitNum.value, currentValue - stepNum.value)
            break
        case 'ArrowRight':
        case 'ArrowUp':
            newValue = Math.min(maxLimitNum.value, currentValue + stepNum.value)
            break
        case 'Home':
            newValue = minLimitNum.value
            break
        case 'End':
            newValue = maxLimitNum.value
            break
        default:
            return
    }

    if (handle === 'min') {
        internalMinValue.value = Math.min(newValue, internalMaxValue.value)
    } else {
        internalMaxValue.value = Math.max(newValue, internalMinValue.value)
    }

    event.preventDefault()
}
</script>

<template>
    <div class="component-range-slider w-full">
        <div 
            ref="sliderTrack" 
            class="relative h-2 rounded-full cursor-pointer my-4"
            :class="[trackColor, { 'opacity-50': disabled }]"
            @click="!disabled && updateValueFromPosition($event.clientX)">
            <!-- Active track area -->
            <div 
                class="absolute h-full rounded-full" 
                :class="[activeTrackColor]" 
                :style="{
                    left: `${minPercentage}%`,
                    width: `${maxPercentage - minPercentage}%`
                }" 
            />

            <!-- Min handle -->
            <div 
                :class="[handleColor, { 'cursor-pointer': !disabled }]"
                class="absolute w-5 h-5 rounded-full border border-border shadow-md transform -translate-x-1/2 -translate-y-1/2 top-1/2 focus-style"
                :style="{ left: `${minPercentage}%` }" 
                tabindex="0" 
                role="slider" 
                aria-label="Minimum value"
                :aria-valuemin="minLimitNum" 
                :aria-valuemax="maxLimitNum" 
                :aria-valuenow="internalMinValue"
                :aria-disabled="disabled" 
                @mousedown="onMouseDown($event, 'min')"
                @touchstart="onMouseDown($event, 'min')" 
                @keydown="onKeyDown($event, 'min')" 
            />

            <!-- Max handle -->
            <div 
                :class="[handleColor, { 'cursor-pointer': !disabled }]"
                class="absolute w-5 h-5 rounded-full border border-border shadow-md transform -translate-x-1/2 -translate-y-1/2 top-1/2 focus-style"
                :style="{ left: `${maxPercentage}%` }" 
                tabindex="0" 
                role="slider" 
                aria-label="Maximum value"
                :aria-valuemin="minLimitNum" 
                :aria-valuemax="maxLimitNum" 
                :aria-valuenow="internalMaxValue"
                :aria-disabled="disabled" 
                @mousedown="onMouseDown($event, 'max')"
                @touchstart="onMouseDown($event, 'max')" 
                @keydown="onKeyDown($event, 'max')" 
            />
        </div>

        <!-- Values display -->
        <div class="flex justify-between text-sm text-gray-600 mt-1">
            <div>{{ formatValue(internalMinValue) }}</div>
            <div>{{ formatValue(internalMaxValue) }}</div>
        </div>
    </div>
</template>

<style scoped>
/* Touch device optimizations */
@media (pointer: coarse) {
    .component-range-slider [role="slider"] {
        width: 1.5rem;
        height: 1.5rem;
    }
}
</style>