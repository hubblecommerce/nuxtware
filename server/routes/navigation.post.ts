import type { Schemas } from '#shopware'
import { getCachedNavigation } from '../utils/shopware-get-cached-navigation'

export default defineEventHandler(async (event): Promise<Schemas['NavigationRouteResponse']> => {
    const languageId = event.headers.get('sw-language-id') ?? null
    const { type, depth } = await readBody(event)
    return await getCachedNavigation({
        type,
        depth,
        ...(languageId && { languageId }),
    })
})
