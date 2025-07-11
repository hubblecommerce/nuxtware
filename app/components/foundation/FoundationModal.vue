<template>
    <ClientOnly>
        <Teleport to="#teleports">
            <div>
                <Transition
                    enter-active-class="transition-opacity duration-300 ease-in"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="transition-opacity duration-300 ease-out"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <div
                        v-if="open"
                        class="fixed inset-0 bg-black/50 cursor-pointer z-999"
                        @click="closeModal"
                    />
                </Transition>

                <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
                    <div
                        v-if="open"
                        ref="modalEl"
                        class="fixed inset-0 z-999 flex items-center justify-center p-4"
                        @keydown.esc="closeModal"
                    >
                        <div
                            class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                            role="dialog"
                            :aria-labelledby="titleId"
                            aria-modal="true"
                            @click.stop
                        >
                            <div class="flex items-center justify-between p-6 border-b">
                                <h2 :id="titleId" class="text-xl font-semibold">
                                    {{ title }}
                                </h2>
                                <FoundationButton
                                    variant="ghost"
                                    class="p-2"
                                    :aria-label="$t('misc.close')"
                                    @click="closeModal"
                                >
                                    <FoundationIcon name="x" class="w-5 h-5" />
                                </FoundationButton>
                            </div>
                            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <slot />
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Teleport>
    </ClientOnly>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

interface Props {
    title: string
}

const props = defineProps<Props>()
const open = defineModel<boolean>()

const modalEl = shallowRef()
const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`

// Focus trap for accessibility
const { activate, deactivate } = useFocusTrap(modalEl, { allowOutsideClick: true })

// Close modal when clicking outside
onClickOutside(modalEl, () => {
    if (open.value) {
        closeModal()
    }
})

// Handle focus trap activation/deactivation
watch(open, (newVal) => {
    if (newVal) {
        nextTick(() => {
            activate()
        })
    } else {
        deactivate()
    }
})

const closeModal = () => {
    open.value = false
}

// Cleanup focus trap on unmount
onUnmounted(() => {
    deactivate()
})
</script>