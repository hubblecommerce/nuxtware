import { shopwareApiClient } from "../utils/shopware-api-client";
import type { Schemas } from "#shopware";
import { getCachedSeoUrl } from "../utils/shopware-get-cached-seo-url";

async function getSeoUrls (opts: { page: number, limit: number }): Promise<{ total: number, limit: number, elements: Schemas["SeoUrl"][] }> {
    // @ts-expect-error Api client invoke is typed incorrect and includes elements only
    return await shopwareApiClient.invoke('readSeoUrl post /seo-url', {
        page: opts.page,
        limit: opts.limit,
        'total-count-mode': 'exact',
    })
}

// PROTOTYPE ONLY!
// use this route to warm up seo url cache, but it takes way to long for massive amount of urls
// also unsafe to have a public endpoint like this
// @url http://localhost:3000/seo-url-cache-warmup (GET)
export default eventHandler(async (event) => {
    const query = getQuery(event)
    const limit = query.limit as number || 100

    let response = await getSeoUrls({ page: 1, limit })

    if (response == null || response.total === 0 ) {
        return response
    }

    const maxPages = Math.ceil(response.total / response.limit);
    let elementsCount = 0;

    const start = performance.now();
    for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
        if (currentPage > 1) {
            response = await getSeoUrls({ page: currentPage, limit });
        }

        for (let i = 0; i < response.limit; i++) {
            const element = response.elements[i];
            if (typeof element !== "undefined") {
                elementsCount++
                const slug = '/' + element.seoPathInfo;
                await getCachedSeoUrl({ slug })
            }
        }
    }
    const end = performance.now();
    const performanceTime = `Execution time: ${((end - start) / 1000).toPrecision(3)} seconds.`;

    return { performanceTime, elementsCount };
})
