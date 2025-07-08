<script setup lang="ts">
const props = withDefaults(defineProps<{
    controller: ReturnType<typeof useModal>,
    modalHeadline?: string | null,
    id: string
}>(), {
    modalHeadline: null,
})
const { close } = props.controller
const modalRef = ref<HTMLDialogElement | null>()

watch(props.controller.isOpen, (newX) => {
    if (newX) {
        modalRef.value?.showModal()
    }
})

function closeModal () {
    close()
    modalRef?.value?.close()
}
</script>

<template>
    <dialog
        v-if="controller.isOpen"
        :id="id"
        ref="modalRef"
        class="modal bg-white rounded-lg text-left overflow-hidden shadow-xl p-8 m-auto"
        aria-modal="true"
        aria-labelledby="modal-headline"
        @close="closeModal"
    >
        <div class="modal-box">
            <div class="flex flex-col justify-start">
                <div class="flex justify-between items-center w-full">
                    <FoundationHeadline v-if="modalHeadline" tag="h2" class="text-lg font-semibold">
                        {{ modalHeadline }}
                    </FoundationHeadline>
                    <form method="dialog">
                        <FoundationButton class="btn btn-sm btn-circle btn-ghost" @click="closeModal">
                            <FoundationIcon name="x" />
                            <span class="sr-only">{{ $t('modal.close') }}</span>
                        </FoundationButton>
                    </form>
                </div>

                <slot />
            </div>
        </div>
    </dialog>
</template>