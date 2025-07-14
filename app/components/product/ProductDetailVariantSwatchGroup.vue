<script setup lang="ts">
import type { Schemas } from "#shopware"
import { useProductVariantSwatches } from "#hubble/composables/useProductVariantSwatches"

const props = defineProps<{
    variantGroup: Schemas["PropertyGroup"],
    variants: Schemas["Product"][],
    optionState: (group: Schemas["PropertyGroup"], option: Schemas["PropertyGroupOption"]) => 'selected' | 'combinable' | 'uncombinable' | 'disabled' | null,
    handleChange: (groupName: string, optionId: string, callback: () => Promise<void>) => void,
    onHandleChange: () => Promise<void>
}>()

const swatchToProduct = ref<Map<string, Schemas['Product']>>(new Map())
const loading = ref(true)

onMounted(async () => {
    loading.value = true
    await loadVariantSwatches()
    loading.value = false
})

async function loadVariantSwatches() {
    const result = await useProductVariantSwatches(props.variants)
    swatchToProduct.value = result.swatchToProduct
}

function optionStyles(state: 'selected' | 'combinable' | 'uncombinable' | 'disabled' | null, media: boolean, swatchCode?: string): string {
    // add all possible variant option swatch hex codes from the shop
    // to display the swatch hex color if no media is present
    const swatchClassMap: Record<string, string> = {
        '#0000ff': 'bg-[#0000ff]',
        '#ff0000': 'bg-[#ff0000]',
        '#ffffff': 'bg-[#ffffff]',
    }

    const hasSwatch = !!swatchCode && swatchClassMap[swatchCode]
    const swatchClass = hasSwatch ? swatchClassMap[swatchCode] : ''
    const isWhite = swatchCode === '#ffffff'
    const textSwatchClass = isWhite ? ' text-neutral' : ' text-tertiary-content'
    const mutedTextSwatchClass = ' text-neutral/50'
    const hoverSwatchClass = isWhite
        ? ' hover:bg-neutral/15'
        : hasSwatch
            ? ` hover:${swatchClass}/15`
            : ''

    const focusClass = ' focus-style'
    const borderClass = ' border border-border'
    const mutedBorderClass = ' border border-border/50'

    switch (state) {
        case 'selected':
            return [
                'border-2 border-neutral bg-neutral/15 cursor-pointer',
                focusClass,
                media ? '' : swatchClass,
                hasSwatch ? textSwatchClass : ' text-neutral'
            ].join(' ').trim()

        case 'combinable':
            if (media) {
                return [
                    borderClass,
                    'hover:bg-neutral/15',
                    'cursor-pointer',
                    focusClass
                ].join(' ').trim()
            } else if (hasSwatch) {
                return [
                    textSwatchClass,
                    hoverSwatchClass,
                    'cursor-pointer',
                    focusClass
                ].join(' ').trim()
            }
            else {
                return [
                    borderClass,
                    'hover:bg-neutral/15',
                    'cursor-pointer',
                    focusClass
                ].join(' ').trim()
            }

        case 'uncombinable':
            return [
                mutedBorderClass,
                mutedTextSwatchClass,
                'cursor-pointer',
                focusClass,
                media ? '' : swatchClass,
                hasSwatch ? `${textSwatchClass} hover:text-neutral` : ''
            ].join(' ').trim()

        default:
            return ''
    }
}
</script>

<template>
    <div>
        <div class="text-sm font-semibold mb-2">{{ variantGroup.translated.name }}</div>
        <div class="flex justify-start gap-2">
            <label
                v-for="variantOption in variantGroup.options"
                :key="variantOption.id"
                tabindex="0"
                :aria-label="variantOption.translated.name"
                class="relative flex-shrink-0 text-sm flex justify-center items-center"
                :class="[
                    { 'min-h-[45px] px-4': !swatchToProduct.get(variantOption.id)?.cover?.media },
                    { 'min-h-[105px] px-1': swatchToProduct.get(variantOption.id)?.cover?.media },
                    optionStyles(optionState(variantGroup, variantOption), !!swatchToProduct.get(variantOption.id)?.cover?.media?.url, variantOption.colorHexCode),
                ]"
                @keydown.enter.prevent="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
            >
                <template v-if="loading">
                    <div class="flex items-center justify-center flex-grow p-1">
                        <div class="animate-spin rounded-full h-2 w-2 border-b-2 border-border" />
                    </div>
                </template>

                <template v-else>
                    <img
                        v-if="swatchToProduct.get(variantOption.id)?.cover?.media?.url"
                        :src="swatchToProduct.get(variantOption.id)?.cover?.media.url"
                        :alt="swatchToProduct.get(variantOption.id)?.cover?.media.translated.alt || ''"
                        class="mix-blend-multiply"
                        width="60"
                    >
                    <span v-else>{{ variantOption.translated.name }}</span>
                </template>

                <input
                    type="radio"
                    :name="variantGroup.id"
                    :value="variantOption.id"
                    class="hidden radio"
                    @click="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
                >
            </label>
        </div>
    </div>
</template>