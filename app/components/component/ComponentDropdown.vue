<template>
    <div class="relative">
        <FoundationButton
            :id="triggerId"
            ref="triggerEl"
            :class="[
                'gap-2',
                { 'opacity-50 cursor-not-allowed': disabled }
            ]"
            :aria-haspopup="true"
            :aria-expanded="isOpen"
            :disabled="disabled"
            un-styled
            v-bind="$attrs"
            @click="toggleDropdown"
            @keydown.esc="closeDropdown"
            @keydown.arrow-down.prevent="openDropdown"
            @keydown.enter.prevent="openDropdown"
        >
            {{ triggerLabel }}
            <FoundationIcon v-show="isOpen" name="chevron-up" />
            <FoundationIcon v-show="!isOpen" name="chevron-down" />
        </FoundationButton>

        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-if="isOpen"
                ref="contentEl"
                :class="[
                  contentClasses
                ]"
                role="menu"
                :aria-labelledby="triggerId"
                @keydown.stop.esc="closeDropdown"
            >
                <slot />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

interface Props {
    triggerLabel: string;
    disabled?: boolean;
    contentClasses?: string;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    contentClasses: '',
})

const emit = defineEmits<{
    (e: 'open' | 'close'): void;
}>()

defineOptions({
    inheritAttrs: false
})

const isOpen = ref(false)
const uuId = useId()
const triggerId = `dropdown-trigger-${uuId}`
const triggerEl = ref()
const contentEl = ref()

onClickOutside(contentEl, () => closeDropdown(), { ignore: [triggerEl] })
const { activate, deactivate } = useFocusTrap(contentEl, { allowOutsideClick: true })

function toggleDropdown (e: PointerEvent) {
    if (!props.disabled && e.type === 'click') {
        isOpen.value = !isOpen.value
        if (isOpen.value) {
            emit('open')
        } else {
            emit('close')
        }
    }
}

function openDropdown () {
    if (!isOpen.value && !props.disabled) {
        isOpen.value = true
        emit('open')
        nextTick(() => {
            activate()
        })
    }
}

function closeDropdown () {
    if (isOpen.value) {
        isOpen.value = false
        emit('close')
        deactivate()
    }
}
</script>
