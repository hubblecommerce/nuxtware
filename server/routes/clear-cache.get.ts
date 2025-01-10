// use this route to clear cache for a specific seo url or all seo urls
// @url http://localhost:3000/clear-cache?cacheKeyName=seoUrl (GET)
export default eventHandler(async (event) => {
    const query = getQuery(event);
    const cacheKeyName = (query.cacheKeyName as string) || '';

    const storage = useStorage();
    const cacheKeys = await storage.getKeys('cache/nitro/functions');
    const deletedKeys = [];

    for(let i = 0; i < cacheKeys.length; i++) {
        const key = cacheKeys[i];
        if (key.includes(cacheKeyName)) {
            await storage.removeItem(key);
            deletedKeys.push(key);
        }
    }

    return { clearedItems: deletedKeys.length };
});
