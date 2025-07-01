import type { Schemas } from "#shopware";
/* -------------------------------------------------
 * Logic for display of variant swatch using product media
 * ------------------------------------------------- */
const getSwatchVariantIdMap = (variants?: Schemas['Product'][]) => {
    const map = new Map<string, string>()

    ;(variants ?? []).forEach(variant => {
        const swatchOption = variant.options?.find(
            o => o.group?.displayType === 'color'
        )

        if (swatchOption && !map.has(swatchOption.id)) {
            map.set(swatchOption.id, variant.id)
        }
    })

    return map
}

export async function useProductVariantSwatches(variants: Schemas["Product"][]) {
    const { search } = useProductSearch()

    async function loadSwatchVariantProducts() {
        if (!variantIds.length) return
        return await Promise.all(
            variantIds.map(id => search(id))
        )
    }

    const swatchToVariantIds = getSwatchVariantIdMap(variants) // get one product it per variant swatch option
    const variantIds = [...new Set(swatchToVariantIds.values())] // product ids per variant swatch option
    const swatchToProduct = new Map<string, Schemas["Product"]>() // product object per variant swatch option

    const productsPerVariantSwatch = await loadSwatchVariantProducts()

    if (productsPerVariantSwatch) {
        for (const product of productsPerVariantSwatch) {
            const swatchId = [...swatchToVariantIds.entries()]
                .find(([, vId]) => vId === product.product?.id)?.[0]

            if (swatchId) swatchToProduct.set(swatchId, product.product)
        }
    }

    return { swatchToProduct }
}