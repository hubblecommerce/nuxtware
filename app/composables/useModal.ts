/**
 * Global modal state management composable
 * Manages open/closed state for all modals in the application
 */
import { ref, computed } from 'vue'
import { createGlobalState } from '@vueuse/core'

// Global modal state using VueUse createGlobalState
const useModalState = createGlobalState(() => {
    return ref<Record<string, boolean>>({})
})

export function useModal(id?: string) {
    const modalId = id || `modal_${Date.now()}_${Math.random()}`
    const state = useModalState()

    const open = () => {
        state.value[modalId] = true
    }

    const close = () => {
        state.value[modalId] = false
    }

    const isOpen = computed(() => {
        return state.value[modalId] || false
    })

    return {
        isOpen,
        open,
        close,
        id: modalId
    }
}

// Global modal control functions
export const useModalRegistry = () => {
    const state = useModalState()

    /**
     * Closes all modals
     */
    const closeAll = () => {
        Object.keys(state.value).forEach(key => {
            state.value[key] = false
        })
    }

    /**
     * Returns array of currently open modal IDs
     */
    const getOpenModals = () => {
        return Object.entries(state.value)
            .filter(([_, isOpen]) => isOpen)
            .map(([id]) => id)
    }

    return {
        closeAll,
        getOpenModals
    }
}