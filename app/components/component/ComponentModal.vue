<script setup lang="ts">
const props = withDefaults(defineProps<{
    controller: ReturnType<typeof useModal>,
    modalHeadline?: string | null,
    closeOnClickOutside?: boolean,
    fullscreen?: boolean
}>(), {
    modalHeadline: null,
    closeOnClickOutside: false,
    fullscreen: false
})
const { close } = props.controller
const modalRef = ref<HTMLDialogElement | null>()
const headlineId = `modal-headline-${props.controller.id}`

watch(props.controller.isOpen, (newX) => {
    if (newX) {
        modalRef.value?.showModal()
        // Prevent page scrolling when modal is open
        document.body.style.overflow = 'hidden'
        if (props.closeOnClickOutside) {
            modalRef.value?.addEventListener("click", closeModalOnClickOutside)
        }
    } else {
        modalRef.value?.close()
        document.body.style.overflow = ''
    }
})

onUnmounted(() => {
    modalRef.value?.removeEventListener("click", closeModalOnClickOutside)
    document.body.style.overflow = ''
})

function closeModal () {
    close()
    modalRef?.value?.close()
    document.body.style.overflow = ''
}

// handle click outside of modal to close it if related prop is true
function closeModalOnClickOutside (event: MouseEvent) {
    if (event.target === modalRef.value) {
        closeModal()
    }
}
</script>

<template>
    <dialog
        :id="controller.id"
        ref="modalRef"
        :class="[
            'bg-white text-left overflow-hidden shadow-xl',
            fullscreen 
                ? 'w-screen h-screen max-w-none max-h-none m-0'
                : 'rounded-lg m-auto max-h-[90vh] max-w-[95vw]'
        ]"
        aria-modal="true"
        :aria-labelledby="modalHeadline ? headlineId : undefined"
        @close="closeModal"
    >
        <div :class="fullscreen ? 'flex flex-col w-full h-full' : 'flex flex-col max-h-[90vh] min-h-0'">
            <!-- Header -->
            <div :class="fullscreen ? 'flex justify-between items-center p-6 pb-3 w-full border-b border-border flex-shrink-0' : 'flex justify-between items-center p-6 pb-3 w-full flex-shrink-0 border-b border-border'">
                <FoundationHeadline v-if="modalHeadline" :id="headlineId" tag="div" class="text-lg font-semibold">
                    {{ modalHeadline }}
                </FoundationHeadline>
                <form method="dialog">
                    <FoundationButton
                        class="btn btn-sm btn-circle btn-ghost"
                        :aria-label="$t('modal.close')"
                        @click="closeModal"
                    >
                        <FoundationIcon name="x" />
                    </FoundationButton>
                </form>
            </div>

            <!-- Content Area -->
            <div :class="fullscreen ? 'flex-1 p-6 w-full min-h-0 overflow-hidden flex flex-col' : 'flex-1 overflow-y-auto overscroll-contain p-6 min-h-0'">
                <slot />
            </div>
        </div>
    </dialog>
</template>