import type { Schemas } from "#shopware";

export type UseNavigationCachedReturn = {
    /**
     * List of navigation elements
     */
    navigationElements: Ref<Schemas["NavigationRouteResponse"] | []>;
    /**
     * Load navigation elements
     */
    loadNavigationElements(params: {
        depth: number;
    }): Promise<Schemas["NavigationRouteResponse"]>;
};

/**
 * Composable to load and use navigation of different types
 * Data is not being shared to prevent serverside memory leaks.
 * To use data across the app, use provide data on high level and inject into children.
 */
export function useNavigationCachedFunction (params?: {
    type?: Schemas["NavigationType"] | string;
}): UseNavigationCachedReturn {
    const { localeProperties } = useI18n();
    const navigationElements = ref([])

    async function loadNavigationElements ({ depth }: { depth: number }) {
        navigationElements.value = await $fetch('/navigation', {
            method: 'POST',
            headers: {
                ...(localeProperties.value.localeId && { 'sw-language-id': localeProperties.value.localeId })
            },
            body: {
                type: params?.type,
                depth
            }
        })

        return navigationElements.value
    }

    return {
        navigationElements,
        loadNavigationElements,
    }
}

export const useNavigationCached = useNavigationCachedFunction
