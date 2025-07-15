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
        if (props.closeOnClickOutside) {
            modalRef.value?.addEventListener("click", closeModalOnClickOutside)
        }
    }
})

onUnmounted(() => {
    modalRef.value?.removeEventListener("click", closeModalOnClickOutside)
})

function closeModal () {
    close()
    modalRef?.value?.close()
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
        class="modal bg-white rounded-lg text-left overflow-hidden shadow-xl m-auto"
        aria-modal="true"
        :aria-labelledby="modalHeadline ? headlineId : undefined"
        @close="closeModal"
    >
        <div class="modal-box">
            <div class="flex flex-col justify-start">
                <div class="flex justify-between items-center p-6 pb-3 w-full">
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

                <div class="px-6 pb-6">
                    <slot />
                </div>
            </div>
        </div>
    </dialog>
</template>