<script setup lang="ts">
import { watchDebounced } from '@vueuse/shared'
import { onClickOutside } from '@vueuse/core'

export interface WidgetQuickSearchProps {
    searchTermMin?: number
}

const props = withDefaults(defineProps<WidgetQuickSearchProps>(), {
    searchTermMin: 1, // minimum character length of a valid search term
})

const { searchTerm, search, loading } = useProductSearchSuggest()
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

const quickSearchEl = ref<HTMLElement |null>(null)
// show result on input focus and hide it on click outside or reset search term
const showResult = ref<boolean>(false)

// used for submitting the search form
async function onSearchSubmit (): Promise<void> {
    if (searchTerm?.value?.length <= props.searchTermMin) return
    navigateTo(formatLink(`/search/term=${searchTerm.value}`))
}

// used for instant search after user has typed in a search term
async function quickSearch (): Promise<void> {
    if (searchTerm?.value?.length <= props.searchTermMin) {
        showResult.value = false
        return
    }

    showResult.value = true

    try {
        await search()
    } catch (e) {
        console.error('Error during quick search:', e)
        showResult.value = false
    }
}

function onReset () {
    searchTerm.value = ''
    showResult.value = false
}

function onFocus () {
    if (searchTerm?.value?.length >= props.searchTermMin) {
        showResult.value = true
    }
}

watchDebounced(
    searchTerm,
    quickSearch,
    { debounce: 1000 }
)

onClickOutside(quickSearchEl, () => showResult.value = false)
</script>

<template>
    <div ref="quickSearchEl" @keydown.esc="onReset">
        <form role="search" @submit.prevent="search">
            <WidgetSearchInput
                v-model="searchTerm"
                :loading="loading"
                :label="$t('search.input.label')"
                :placeholder="$t('search.input.placeholder')"
                class="px-2"
                @submit-search="onSearchSubmit"
                @reset-search="onReset"
                @on-focus="onFocus"
            />

            <section v-if="showResult && !loading"  class="absolute bg-white w-full my-2 px-2" aria-live="polite">
                <h2 class="sr-only">Search results</h2>
                <WidgetQuickSearchResults class="border p-2" />
            </section>
        </form>
    </div>
</template>
