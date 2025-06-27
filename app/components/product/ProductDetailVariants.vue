<script setup lang="ts">
import type {Schemas} from "#shopware"
import {buildUrlPrefix, getProductRoute} from "@shopware/helpers"

const props = defineProps<{
    configurator: Schemas["PropertyGroup"][] | null
}>()

const {
    handleChange,
    getSelectedOptions,
    findVariantForSelectedOptions,
} = useProductConfigurator()
const { search } = useProductSearch()
const { apiClient } = useShopwareContext();

type OptionStates = 'selected' | 'combinable' | 'uncombinable' | 'disabled' | null
interface OptionInfo { id: string; groupId: string }
type CompatIndex = Record<string, Set<string>>

const deactivatedGroups = ref<string[]>([])
const emit =
    defineEmits<
        (e: "change", selected: Partial<Schemas["Product"]> | undefined) => void
    >()
const { getUrlPrefix } = useUrlResolver()
const prefix = getUrlPrefix()
const isLoading = ref<boolean>()
const router = useRouter()

/* -------------------------------------------------
 * Handle variant change
 * ------------------------------------------------- */
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

/* -------------------------------------------------
 * Logic for display of variant color using product media
 * ------------------------------------------------- */
const colorOptions = computed(() =>
    props.configurator?.find(g => g.displayType === "color")?.options ?? []
)

const getColorVariantIdMap = async (): Promise<Map<string, string>> => {
    const pairs = await Promise.all(
        colorOptions.value.map(async (option) => {
            const variant = await findVariantForSelectedOptions({ color: option.id })
            return variant ? [option.id, variant.id] as const : null
        })
    )
    return new Map(pairs.filter(Boolean) as [string, string][])
}

const colourToVariantId = await getColorVariantIdMap()
const variantIds  = [...new Set(colourToVariantId.values())]

async function loadColorVariantProducts() {
    if (!variantIds.length) return
    return await Promise.all(
        variantIds.map(id => search(id))
    )
}

const productsPerVariantColor = await loadColorVariantProducts()
const colorToProduct = new Map<string, Schemas["Product"]>()

if (productsPerVariantColor) {
    for (const product of productsPerVariantColor) {
        const colourId = [...colourToVariantId.entries()]
            .find(([, vId]) => vId === product.product?.id)?.[0]

        if (colourId) colorToProduct.set(colourId, product.product)
    }
}

/* -------------------------------------------------
 * Logic for selectable options
 * ------------------------------------------------- */
const loadBuyableVariants = async (): Promise<Schemas["Product"][]> => {
    const parentId =
        productsPerVariantColor?.[0]?.product?.parentId
        ?? null
    const response = await apiClient.invoke(
        "readProduct post /product",
        {
            pathParams: {
                productId: parentId },
            body: {
                filter: [
                    { type: "equals", field: "parentId", value: parentId },
                    { type: "equals", field: "active",   value: true },
                    { type: "range",  field: "stock", parameters: { gte: 1 } }
                ],
                associations: { options: { associations: { group: {} } } },
                includes: { product: ["id", "optionIds", "options"] },
                limit: 100
            }

        }
    );
    return response.data.elements as Schemas["Product"][];
}

function indexVariants (variants: Schemas['Product'][]) {
    const compat: CompatIndex               = {}
    const info:   Record<string, OptionInfo> = {}

    for (const variant of variants) {
        if (variant.options) {
            const ids = variant.options?.map(o => o.id)

            for (const opt of variant.options) {
                info[opt.id] = { id: opt.id, groupId: opt.groupId }

                const bucket = (compat[opt.id] ??= new Set<string>())
                ids.forEach(id => id !== opt.id && bucket.add(id))
            }
        }
    }
    return { compat, info }
}

function buildGroupCompat (
    selectedOptionIds: string[],
    compat: CompatIndex,
    info: Record<string, OptionInfo>
) {
    const result: Record<string, string[]> = {}
    const seen: Record<string, Set<string>> = {}

    for (const selectedId of selectedOptionIds) {
        compat[selectedId]?.forEach(otherId => {
            const groupId = info[otherId]?.groupId
            if (groupId) {
                (seen[groupId] ??= new Set()).add(otherId)
            }
        })
    }

    Object.entries(seen).forEach(([groupId, set]) => {
        result[groupId] = [...set]
    })
    return result
}

const compatibilityMap = ref<Record<string, string[]>>({})  // { groupId: [available optionIds] }

onMounted(async () => {
    const variants = await loadBuyableVariants()
    const { compat, info } = indexVariants(variants)
    const defaultVariantOptionIds = Object.values(getSelectedOptions.value) as string[]
    compatibilityMap.value = buildGroupCompat(defaultVariantOptionIds, compat, info)
})


function optionState (group: Schemas["PropertyGroup"], option: Schemas["PropertyGroupOption"]): OptionStates {
    const selected = getSelectedOptions.value[group.name] === option.id
    const combinable = compatibilityMap.value[group.id]?.includes(option.id)
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
    // add all possible variant option color hex codes from the shop to display the color
    const colorClassMap: Record<string, string> = {
        '#0000ff': 'bg-[#0000ff]',
        '#ff0000': 'bg-[#ff0000]',
        '#ffffff': 'bg-[#ffffff]',
    }

    const hasColor = !!colorCode && colorClassMap[colorCode]
    const colorClass = hasColor ? colorClassMap[colorCode] : ''
    const isWhite = colorCode === '#ffffff'
    const textColorClass = isWhite ? ' text-neutral' : ' text-tertiary-content'
    const mutedTextColorClass = ' text-neutral/50'
    const hoverColorClass = isWhite
        ? ' hover:bg-neutral/15'
        : hasColor
            ? ` hover:${colorClass}/15`
            : ''

    const focusClass = ' focus-style'
    const borderClass = ' border border-border'
    const mutedBorderClass = ' border border-border/50'

    switch (state) {
        case 'selected':
            return [
                'border-2 border-neutral bg-neutral/15 cursor-pointer',
                focusClass,
                media ? '' : colorClass,
                hasColor ? textColorClass : ' text-neutral'
            ].join(' ').trim()

        case 'combinable':
            if (media) {
                return [
                    borderClass,
                    'hover:bg-neutral/15',
                    'cursor-pointer',
                    focusClass
                ].join(' ').trim()
            } else if (hasColor) {
                return [
                    textColorClass,
                    hoverColorClass,
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
                mutedTextColorClass,
                'cursor-pointer',
                focusClass,
                media ? '' : colorClass,
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
                        { 'min-h-[45px] px-4': !colorToProduct.get(variantOption.id)?.cover?.media },
                        { 'min-h-[105px] px-1': colorToProduct.get(variantOption.id)?.cover?.media },
                        optionStyles(optionState(variantGroup, variantOption), !!colorToProduct.get(variantOption.id)?.cover?.media.url, variantOption.colorHexCode),
                    ]"
                    @keydown.enter.prevent="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
                >
                    <img
                        v-if="variantGroup.displayType === 'color'"
                        :src="colorToProduct.get(variantOption.id)?.cover?.media.url"
                        :alt="colorToProduct.get(variantOption.id)?.cover?.media.translated.alt || ''"
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