<script setup lang="ts">
import type { Schemas } from '#shopware'
import { getPrefix } from '#imports'

/**
 * Init breadcrumbs context
 */
useBreadcrumbs();

/**
 * Init session context
 * Serverside initialized session is always a new one, so filled with saleschannel defaults.
 * Cookie sw-context-token is used clientside only.
 */
const { apiClient } = useShopwareContext();
const sessionContextData = ref<Schemas["SalesChannelContext"]>();
sessionContextData.value = await apiClient.invoke("readContext get /context");
const { languageIdChain, setCurrency, refreshSessionContext, sessionContext } = useSessionContext(sessionContextData.value);

/**
 * Handle i18n
 */
const { locale, availableLocales, defaultLocale, localeProperties, messages } =
    useI18n();
const router = useRouter();
const {
    getAvailableLanguages,
    getLanguageCodeFromId,
    getLanguageIdFromCode,
    changeLanguage,
    languages: storeLanguages
} = useInternationalization();

const { data: languages } = await useAsyncData("languages", async () => {
    return await getAvailableLanguages();
});
let languageToChangeId: string | null = null;

if (languages.value?.elements.length && router.currentRoute.value.name) {
    storeLanguages.value = languages.value?.elements;
    // Prefix from url
    const prefix = getPrefix(
        availableLocales,
        router.currentRoute.value.name as string,
        defaultLocale,
    );

    provide("cmsTranslations", messages.value[prefix ?? defaultLocale] ?? {});

    // Set session language
    // If locale has set specific localeId via i18n config
    if (localeProperties.value.localeId) {
        if (languageIdChain.value !== localeProperties.value.localeId) {
            languageToChangeId = localeProperties.value.localeId;
        }

        // Set default header sw-language-id to selected language id
        apiClient.defaultHeaders['sw-language-id'] = localeProperties.value.localeId;
    } else {
        // Otherwise find and set language from prefix
        // Important: Shopware language iso code and i18n language code have to match
        const sessionLanguage = getLanguageCodeFromId(languageIdChain.value);

        // If languages are not the same, set one from prefix
        if (sessionLanguage !== prefix) {
            languageToChangeId = getLanguageIdFromCode(
                prefix ? prefix : defaultLocale,
            );
        }
    }

    if (languageToChangeId) {
        await changeLanguage(languageToChangeId);
        await refreshSessionContext();
    }

    locale.value = prefix ? prefix : defaultLocale;
    // Set prefix from CMS components
    provide("urlPrefix", prefix);
}

/**
 * Init currency handling and price formatting
 */
const { getAvailableCurrencies, currencies: storeCurrencies, currencyCookie } = useCurrency()
const { data: currencies } = await useAsyncData("currencies", async () => {
    return await getAvailableCurrencies();
});

if (currencies.value.data != null) {
    storeCurrencies.value = currencies.value.data
}

// currency cookie isset? -> otherwise default currency so do nothing
if (currencyCookie?.value) {
    // check if cookie doesn't match current currency in session
    // -> otherwise default currency so do nothing
    if (currencyCookie.value !== sessionContext?.value?.currency?.id) {
        // set currency from cookie to session
        const currencyObj = currencies?.value?.data?.find((currency) => currency.id === currencyCookie.value)
        if (currencyObj) {
            await setCurrency(currencyObj)
        }
    }
}

// read the locale/lang code from accept-language header (i.e. en, en-GB or de-DE)
// and set configuration for price formatting globally
const headers = useRequestHeaders();
// Extract the first (with highest priority order) locale or lang code from accept-language header
// for example: "en-US;q=0.7,en;q=0.3" will return "en-US"
const localeFromHeader = headers?.["accept-language"]
    ?.split(",")
    ?.map(
        (languageConfig) => languageConfig.match(/^([a-z]{2}(?:-[A-Z]{2})?)/)?.[0],
    )
    .find(Boolean);

const { update } = usePrice();
if (localeFromHeader) {
    update({
        currencyCode: sessionContext.value?.currency?.isoCode || "",
        localeCode: localeFromHeader,
    });
}

/**
 * Init several contexts
 */
const { getWishlistProducts } = useWishlist();
const { refreshCart } = useCart();
useGlobalNotifications();
useAddress();

onMounted(() => {
    refreshCart();
    getWishlistProducts();
});

useHead({
    htmlAttrs: {
        lang: localeProperties.value.code
    },
})
</script>

<template>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
