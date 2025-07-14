/**
 * Global sidenav state management composable
 * Manages open/closed state for all sidenav contexts in the application
 */
import { createGlobalState } from '@vueuse/core'

export type SidenavType = 'cart' | 'menu' | 'account'

interface SidenavState {
    cart: boolean
    menu: boolean
    account: boolean
}

const useSidenavState = createGlobalState(() => {
    return ref<SidenavState>({
        cart: false,
        menu: false,
        account: false,
    })
})

export const useSidenav = () => {
    const state = useSidenavState()

    /**
     * Opens a specific sidenav and closes all others
     */
    const open = (type: SidenavType) => {
        closeAll()
        state.value[type] = true
    }

    /**
     * Closes a specific sidenav
     */
    const close = (type: SidenavType) => {
        state.value[type] = false
    }

    /**
     * Toggles a specific sidenav state
     */
    const toggle = (type: SidenavType) => {
        if (state.value[type]) {
            close(type)
        } else {
            open(type)
        }
    }

    /**
     * Closes all sidenavs
     */
    const closeAll = () => {
        Object.keys(state.value).forEach(key => {
            state.value[key as SidenavType] = false
        })
    }

    /**
     * Returns a computed ref for v-model binding with a specific sidenav
     */
    const isOpen = (type: SidenavType) => {
        return computed({
            get: () => state.value[type],
            set: (value: boolean) => {
                if (value) {
                    open(type)
                } else {
                    close(type)
                }
            }
        })
    }

    return {
        open,
        close,
        toggle,
        closeAll,
        isOpen
    }
}