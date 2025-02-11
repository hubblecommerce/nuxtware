<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const props = withDefaults(defineProps<{
    direction?: 'left' | 'right',
    widthClass?: string,
    // TODO: background color configurable?
}>(), {
    direction: 'left',
    widthClass: 'w-[80%]',
})

const attrs = useAttrs()
const open = defineModel<boolean>()

const sidenavOverlayEl = shallowRef()
const { activate, deactivate } = useFocusTrap(sidenavOverlayEl, { allowOutsideClick: true })
onClickOutside(sidenavOverlayEl, () => open.value = false)

watch(open, (newVal) => {
    void (newVal ? activate() : deactivate())
})
</script>

<template>
    <ClientOnly>
        <Teleport to="#teleports">
            <div>
                <Transition
                    enter-active-class="transition-opacity duration-300 ease-in bg-gray-900"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-80"
                    leave-active-class="transition-opacity duration-300 ease-out bg-gray-900"
                    leave-from-class="opacity-80"
                    leave-to-class="opacity-0"
                >
                    <div
                        v-if="open"
                        class="fixed h-screen w-screen top-0 left-0 bg-gray-900/80 cursor-pointer"
                    />
                </Transition>

                <div
                    ref="sidenavOverlayEl"
                    class="fixed h-full top-0 z-[999] overflow-x-hidden transition-transform duration-300 no-scrollbar"
                    :class="[
                    {
                        'left-0 right-auto origin-left border-r': props.direction === 'left',
                        'right-0 left-auto origin-left border-l': props.direction === 'right',
                    },
                    widthClass,
                    open ? 'translate-x-0' : '-translate-x-full'
                ]"
                    v-bind="attrs"
                    @keydown.esc="open = false"
                >
                    <slot />
                </div>
            </div>
        </Teleport>

        <!-- Prevent layout shift on desktop view -->
        <template #fallback>
            <div class="hidden" />
        </template>
    </ClientOnly>
</template>
