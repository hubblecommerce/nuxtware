<script setup lang="ts">
import type { Schemas } from "#shopware"
import { buildUrlPrefix, getProductRoute } from "@shopware/helpers"

const router = useRouter()
const { getUrlPrefix } = useUrlResolver()

const prefix = getUrlPrefix()
const props = withDefaults(
    defineProps<{
        configurator: Schemas["PropertyGroup"][] | null,
        parentId: string | undefined,
        allowRedirect?: boolean
    }>(),
    {
        allowRedirect: true
    }
)

const {
    handleChange,
    getSelectedOptions,
    findVariantForSelectedOptions,
} = useProductConfigurator()
const { search } = useProductSearch()
const { apiClient } = useShopwareContext()

type OptionStates = 'selected' | 'combinable' | 'uncombinable' | 'disabled' | null
interface OptionInfo { id: string, groupId: string }
type CompatIndex = Record<string, Set<string>>

const emit = defineEmits<{
    "productVariantChanged": [product: Schemas["Product"]],
    "variantNotFound": []
}>()
const loading = ref(true)
const isLoading = ref(false)

watch(
    getSelectedOptions,
    async () => await onHandleChange()
)

const onHandleChange = async () => {
    isLoading.value = true
    
    try {
        const variantFound = await findVariantForSelectedOptions()

        console.log('variantFound: ', variantFound)

        if (variantFound) {
            const newProductVariant = await search(variantFound.id)
            emit('productVariantChanged', newProductVariant.product)
            
            if (props.allowRedirect) {
                const selectedOptionsVariantPath = buildUrlPrefix(
                    getProductRoute(variantFound),
                    prefix,
                )
                
                if (selectedOptionsVariantPath) {
                    try {
                        await router.push(selectedOptionsVariantPath)
                    } catch (error) {
                        console.error('Navigation failed for path:', selectedOptionsVariantPath, error)
                    }
                }
            }

            defaultVariantOptionIds.value = Object.values(getSelectedOptions.value) as string[]
            compatibilityMap.value = buildGroupCompat(defaultVariantOptionIds.value, compat, info)
        } else {
            // No variant found for the selected options combination
            emit('variantNotFound')
        }
    } finally {
        isLoading.value = false
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
const hasColorVariantGroups = computed(() => {
    return props.configurator?.some(group => group.displayType === 'color') ?? false
})

const compatibilityMap = ref<Record<string, string[]>>({})  // { groupId: [available optionIds] }
const { compat, info } = indexVariants(variants)
const defaultVariantOptionIds = ref(Object.values(getSelectedOptions.value) as string[])
compatibilityMap.value = buildGroupCompat(defaultVariantOptionIds.value, compat, info)

onMounted(async () => {
    loading.value = false
})

/* -------------------------------------------------
 * Logic for styling of variant group options
 * ------------------------------------------------- */
function optionState (group: Schemas["PropertyGroup"], option: Schemas["PropertyGroupOption"]): OptionStates {
    const selected = getSelectedOptions.value[group.name] === option.id
    const combinable = compatibilityMap.value[group.id]?.includes(option.id)

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

function optionStyles(state: OptionStates): string {
    const focusClass = ' focus-style'
    const borderClass = ' border border-border'
    const mutedBorderClass = ' border border-border/50'

    switch (state) {
        case 'selected':
            return [
                'border-2 border-primary bg-primary/15 cursor-pointer text-neutral',
                focusClass
            ].join(' ').trim()

        case 'combinable':
            return [
                borderClass,
                'hover:bg-neutral/15',
                'cursor-pointer',
                focusClass
            ].join(' ').trim()

        case 'uncombinable':
            return [
                mutedBorderClass,
                'text-neutral/50',
                'cursor-not-allowed',
                focusClass
            ].join(' ').trim()

        default:
            return ''
    }
}
</script>
<template>
    <section v-if="props.configurator != null && props.configurator.length > 0" :aria-label="$t('product.detail.variants')" class="relative flex flex-col gap-6">
        <div
            v-if="isLoading"
            class="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-white/75 rounded-md"
        >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral" />
        </div>
        
        <div v-for="variantGroup in props.configurator" :key="variantGroup.id">
            <LazyProductDetailVariantSwatchGroup
                v-if="hasColorVariantGroups"
                :variant-group="variantGroup"
                :variants="variants"
                :option-state="optionState"
                :handle-change="handleChange"
                :on-handle-change="onHandleChange"
            />
            <div v-else>
                <div class="text-sm font-semibold mb-2">{{ variantGroup.translated.name }}</div>
                <fieldset class="flex justify-start gap-2">
                    <legend class="sr-only">
                        {{ $t('product.detail.chooseOption') }} {{ variantGroup.translated.name }}
                    </legend>
                    <FoundationLabel
                        v-for="variantOption in variantGroup.options"
                        :key="variantOption.id"
                        tabindex="0"
                        :aria-label="`${variantGroup.translated.name}: ${variantOption.translated.name}`"
                        class="relative flex-shrink-0 text-sm flex justify-center items-center min-h-[45px] px-4 focus-style"
                        :class="optionStyles(optionState(variantGroup, variantOption))"
                        @keydown.enter.prevent="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
                        @keydown.space.prevent="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
                    >
                        <span>{{ variantOption.translated.name }}</span>
                        <input
                            type="radio"
                            :name="variantGroup.id"
                            :value="variantOption.id"
                            :checked="getSelectedOptions[variantGroup.translated.name] === variantOption.id"
                            :aria-describedby="`${variantOption.id}-description`"
                            class="sr-only"
                            @click="handleChange(variantGroup.translated.name, variantOption.id, onHandleChange)"
                        >
                        <span
                            :id="`${variantOption.id}-description`"
                            class="sr-only"
                        >
                            {{ optionState(variantGroup, variantOption) === 'selected' ? $t('product.detail.selected') : '' }}
                        </span>
                    </FoundationLabel>
                </fieldset>
            </div>
        </div>
    </section>
</template>