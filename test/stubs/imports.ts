// Test stub for Nuxt's virtual `#imports` module.
//
// In a real Nuxt app `#imports` re-exports every auto-import (Vue reactivity,
// Nuxt app helpers and layer composables such as `useShopwareContext`). Unit
// tests do not boot Nuxt, so this stub provides just enough of that surface for
// composables under test to load. Individual tests override the pieces they
// care about with `vi.mock('#imports', ...)`.
import { ref, computed, reactive } from 'vue'

export { ref, computed, reactive }

export function useShopwareContext () {
    return {
        apiClient: {
            invoke: async () => {
                throw new Error('useShopwareContext().apiClient.invoke was not mocked in this test')
            }
        }
    }
}

export function useContext<T> (_key: string) {
    return ref<T>() as unknown as ReturnType<typeof ref>
}

export function useCookie (_name: string, _options?: unknown) {
    return ref<string | null | undefined>(undefined)
}
