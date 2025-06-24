<script setup lang="ts">
import type {Schemas} from "#shopware"
import { buildUrlPrefix, getProductRoute } from "@shopware/helpers";

const props = defineProps<{
    configurator: Schemas["PropertyGroup"][] | null
}>()

const {
    handleChange,
    getSelectedOptions,
    findVariantForSelectedOptions,
} = useProductConfigurator()

type OptionStates = 'selected' | 'combinable' | 'uncombinable' | 'disabled' | null
const selectableOptions = ref<Record<string, string[]>>({})
const deactivatedGroups = ref<string[]>([])
const emit =
    defineEmits<
        (e: "change", selected: Partial<Schemas["Product"]> | undefined) => void
    >()
const { getUrlPrefix } = useUrlResolver()
const prefix = getUrlPrefix()
const isLoading = ref<boolean>()
const router = useRouter()

const onHandleChange = async () => {
    isLoading.value = true
    const variantFound = await findVariantForSelectedOptions()
    const selectedOptionsVariantPath = buildUrlPrefix(
        getProductRoute(variantFound),
        prefix,
    )
    if (selectedOptionsVariantPath) {
        try {
            router.push(selectedOptionsVariantPath)
        } catch {
            console.error("incorrect URL", selectedOptionsVariantPath)
        }
    } else {
        emit("change", variantFound)
    }
    isLoading.value = false
}

function optionState (group: Schemas["PropertyGroup"], option: Schemas["PropertyGroupOption"]): OptionStates {
    const selected = getSelectedOptions.value[group.name] === option.id
    const combinable = selectableOptions.value[group.id]?.includes(option.id)
    const disabled = deactivatedGroups.value.includes(group.id)

    if (disabled) {
        return 'disabled'
    }

    if (selected) {
        return 'selected'
    }

    if (combinable) {
        return 'combinable'
    }

    if (!combinable && !selected) {
        return 'uncombinable'
    }

    return null
}

function optionStyles(state: OptionStates, media: boolean, colorCode?: string): string {
    // add all possible variant option color hex codes from the shop
    const colorClassMap: Record<string, string> = {
        '#0000ff': 'bg-[#0000ff]',
        '#ff0000': 'bg-[#ff0000]',
        '#ffffff': 'bg-[#ffffff]',
    }

    const hasColor = !!colorCode && colorClassMap[colorCode]
    const colorClass = hasColor ? colorClassMap[colorCode] : ''
    const isWhite = colorCode === '#ffffff'
    const textColorClass = isWhite ? ' text-neutral' : ' text-tertiary-content'
    const hoverColorClass = isWhite
        ? ' hover:bg-neutral/15'
        : hasColor
            ? ` hover:${colorClass}/15`
            : ''

    const focusClass = ' focus-style'
    const borderClass = ' border border-border'

    switch (state) {
        case 'selected':
            return [
                'border-2 border-neutral cursor-pointer',
                focusClass,
                media ? 'shadow-[inset_0_0_0_3px_rgba(7,122,80,1)]' : '',
                colorClass,
                hasColor ? textColorClass : ' text-neutral'
            ].join(' ').trim()

        case 'combinable':
            if (!hasColor) {
                return [
                    borderClass,
                    'bg-opacity-[0.08] cursor-pointer',
                    focusClass,
                    'hover:bg-neutral/15'
                ].join(' ').trim()
            }
            return [
                colorClass,
                hoverColorClass,
                textColorClass,
                'cursor-pointer',
                focusClass
            ].join(' ').trim()

        case 'uncombinable':
            return [
                borderClass,
                'cursor-pointer',
                focusClass,
                colorClass,
                hoverColorClass || ' hover:bg-neutral/15',
                hasColor ? `${textColorClass} hover:text-neutral` : ''
            ].join(' ').trim()

        case 'disabled':
            return 'bg-secondary-content text-neutral/30 border border-border/30 cursor-not-allowed focus-style'

        default:
            return ''
    }
}

</script>
<template>
    <section v-if="props.configurator != null && props.configurator.length > 0" class="mb-6" :aria-label="$t('product.detail.variants')">
        <div v-for="variantGroup in props.configurator" :key="variantGroup.id">
            <div class="text-sm font-semibold mb-2">{{ variantGroup.translated.name}}</div>
            <div class="flex justify-start gap-2 mb-6">
                <label
                    v-for="variantOption in variantGroup.options" :key="variantOption.id"
                    tabindex="0"
                    aria-label=""
                    class="relative flex-shrink-0 text-sm flex justify-center items-center"
                    :class="[
                        { 'min-h-[45px] px-4': !variantOption.media },
                        { 'min-h-[105px] px-1': variantOption.media },
                        optionStyles(optionState(variantGroup, variantOption), !!variantOption.media, variantOption.colorHexCode),
                    ]"
                    @keydown.enter.prevent="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
                >
                    <img
                        v-if="variantOption.media"
                        :src="variantOption.media.url"
                        :alt="variantOption.media.alt || ''"
                        class="mix-blend-multiply"
                        width="60"
                    />
                    <span v-else>{{variantOption.translated.name}}</span>
                    <input
                        v-model="getSelectedOptions[variantGroup.id]"
                        type="radio"
                        :name="variantGroup.id"
                        :value="variantOption.id"
                        class="hidden radio"
                        :disabled="deactivatedGroups.includes(variantGroup.id)"
                        @click="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
                    >
                </label>
            </div>
        </div>
    </section>
</template>