<script setup lang="ts">
import type { ModelRef } from 'vue'

export interface WidgetSearchInputProps {
    loading?: boolean
    label: string
    placeholder: string
}

export interface WidgetSearchInputEmits {
    (e: 'submitSearch', value: ModelRef<string | undefined>): void
    (e: 'resetSearch'): void
    (e: 'onFocus' | 'onBlur', event: FocusEvent): void
}

withDefaults(defineProps<WidgetSearchInputProps>(), {
    loading: false,
})
const emit = defineEmits<WidgetSearchInputEmits>()

const searchTerm = defineModel<string>('searchTerm')
const searchInput = shallowRef()
const searchId = useId()
const showResetButton = computed(() => !!searchTerm.value)

function onFocus (e: FocusEvent): void { emit('onFocus', e) }
function onBlur (e: FocusEvent): void { emit('onBlur', e) }

function submitSearch (): void {
    emit('submitSearch', searchTerm)
}
function resetSearch () {
    searchTerm.value = ''
    searchInput.value.componentInput.foundationInput.focus()
    emit('resetSearch')
}
</script>

<template>
    <ComponentTextInput
        :id="`search-${searchId}`"
        ref="searchInput"
        v-model="searchTerm"
        :label="label"
        :placeholder="placeholder"
        :show-label="false"
        bordered
        class="w-full items-center"
        @on-focus="onFocus"
        @on-blur="onBlur"
    >
        <template #iconBefore>
            <FoundationButton
                variant="ghost"
                size="small"
                square
                :disabled="loading"
                @click="submitSearch"
            >
                <span class="sr-only">{{ $t('search.input.submit') }}</span>
                <FoundationIcon v-if="!loading" name="search" />
                <FoundationIcon v-else name="loading" class="animate-spin" />
            </FoundationButton>
        </template>
        <template #iconAfter>
            <FoundationButton v-if="showResetButton" variant="ghost" size="small" square @click="resetSearch()">
                <span class="sr-only">{{ $t('search.input.reset') }}</span>
                <FoundationIcon name="x" />
            </FoundationButton>
        </template>
    </ComponentTextInput>
</template>
