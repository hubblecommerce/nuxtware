import type { Schemas } from "#shopware";
/* -------------------------------------------------
 * Logic for display of variant color using product media
 * ------------------------------------------------- */
const getColorVariantIdMap = (variants?: Schemas['Product'][]) => {
    const map = new Map<string, string>()

    ;(variants ?? []).forEach(variant => {
        const colourOpt = variant.options?.find(
            o => o.group?.displayType === 'color'
        )

        if (colourOpt && !map.has(colourOpt.id)) {
            map.set(colourOpt.id, variant.id)
        }
    })

    return map
}

export async function useProductVariantSwatches(variants: Schemas["Product"][]) {
    const { search } = useProductSearch()

    async function loadColorVariantProducts() {
        if (!variantIds.length) return
        return await Promise.all(
            variantIds.map(id => search(id))
        )
    }

    const colourToVariantIds = getColorVariantIdMap(variants) // get one product it per variant swatch option
    const variantIds = [...new Set(colourToVariantIds.values())] // product ids per variant color option
    const colorToProduct = new Map<string, Schemas["Product"]>() // product object per variant color option

    const productsPerVariantColor = await loadColorVariantProducts()

    if (productsPerVariantColor) {
        for (const product of productsPerVariantColor) {
            const colourId = [...colourToVariantIds.entries()]
                .find(([, vId]) => vId === product.product?.id)?.[0]

            if (colourId) colorToProduct.set(colourId, product.product)
        }
    }

    return { colorToProduct }
}