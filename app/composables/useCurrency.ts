import type { Schemas } from "#shopware";
import { useContext, useShopwareContext } from "#imports";
import type { CookieRef } from "#app";

export type UseCurrencyReturn = {
    getAvailableCurrencies(): Promise<Schemas["Currency"][]>;
    currencies: Ref<Schemas["Currency"][]>,
    currencyCookie: CookieRef<string | null | undefined>
}

export function useCurrency (): UseCurrencyReturn {
    const { apiClient } = useShopwareContext();

    const _storeCurrencies = useContext<Schemas["Currency"][]>("swCurrencies");
    const currencyCookie = useCookie(
        "sw-currency",
        {
            path: "/",
            sameSite: "lax",
            secure: import.meta.client && document.location.protocol === "https:"
        }
    );

    async function getAvailableCurrencies () {
        return await apiClient.invoke("readCurrency post /currency", {}) as Schemas["Currency"][];
    }

    return {
        getAvailableCurrencies,
        currencies: _storeCurrencies,
        currencyCookie
    }
}
