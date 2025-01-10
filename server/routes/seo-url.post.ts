import type { Schemas } from '#shopware'

export default defineEventHandler(async (event): Promise<Schemas['SeoUrl'] | null> => {
    const languageId = event.headers.get('sw-language-id') ?? null
    const { slug } = await readBody(event)
    return await getCachedSeoUrl({
        slug,
        ...(languageId && { languageId }),
    })
})
