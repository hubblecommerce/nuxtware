// Global test setup.
//
// In a running Nuxt app, helpers such as `useCookie` and Vue reactivity
// primitives are auto-imported and appear as globals inside composables. Unit
// tests do not run Nuxt's auto-import transform, so any auto-import a composable
// references *without* an explicit import must be provided as a global here.
// Behaviour-specific returns are overridden per-test with vi.mocked/vi.stubGlobal.
import { vi } from 'vitest'
import { ref, computed, reactive } from 'vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('reactive', reactive)

// Default no-op cookie; tests that care about cookie behaviour override it.
vi.stubGlobal('useCookie', () => ref<string | null | undefined>(undefined))
