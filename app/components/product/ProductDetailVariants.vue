<script setup lang="ts">
import type { Schemas } from "#shopware"
import { buildUrlPrefix, getProductRoute } from "@shopware/helpers"
import { useProductVariantSwatches } from "#hubble/composables/useProductVariantSwatches";
const { $config } = useNuxtApp()

const props = defineProps<{
    configurator: Schemas["PropertyGroup"][] | null,
    parentId: string | undefined
}>()

const {
    handleChange,
    getSelectedOptions,
    findVariantForSelectedOptions,
} = useProductConfigurator()
const { apiClient } = useShopwareContext()
const selectedOptions = ref(getSelectedOptions.value)

type OptionStates = 'selected' | 'combinable' | 'uncombinable' | 'disabled' | null
interface OptionInfo { id: string, groupId: string }
type CompatIndex = Record<string, Set<string>>

const deactivatedGroups = ref<string[]>([])
const emit =
    defineEmits<
        (e: "productVariantChanged", selected: Partial<Schemas["Product"]> | undefined) => void
    >()
const { getUrlPrefix } = useUrlResolver()
const prefix = getUrlPrefix()
const isLoading = ref<boolean>()

/* -------------------------------------------------
 * Handle variant change
 * ------------------------------------------------- */

watch(
    getSelectedOptions,
    async () => {
        onHandleChange()
    }, { deep: true }
)

const onHandleChange = async () => {
    selectedOptions.value = getSelectedOptions.value
    const variantFound = await findVariantForSelectedOptions()

    if (variantFound && variantFound?.seoUrls?.length > 0) {
        emit('productVariantChanged', { data: variantFound })
        // Replace current url path with variant without losing optional GET params or language path
        const variantSeoUrl = variantFound.seoUrls[0].seoPathInfo
        const variantUrl = variantSeoUrl != null && variantSeoUrl !== '/undefined' ? variantSeoUrl : `${variantFound.id}`
        const newUrl = window.location.href.replace(
            window.location.pathname,
            `${$config?.app?.baseURL}${$config?.app?.baseURL === '/' ? '' : '/'}${variantUrl}`
        )
        window.history.replaceState({}, variantFound.name, newUrl)

        defaultVariantOptionIds.value = Object.values(getSelectedOptions.value) as string[]
        compatibilityMap.value = buildGroupCompat(defaultVariantOptionIds.value, compat, info)
    }
}

/* -------------------------------------------------
 * Logic for selectable options
 * ------------------------------------------------- */
const loadBuyableVariants = async (): Promise<Schemas["Product"][]> => {
    const parentId =
        props.parentId
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
    )
    return response.data.elements as Schemas["Product"][]
}

function indexVariants (variants: Schemas['Product'][]) {
    const compat: CompatIndex = {}
    const info: Record<string, OptionInfo> = {}

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

const variants = await loadBuyableVariants()
const hasSwatchOptionGroup = computed(() => {
    return variants.some((variant) => variant.options?.some((option) => option.group.displayType === 'color'))
})

const compatibilityMap = ref<Record<string, string[]>>({})  // { groupId: [available optionIds] }
const swatchToProduct = ref<Map<string, Schemas['Product']>>(new Map())
const { compat, info } = indexVariants(variants)
const defaultVariantOptionIds = ref(Object.values(getSelectedOptions.value) as string[])
compatibilityMap.value = buildGroupCompat(defaultVariantOptionIds.value, compat, info)

onMounted(() => {
    if (hasSwatchOptionGroup.value) loadVariantSwatches()
})

async function loadVariantSwatches() {
    const result = await useProductVariantSwatches(variants)
    swatchToProduct.value = result.swatchToProduct
}

function optionState (group: Schemas["PropertyGroup"], option: Schemas["PropertyGroupOption"]): OptionStates {
    const selected = getSelectedOptions.value[group.name] === option.id
    const combinable = compatibilityMap.value[group.id]?.includes(option.id)
    // TODO: check logic for disabled variants
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
        // if product has only 1 variant option group the compatibility map is empty
        if (Object.keys(compatibilityMap.value).length <= 0) {
            return 'combinable'
        } else
        return 'uncombinable'
    }

    return null
}

function optionStyles(state: OptionStates, media: boolean, swatchCode?: string): string {
    // add all possible variant option swatch hex codes from the shop to display the swatch
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
                    :aria-label="variantOption.translated.name"
                    class="relative flex-shrink-0 text-sm flex justify-center items-center"
                    :class="[
                        { 'min-h-[45px] px-4': !swatchToProduct.get(variantOption.id)?.cover?.media },
                        { 'min-h-[105px] px-1': swatchToProduct.get(variantOption.id)?.cover?.media },
                        optionStyles(optionState(variantGroup, variantOption), !!swatchToProduct.get(variantOption.id)?.cover?.media.url, variantOption.colorHexCode),
                    ]"
                    @keydown.enter.prevent="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
                >
                    <ProductDetailVariantSwatch
                        v-if="variantGroup.displayType === 'color'"
                        :variants="variants"
                        :variant-option-id="variantOption.id"
                        :swatch-map="swatchToProduct"
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