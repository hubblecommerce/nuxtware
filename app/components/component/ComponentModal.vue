<script setup lang="ts">
const props = withDefaults(defineProps<{
    controller: ReturnType<typeof useModal>,
    modalHeadline?: string | null,
    closeOnClickOutside?: boolean
}>(), {
    modalHeadline: null,
    closeOnClickOutside: false
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
        class="bg-white rounded-lg text-left overflow-hidden shadow-xl m-auto max-h-[90vh] max-w-[95vw]"
        aria-modal="true"
        :aria-labelledby="modalHeadline ? headlineId : undefined"
        @close="closeModal"
    >
        <div class="flex flex-col max-h-[90vh] min-h-0">
            <!-- Fixed Header -->
            <div class="flex justify-between items-center p-6 pb-3 w-full flex-shrink-0 border-b border-border">
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

            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto overscroll-contain p-6 min-h-0">
                <slot />
            </div>
        </div>
    </dialog>
</template>